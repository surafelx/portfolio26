"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, Site } from "@/lib/schema";
import type { StorageMode } from "@/lib/storage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FieldSpec, ListEditor, ObjectForm } from "./fields";

type TabId = "profile" | "appearance" | "header" | "sections" | "projects" | "experience" | "writing" | "contact";

const TABS: { id: TabId; label: string; blurb: string }[] = [
  { id: "profile", label: "Profile", blurb: "Your name, headline, intro and links." },
  { id: "appearance", label: "Appearance", blurb: "Theme, colours, texture and scrolling." },
  { id: "header", label: "Stats and status", blurb: "Header stats, what you're doing now, and headline numbers." },
  { id: "sections", label: "Sections", blurb: "Show, hide, rename and reorder the screens of the site." },
  { id: "projects", label: "Projects", blurb: "Everything in the Featured, Products and Also built screens." },
  { id: "experience", label: "Experience", blurb: "Jobs, skills and education." },
  { id: "writing", label: "Writing and quotes", blurb: "Articles, and what clients say about you." },
  { id: "contact", label: "Contact", blurb: "The closing screen and footer." },
];

const profileFields: FieldSpec[] = [
  { key: "name", label: "Full name", type: "text" },
  { key: "shortName", label: "Name in the header", type: "text" },
  { key: "greeting", label: "Greeting", type: "text", placeholder: "Hi, I'm Surafel." },
  { key: "availability", label: "Availability", type: "text", hint: "Shown next to a green dot on the first screen." },
  { key: "headline", label: "Headline", type: "text" },
  { key: "headlineMuted", label: "Headline, second part", type: "text", hint: "Shown in grey after the headline." },
  { key: "intro", label: "Intro paragraph", type: "textarea" },
  { key: "location", label: "Location", type: "text" },
  { key: "timeZone", label: "Time zone", type: "text", hint: "Used for the local clock, for example Africa/Addis_Ababa." },
  { key: "email", label: "Email", type: "text" },
  { key: "bookingUrl", label: "Booking link", type: "url" },
  { key: "cvUrl", label: "CV link", type: "url", hint: "Put the PDF in the public folder and use /file-name.pdf." },
  { key: "githubUrl", label: "GitHub", type: "url" },
  { key: "linkedinUrl", label: "LinkedIn", type: "url" },
  { key: "seoTitle", label: "Search and share title", type: "text", hint: "What Google and link previews show. Up to 70 characters." },
  { key: "seoDescription", label: "Search and share description", type: "textarea" },
];

const appearanceFields: FieldSpec[] = [
  {
    key: "defaultTheme",
    label: "Default theme",
    type: "select",
    hint: "Visitors can still switch with the button in the header.",
    options: [
      { value: "system", label: "Match the visitor's device" },
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" },
    ],
  },
  { key: "texture", label: "Background texture", type: "range", min: 0, max: 100, hint: "0 turns the grain off." },
  { key: "accentLight", label: "Accent colour, light mode", type: "color" },
  { key: "accentDark", label: "Accent colour, dark mode", type: "color", hint: "Usually a lighter version of the light-mode colour." },
  { key: "snapScroll", label: "Snap to each screen while scrolling", type: "toggle", hint: "Desktop only. Phones always scroll freely." },
  { key: "animations", label: "Reveal screens as they scroll in", type: "toggle", hint: "Visitors who ask their device for less motion never see it." },
  { key: "showRail", label: "Show the section rail on the right", type: "toggle" },
  { key: "showProgress", label: "Show the progress line under the header", type: "toggle" },
];

const ACCENT_PRESETS = [
  { name: "Blue", light: "#2456d6", dark: "#7aa2ff" },
  { name: "Green", light: "#177a4f", dark: "#4fd39a" },
  { name: "Violet", light: "#5b3fd1", dark: "#a996ff" },
  { name: "Amber", light: "#a3570b", dark: "#f0a54a" },
  { name: "Graphite", light: "#1f2328", dark: "#e6e8eb" },
];

