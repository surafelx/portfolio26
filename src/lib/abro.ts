import crypto from "node:crypto";
import { education, jobs, profile as me, skills, work } from "@/content/site";
import { readJsonFile, writeRepoFile } from "./storage";

/**
 * The portfolio API Abro (the accountability bot) calls to add work and publish a resume.
 * Contract: abro/docs/PORTFOLIO_API.md. Auth: `Authorization: Bearer ABRO_API_KEY`. Same API as portfolio26.
 *
 * Everything Abro sends lives in content/abro.json, and the site reads that file when it builds
 * (src/content/abro.ts): published projects join Selected work, published posts join Writing, and
 * published skills become a "Currently learning" group. Drafts (visible: false) stay out of sight.
 * Resumes go to public/resume.pdf and public/resume.docx, and /cv points at them once they exist.
 * In "github" mode each save is a commit, so Vercel rebuilds and the change shows in about a minute.
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
export type Store = { entries: Entry[]; resume?: { updatedAt: string } };

export const STORE = "content/abro.json";

export class AbroError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
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
    id,
    kind,
    title,
    summary: clip(body.summary, 240),
    details: clip(body.details, 6000),
    stack: (Array.isArray(body.stack) ? body.stack : []).map((s) => clip(s, 40)).filter(Boolean).slice(0, 12),
    links: { live: url(links.live), code: url(links.code), post: url(links.post) },
    date: /^\d{4}-\d{2}$/.test(String(body.date)) ? String(body.date) : new Date().toISOString().slice(0, 7),
    visible: body.visible === true,
  };
}

const load = () => readJsonFile<Store>(STORE, { entries: [] });
const save = (store: Store, message: string) => writeRepoFile(STORE, Buffer.from(JSON.stringify(store, null, 2) + "\n"), message);

const siteBase = () => (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || me.siteUrl).replace(/\/+$/, "");
const whereShown = (e: Entry) => (e.visible ? `${siteBase()}/${e.kind === "post" ? "writing" : "work"}` : undefined);

export async function listEntries() {
  return (await load()).entries;
}

export async function putEntry(id: string, body: Record<string, unknown>) {
  const store = await load();
  const prev = store.entries.find((x) => x.id === id);
  const e = cleanEntry(id, body);
  // A re-sent draft never hides something already published; use PATCH visible:false for that.
  if (prev?.visible && body.visible !== true) e.visible = true;
  store.entries = [...store.entries.filter((x) => x.id !== id), e];
  await save(store, `Abro: ${prev ? "update" : "add"} ${e.kind} "${e.title}"`);
  return { entry: e, url: whereShown(e) };
}

export async function patchEntry(id: string, body: Record<string, unknown>) {
  const store = await load();
  const prev = store.entries.find((x) => x.id === id);
  if (!prev) throw new AbroError("No entry with that id.", 404);
  const e = cleanEntry(id, { ...prev, ...body, links: { ...prev.links, ...((body.links as object) ?? {}) } });
  store.entries = store.entries.map((x) => (x.id === id ? e : x));
  await save(store, `Abro: ${e.visible ? "publish" : "hide"} ${e.kind} "${e.title}"`);
  return { entry: e, url: whereShown(e) };
}

export async function deleteEntry(id: string) {
  const store = await load();
  const prev = store.entries.find((x) => x.id === id);
  if (!prev) throw new AbroError("No entry with that id.", 404);
  store.entries = store.entries.filter((x) => x.id !== id);
  await save(store, `Abro: remove ${prev.kind} "${prev.title}"`);
}

export function profile() {
  return {
    name: me.fullName,
    headline: work.headline,
    location: me.location,
    email: me.email,
    website: siteBase(),
    links: [
      { label: "GitHub", url: me.githubUrl },
      { label: "LinkedIn", url: me.linkedinUrl },
    ],
    summary: work.summary,
    experience: jobs.map((j) => ({ title: j.role, org: j.org, when: j.when, summary: "", bullets: [] })),
    education: education ? [{ title: education, org: "", when: "" }] : [],
    skills: skills.map((s) => ({ group: s.group, items: s.items.split(",").map((x) => x.trim()).filter(Boolean) })),
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
  const store = await load();
  store.resume = { updatedAt: new Date().toISOString() };
  await save(store, "Abro: note resume update");
  return { pdfUrl: `${siteBase()}/resume.pdf`, docxUrl: `${siteBase()}/resume.docx` };
}
