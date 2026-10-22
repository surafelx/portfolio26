import fs from "node:fs";
import path from "node:path";

/**
 * Tailored pages at /for/<slug>, one JSON file each in content/pitches (carried over from portfolio26).
 * Written for one reader (a hiring team, a client) and kept out of search engines.
 * Missing fields fall back to the defaults below, so a pitch file only needs what it uses.
 */
export type Pitch = {
  slug: string;
  title: string;
  eyebrow: string;
  headline: string;
  headlineMuted: string;
  intro: string;
  hours: string;
  fitTitle: string;
  fit: { need: string; built: string; projects: string[] }[];
  weekTitle: string;
  week: { when: string; what: string }[];
  gapsTitle: string;
  gaps: { need: string; note: string }[];
  stackTitle: string;
  stack: { group: string; items: string }[];
  ctaTitle: string;
  ctaNote: string;
};

const DEFAULTS: Omit<Pitch, "slug" | "title" | "headline"> = {
  eyebrow: "",
  headlineMuted: "",
  intro: "",
  hours: "",
  fitTitle: "What you're hiring for, and what I've built",
  fit: [],
  weekTitle: "The first week",
  week: [],
  gapsTitle: "What I haven't done yet",
  gaps: [],
  stackTitle: "What I work in",
  stack: [],
  ctaTitle: "Let's talk.",
  ctaNote: "",
};

const DIR = path.join(process.cwd(), "content", "pitches");

function read(file: string): Pitch {
  const slug = file.replace(/\.json$/, "");
  const raw = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8")) as Partial<Pitch>;
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`Pitch file names use lowercase letters, numbers and dashes: ${file}`);
  if (!raw.title || !raw.headline) throw new Error(`${file} needs a title and a headline.`);
  const pitch = { ...DEFAULTS, ...raw, slug } as Pitch;
  pitch.fit = pitch.fit.map((f) => ({ ...f, projects: f.projects ?? [] }));
  return pitch;
}

export function pitches(): Pitch[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).sort().map(read);
}

export function pitchBySlug(slug: string): Pitch | null {
  return pitches().find((p) => p.slug === slug) ?? null;
}