const statFields: FieldSpec[] = [
  { key: "value", label: "Value", type: "text", placeholder: "9 yrs" },
  { key: "label", label: "Label", type: "text", placeholder: "building software" },
];
const roleFields: FieldSpec[] = [
  { key: "title", label: "Role", type: "text" },
  { key: "org", label: "Organisation", type: "text" },
  { key: "place", label: "Place", type: "text" },
];
const sectionFields: FieldSpec[] = [
  { key: "visible", label: "Show this screen", type: "toggle" },
  { key: "nav", label: "Name in the section rail", type: "text" },
  { key: "eyebrow", label: "Small label", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "intro", label: "Intro", type: "textarea" },
];
const projectFields: FieldSpec[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "label", label: "Small label", type: "text", placeholder: "Built as CTO · 2025" },
  {
    key: "placement",
    label: "Where it appears",
    type: "select",
    options: [
      { value: "featured", label: "Featured screen (large)" },
      { value: "grid", label: "Products screen (with screenshot)" },
      { value: "compact", label: "Also built screen (text only)" },
    ],
  },
  { key: "visible", label: "Show on the site", type: "toggle" },
  { key: "tagline", label: "One-line description", type: "textarea" },
  { key: "image", label: "Screenshot", type: "image", hint: "Used on the Featured and Products screens. 16:10 works best." },
  { key: "liveUrl", label: "Live link", type: "url" },
  { key: "codeUrl", label: "Code link", type: "url" },
  { key: "ctaLabel", label: "Extra button text", type: "text", placeholder: "Book a demo" },
  { key: "ctaUrl", label: "Extra button link", type: "url" },
  { key: "id", label: "ID", type: "text", hint: "Lowercase letters, numbers and dashes. Must be unique." },
];
const stepFields: FieldSpec[] = [
  { key: "name", label: "Step", type: "text" },
  { key: "note", label: "Note", type: "text" },
];
const jobFields: FieldSpec[] = [
  { key: "title", label: "Role", type: "text" },
  { key: "when", label: "Dates", type: "text", placeholder: "2024 – now" },
  { key: "org", label: "Organisation and place", type: "text", wide: true },
  { key: "summary", label: "One-line summary", type: "textarea" },
  { key: "visible", label: "Show on the site", type: "toggle" },
];
const skillFields: FieldSpec[] = [
  { key: "group", label: "Group", type: "text" },
  { key: "items", label: "Skills, comma separated", type: "textarea" },
];
const postFields: FieldSpec[] = [
  { key: "title", label: "Title", type: "text", wide: true },
  { key: "date", label: "Date", type: "text", placeholder: "June 2026" },
  { key: "url", label: "Link", type: "url" },
  { key: "summary", label: "Summary", type: "textarea" },
];
const testimonialFields: FieldSpec[] = [
  { key: "quote", label: "Quote", type: "textarea" },
  { key: "name", label: "Who said it", type: "text", hint: "A name, or a description like \"AI project client\" if you don't have permission to name them." },
  { key: "role", label: "Role or source", type: "text", placeholder: "Upwork" },
];
const contactFields: FieldSpec[] = [
  { key: "note", label: "Note under the buttons", type: "text", wide: true },
  { key: "footerNote", label: "Footer description", type: "textarea" },
];

type Issue = { path: string; message: string };

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
}

