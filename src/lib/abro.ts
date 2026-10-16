import crypto from "node:crypto";
import { siteSchema, type Site } from "./schema";
import { readContent, readJsonFile, writeContent, writeRepoFile } from "./storage";

/**
 * The portfolio API Abro (the accountability bot) calls to add work and publish a resume.
 * Contract: https://github.com/… abro/docs/PORTFOLIO_API.md. Auth: `Authorization: Bearer ABRO_API_KEY`.
 *
 * Where things go:
 * - project → content/site.json `projects` (placement "grid"). A draft is `visible: false`, so it also shows in /admin.
 * - post    → `posts` once published (newest first). Posts have no hidden flag, so drafts wait in content/abro.json.
 * - skill   → an item in the "Currently learning" skills group once published; drafts wait in content/abro.json.
 * - resume  → public/resume.pdf and public/resume.docx.
 * content/abro.json keeps every entry Abro sent, so GET /entries and later updates know what's what.
 */

export type Entry = {
  id: string;
  kind: "project" | "post" | "skill";
  title: string;
  summary: string;
  details: string;
  stack: string[];
  links: { live?: string; code?: string; post?: string };
  date: string;
  visible: boolean;
};
type Store = { entries: Entry[]; resume?: { updatedAt: string } };

const STORE = "content/abro.json";
const LEARNING = "Currently learning";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export class AbroError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export function checkKey(request: Request) {
  const key = process.env.ABRO_API_KEY ?? "";
  if (!key) throw new AbroError("Abro isn't set up on this site (ABRO_API_KEY is missing).", 503);
  const given = Buffer.from((request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, ""));
  const want = Buffer.from(key);
  if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) throw new AbroError("Bad key.", 401);
}

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
const url = (v: unknown) => (typeof v === "string" && /^https?:\/\//.test(v.trim()) ? v.trim().slice(0, 500) : "");

export function cleanEntry(id: string, body: Record<string, unknown>): Entry {
  if (!/^[a-z0-9-]{3,80}$/.test(id)) throw new AbroError("Entry ids use lowercase letters, numbers and dashes.");
  const kind = body.kind === "post" || body.kind === "skill" ? body.kind : "project";
  const title = clip(body.title, 60);
  if (!title) throw new AbroError("An entry needs a title.");
  const links = (body.links && typeof body.links === "object" ? body.links : {}) as Record<string, unknown>;
  return {
    id, kind, title,
    summary: clip(body.summary, 240),
    details: clip(body.details, 6000),
    stack: (Array.isArray(body.stack) ? body.stack : []).map(s => clip(s, 40)).filter(Boolean).slice(0, 12),
    links: { live: url(links.live), code: url(links.code), post: url(links.post) },
    date: /^\d{4}-\d{2}$/.test(String(body.date)) ? String(body.date) : new Date().toISOString().slice(0, 7),
    visible: body.visible === true,
  };
}

const monthLabel = (date: string) => { const [y, m] = date.split("-").map(Number); return `${MONTHS[(m || 1) - 1]} ${y}`; };

async function load() {
  const site = siteSchema.parse(await readContent());
  const store = await readJsonFile<Store>(STORE, { entries: [] });
  return { site, store };
}

/** Put the entry into site.json the way it should look now (or take it out). */
function apply(site: Site, e: Entry, remove = false): Site {
  const next = structuredClone(site);
  const postKey = (p: { title: string; url: string }) => p.url === (e.links.post || e.links.live) || p.title === e.title;

  next.projects = next.projects.filter(p => p.id !== e.id);
  next.posts = next.posts.filter(p => !(e.kind === "post" && postKey(p)));
  next.skills = next.skills.map(g => g.group === LEARNING ? { ...g, items: g.items.split(",").map(s => s.trim()).filter(s => s && s !== e.title).join(", ") } : g)
    .filter(g => g.group !== LEARNING || g.items);
  if (remove) return next;

  if (e.kind === "project") {
    next.projects.push({
      id: e.id, name: e.title, label: `Built · ${monthLabel(e.date)}`, tagline: e.summary, placement: "grid",
      image: "", liveUrl: e.links.live ?? "", codeUrl: e.links.code ?? "", ctaLabel: "", ctaUrl: "", videoUrl: "",
      docsUrl: e.links.post ?? "", stack: e.stack.join(", ").slice(0, 200), details: e.details, steps: [], visible: e.visible,
    });
  } else if (e.kind === "post" && e.visible) {
    next.posts = [{ date: monthLabel(e.date), title: e.title.slice(0, 120), summary: e.summary, url: e.links.post || e.links.live || "" }, ...next.posts].slice(0, 9);
  } else if (e.kind === "skill" && e.visible) {
    const g = next.skills.find(s => s.group === LEARNING);
    if (g) g.items = [g.items, e.title].filter(Boolean).join(", ").slice(0, 300);
    else if (next.skills.length < 6) next.skills.push({ group: LEARNING, items: e.title });
  }
  return next;
}

const siteBase = () => (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "").replace(/\/+$/, "");
const whereShown = (e: Entry) => (e.visible ? `${siteBase()}/${e.kind === "project" ? `#project-${e.id}` : e.kind === "post" ? "#posts" : "#skills"}` : undefined);

async function save(site: Site, store: Store, message: string) {
  await writeContent(siteSchema.parse(site));
  await writeRepoFile(STORE, Buffer.from(JSON.stringify(store, null, 2) + "\n"), message);
}

export async function listEntries() {
  return (await load()).store.entries;
}

export async function putEntry(id: string, body: Record<string, unknown>) {
  const { site, store } = await load();
  const prev = store.entries.find(x => x.id === id);
  const e = cleanEntry(id, body);
  // A re-sent draft never hides something already published; use PATCH visible:false for that.
  if (prev?.visible && body.visible !== true) e.visible = true;
  store.entries = [...store.entries.filter(x => x.id !== id), e];
  await save(apply(site, e), store, `Abro: ${prev ? "update" : "add"} ${e.kind} "${e.title}"`);
  return { entry: e, url: whereShown(e) };
}

export async function patchEntry(id: string, body: Record<string, unknown>) {
  const { site, store } = await load();
  const prev = store.entries.find(x => x.id === id);
  if (!prev) throw new AbroError("No entry with that id.", 404);
  const e = cleanEntry(id, { ...prev, ...body, links: { ...prev.links, ...((body.links as object) ?? {}) } });
  store.entries = store.entries.map(x => (x.id === id ? e : x));
  await save(apply(site, e), store, `Abro: ${e.visible ? "publish" : "hide"} ${e.kind} "${e.title}"`);
  return { entry: e, url: whereShown(e) };
}

export async function deleteEntry(id: string) {
  const { site, store } = await load();
  const prev = store.entries.find(x => x.id === id);
  if (!prev) throw new AbroError("No entry with that id.", 404);
  store.entries = store.entries.filter(x => x.id !== id);
  await save(apply(site, prev, true), store, `Abro: remove ${prev.kind} "${prev.title}"`);
}

export async function profile() {
  const { site } = await load();
  const p = site.profile;
  return {
    name: p.name,
    headline: [p.headline, p.headlineMuted].filter(Boolean).join(" "),
    location: "",
    email: "",
    website: siteBase(),
    links: site.live.githubUser ? [{ label: "GitHub", url: `https://github.com/${site.live.githubUser}` }] : [],
    summary: p.intro,
    experience: site.jobs.filter(j => j.visible).map(j => ({ title: j.title, org: j.org, when: j.when, summary: j.summary, bullets: [] })),
    education: site.education ? [{ title: site.education, org: "", when: "" }] : [],
    skills: site.skills.map(s => ({ group: s.group, items: s.items.split(",").map(x => x.trim()).filter(Boolean) })),
  };
}

export async function putResume(body: Record<string, unknown>) {
  const pdf = typeof body.pdf === "string" ? Buffer.from(body.pdf, "base64") : null;
  const docx = typeof body.docx === "string" ? Buffer.from(body.docx, "base64") : null;
  if (!pdf?.subarray(0, 4).equals(Buffer.from("%PDF"))) throw new AbroError("The PDF is missing or isn't a PDF.");
  if (!docx?.subarray(0, 2).equals(Buffer.from("PK"))) throw new AbroError("The Word file is missing or isn't a .docx.");
  if (pdf.length > 3_000_000 || docx.length > 3_000_000) throw new AbroError("Resume files must be under 3 MB.");
  await writeRepoFile("public/resume.pdf", pdf, "Abro: update resume (PDF)");
  await writeRepoFile("public/resume.docx", docx, "Abro: update resume (Word)");
  const store = await readJsonFile<Store>(STORE, { entries: [] });
  store.resume = { updatedAt: new Date().toISOString() };
  await writeRepoFile(STORE, Buffer.from(JSON.stringify(store, null, 2) + "\n"), "Abro: note resume update");
  return { pdfUrl: `${siteBase()}/resume.pdf`, docxUrl: `${siteBase()}/resume.docx` };
}