export function Editor({ initial, mode }: { initial: Site; mode: StorageMode }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Site>(initial);
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(initial));
  const [tab, setTab] = useState<TabId>("profile");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const importRef = useRef<HTMLInputElement>(null);

  const dirty = useMemo(() => JSON.stringify(draft) !== savedJson, [draft, savedJson]);
  const errors = useMemo(() => Object.fromEntries(issues.map((i) => [i.path, i.message])), [issues]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const set = <K extends keyof Site>(key: K, value: Site[K]) => setDraft((d) => ({ ...d, [key]: value }));

  async function save() {
    if (saving) return;
    if (mode === "readonly") {
      setNotice({ tone: "error", text: "Saving is off on this deployment. See the note at the top of the page." });
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const body = (await res.json()) as { message?: string; error?: string; issues?: Issue[]; data?: Site };
      if (!res.ok) {
        setIssues(body.issues ?? []);
        setNotice({ tone: "error", text: body.issues?.length ? `${body.error} ${describeIssue(body.issues[0])}` : body.error ?? "Saving failed." });
        if (body.issues?.[0]) {
          const first = body.issues[0].path.split(".")[0];
          const map: Record<string, TabId> = { profile: "profile", settings: "appearance", headerStats: "header", now: "header", highlights: "header", sections: "sections", projects: "projects", jobs: "experience", skills: "experience", education: "experience", posts: "writing", testimonials: "writing", contact: "contact" };
          if (map[first]) setTab(map[first]);
        }
        return;
      }
      setIssues([]);
      if (body.data) {
        setDraft(body.data);
        setSavedJson(JSON.stringify(body.data));
      }
      setNotice({ tone: "ok", text: body.message ?? "Saved." });
      router.refresh();
    } catch {
      setNotice({ tone: "error", text: "Couldn't reach the server. Your changes are still here, try again." });
    } finally {
      setSaving(false);
    }
  }

  function describeIssue(issue: Issue) {
    return `First: ${issue.path.replace(/\.(\d+)\./g, (_, n) => ` #${Number(n) + 1} `)} – ${issue.message}.`;
  }

  async function logout() {
    if (dirty && !window.confirm("You have unsaved changes. Sign out anyway?")) return;
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `site-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function importJson(file: File) {
    try {
      const parsed = JSON.parse(await file.text()) as Site;
      if (!parsed || typeof parsed !== "object" || !("profile" in parsed) || !("projects" in parsed)) throw new Error("shape");
      setDraft(parsed);
      setNotice({ tone: "ok", text: `Loaded ${file.name}. Review it, then save to publish.` });
    } catch {
      setNotice({ tone: "error", text: "That file isn't a site content backup." });
    }
  }

  const current = TABS.find((t) => t.id === tab)!;
  const tabHasIssue = (id: TabId) => {
    const roots: Record<TabId, string[]> = {
      profile: ["profile"],
      appearance: ["settings"],
      header: ["headerStats", "now", "highlights"],
      sections: ["sections"],
      projects: ["projects"],
      experience: ["jobs", "skills", "education"],
      writing: ["posts", "testimonials"],
      contact: ["contact"],
    };
    return issues.some((i) => roots[id].includes(i.path.split(".")[0]));
  };

  return (
    <div className="admin">
      <header className="admin-top">
        <div className="admin-brand">
          <span className="label">Site settings</span>
          <strong>{draft.profile.shortName}</strong>
        </div>
        <div className="admin-status" aria-live="polite">
          {dirty ? <span className="pill warn">Unsaved changes</span> : <span className="pill ok">All changes saved</span>}
        </div>
        <div className="admin-actions">
          <ThemeToggle />
          <a className="btn line sm" href="/" target="_blank" rel="noopener noreferrer">
            View site
          </a>
          <button type="button" className="btn sm" onClick={() => void save()} disabled={saving || !dirty}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </header>

      {mode !== "local" && (
        <div className={`mode-note ${mode}`}>
          {mode === "github"
            ? "Saves are committed to your GitHub repo. Vercel rebuilds the site after each save, which takes about a minute."
            : "This deployment can't save: Vercel's disk is read-only. Add GITHUB_TOKEN and GITHUB_REPO to the project's environment variables and redeploy, or edit on your own machine."}
        </div>
      )}

      <div className="admin-body">
        <nav className="admin-nav" aria-label="Settings sections">
          {TABS.map((t) => (
            <button key={t.id} type="button" className={tab === t.id ? "active" : ""} aria-current={tab === t.id ? "page" : undefined} onClick={() => setTab(t.id)}>
              {t.label}
              {tabHasIssue(t.id) && <span className="dot-warn" aria-label="has issues" />}
            </button>
          ))}
          <div className="nav-foot">
            <button type="button" onClick={exportJson}>
              Download backup
            </button>
            <button type="button" onClick={() => importRef.current?.click()}>
              Load a backup
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Throw away unsaved changes?")) {
                  setDraft(JSON.parse(savedJson) as Site);
                  setIssues([]);
                  setNotice(null);
                }
              }}
              disabled={!dirty}
            >
              Discard changes
            </button>
            <button type="button" onClick={() => void logout()}>
              Sign out
            </button>
            <input
              ref={importRef}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void importJson(f);
                e.target.value = "";
              }}
            />
          </div>
        </nav>

        <main className="admin-main">
          <div className="panel-head">
            <h1>{current.label}</h1>
            <p>{current.blurb}</p>
          </div>

          {notice && (
            <div className={`notice ${notice.tone}`} role={notice.tone === "error" ? "alert" : "status"}>
              {notice.text}
              <button type="button" aria-label="Dismiss" onClick={() => setNotice(null)}>
                ×
              </button>
            </div>
          )}

          {tab === "profile" && (
            <section className="card">
              <ObjectForm value={draft.profile} fields={profileFields} onChange={(v) => set("profile", v)} errors={errors} errorPrefix="profile" />
            </section>
          )}

          {tab === "appearance" && (
            <>
              <section className="card">
                <h2>Accent presets</h2>
                <div className="presets">
                  {ACCENT_PRESETS.map((p) => {
                    const on = draft.settings.accentLight === p.light && draft.settings.accentDark === p.dark;
                    return (
                      <button key={p.name} type="button" className={`preset${on ? " on" : ""}`} aria-pressed={on} onClick={() => set("settings", { ...draft.settings, accentLight: p.light, accentDark: p.dark })}>
                        <span className="sw" style={{ background: `linear-gradient(135deg, ${p.light} 50%, ${p.dark} 50%)` }} aria-hidden="true" />
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </section>
              <section className="card">
                <ObjectForm value={draft.settings} fields={appearanceFields} onChange={(v) => set("settings", v)} errors={errors} errorPrefix="settings" />
              </section>
              <section className="card">
                <h2>Preview</h2>
                <div className="appearance-preview">
                  {(["light", "dark"] as const).map((m) => {
                    const accent = m === "light" ? draft.settings.accentLight : draft.settings.accentDark;
                    return (
                      <div key={m} className={`ap ap-${m}`} style={{ ["--ap-accent" as string]: accent, ["--ap-grain" as string]: String(draft.settings.texture / 100) }}>
                        <span className="label">{m === "light" ? "Light mode" : "Dark mode"}</span>
                        <strong>{draft.profile.headline}</strong>
                        <span className="ap-btn">See the work</span>
                        <span className="ap-link">Open →</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          {tab === "header" && (
            <>
              <section className="card">
                <h2>Header stats</h2>
                <p className="card-note">Shown in the bar at the top of every screen. Keep values short.</p>
                <ListEditor
                  items={draft.headerStats}
                  onChange={(v) => set("headerStats", v)}
                  fields={statFields}
                  titleOf={(s) => `${s.value} ${s.label}`}
                  makeNew={() => ({ value: "", label: "" })}
                  addLabel="Add a stat"
                  max={5}
                  errors={errors}
                  errorPrefix="headerStats"
                />
              </section>
              <section className="card">
                <h2>Right now</h2>
                <p className="card-note">The roles in the panel on the first screen.</p>
                <ListEditor
                  items={draft.now}
                  onChange={(v) => set("now", v)}
                  fields={roleFields}
                  titleOf={(r) => r.title}
                  subtitleOf={(r) => r.org}
                  makeNew={() => ({ title: "", org: "", place: "" })}
                  addLabel="Add a role"
                  max={5}
                  errors={errors}
                  errorPrefix="now"
                />
              </section>
              <section className="card">
                <h2>Big numbers</h2>
                <p className="card-note">The four figures on the Also built screen.</p>
                <ListEditor
                  items={draft.highlights}
                  onChange={(v) => set("highlights", v)}
                  fields={statFields}
                  titleOf={(s) => `${s.value} ${s.label}`}
                  makeNew={() => ({ value: "", label: "" })}
                  addLabel="Add a number"
                  max={4}
                  errors={errors}
                  errorPrefix="highlights"
                />
              </section>
            </>
          )}

          {tab === "sections" && (
            <section className="card">
              <p className="card-note">Each section is one full screen. Use the arrows to change the order visitors scroll through them.</p>
              <ListEditor
                items={draft.sections}
                onChange={(v) => set("sections", v)}
                fields={sectionFields}
                titleOf={(s) => s.nav || s.eyebrow || s.id}
                subtitleOf={(s) => s.title}
                canRemove={false}
                isHidden={(s) => !s.visible}
                errors={errors}
                errorPrefix="sections"
              />
            </section>
          )}

          {tab === "projects" && (
            <section className="card">
              <p className="card-note">A project with steps and no screenshot shows as a step-by-step card on the Featured screen.</p>
              <ListEditor
                items={draft.projects}
                onChange={(v) => set("projects", v)}
                fields={projectFields}
                titleOf={(p) => p.name}
                subtitleOf={(p) => ({ featured: "Featured", grid: "Products", compact: "Also built" })[p.placement]}
                isHidden={(p) => !p.visible}
                makeNew={(): Project => {
                  const n = draft.projects.length + 1;
                  return { id: `project-${n}-${Date.now().toString(36).slice(-4)}`, name: "New project", label: "", tagline: "", placement: "grid", image: "", liveUrl: "", codeUrl: "", ctaLabel: "", ctaUrl: "", steps: [], visible: true };
                }}
                addLabel="Add a project"
                errors={errors}
                errorPrefix="projects"
                extra={(project, update, index) => (
                  <div className="nested">
                    <div className="nested-head">
                      <h3>Steps</h3>
                      {project.name && project.id.startsWith("project-") && (
                        <button type="button" className="btn-quiet" onClick={() => update({ ...project, id: slugify(project.name) || project.id })}>
                          Set ID from name
                        </button>
                      )}
                    </div>
                    <ListEditor
                      items={project.steps}
                      onChange={(steps) => update({ ...project, steps })}
                      fields={stepFields}
                      titleOf={(s) => s.name}
                      subtitleOf={(s) => s.note}
                      makeNew={() => ({ name: "", note: "" })}
                      addLabel="Add a step"
                      max={6}
                      errors={errors}
                      errorPrefix={`projects.${index}.steps`}
                    />
                  </div>
                )}
              />
            </section>
          )}

          {tab === "experience" && (
            <>
              <section className="card">
                <h2>Jobs</h2>
                <ListEditor
                  items={draft.jobs}
                  onChange={(v) => set("jobs", v)}
                  fields={jobFields}
                  titleOf={(j) => j.title}
                  subtitleOf={(j) => `${j.org} · ${j.when}`}
                  isHidden={(j) => !j.visible}
                  makeNew={() => ({ when: "", title: "", org: "", summary: "", visible: true })}
                  addLabel="Add a job"
                  errors={errors}
                  errorPrefix="jobs"
                />
              </section>
              <section className="card">
                <h2>Skills</h2>
                <ListEditor
                  items={draft.skills}
                  onChange={(v) => set("skills", v)}
                  fields={skillFields}
                  titleOf={(s) => s.group}
                  makeNew={() => ({ group: "", items: "" })}
                  addLabel="Add a skill group"
                  max={6}
                  errors={errors}
                  errorPrefix="skills"
                />
              </section>
              <section className="card">
                <h2>Education</h2>
                <ObjectForm
                  value={{ education: draft.education }}
                  fields={[{ key: "education", label: "Education line", type: "text", wide: true }]}
                  onChange={(v) => set("education", String(v.education))}
                  errors={errors}
                />
              </section>
            </>
          )}

          {tab === "writing" && (
            <>
              <section className="card">
                <h2>Articles</h2>
                <ListEditor
                  items={draft.posts}
                  onChange={(v) => set("posts", v)}
                  fields={postFields}
                  titleOf={(p) => p.title}
                  subtitleOf={(p) => p.date}
                  makeNew={() => ({ date: "", title: "", summary: "", url: "" })}
                  addLabel="Add an article"
                  max={9}
                  errors={errors}
                  errorPrefix="posts"
                />
              </section>
              <section className="card">
                <h2>What clients say</h2>
                <p className="card-note">Shown on their own screen. Three fit best side by side.</p>
                <ListEditor
                  items={draft.testimonials}
                  onChange={(v) => set("testimonials", v)}
                  fields={testimonialFields}
                  titleOf={(t) => t.name}
                  subtitleOf={(t) => t.quote}
                  makeNew={() => ({ quote: "", name: "", role: "" })}
                  addLabel="Add a quote"
                  max={6}
                  errors={errors}
                  errorPrefix="testimonials"
                />
              </section>
            </>
          )}

          {tab === "contact" && (
            <section className="card">
              <p className="card-note">The title and intro for this screen are under Sections. Email and booking link are under Profile.</p>
              <ObjectForm value={draft.contact} fields={contactFields} onChange={(v) => set("contact", v)} errors={errors} errorPrefix="contact" />
            </section>
          )}

          <p className="shortcut">Tip: press Ctrl+S or ⌘S to save.</p>
        </main>
      </div>
    </div>
  );
}
