import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

/**
 * Tailored pages at /for/<slug>, one JSON file each in content/pitches.
 * Written for one reader (a hiring team, a client) and kept out of search engines.
 */
const text = (max: number) => z.string().trim().max(max);

export const pitchSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: text(90).min(1),
  eyebrow: text(80).default(""),
  headline: text(120).min(1),
  headlineMuted: text(200).default(""),
  intro: text(800).default(""),
  hours: text(160).default(""),
  fitTitle: text(90).default("What you're hiring for, and what I've built"),
  fit: z.array(z.object({ need: text(200), built: text(900), projects: z.array(z.string()).default([]) })).default([]),
  weekTitle: text(60).default("The first week"),
  week: z.array(z.object({ when: text(40), what: text(500) })).default([]),
  gapsTitle: text(90).default("What I haven't done yet"),
  gaps: z.array(z.object({ need: text(120), note: text(500) })).default([]),
  stackTitle: text(60).default("What I work in"),
  stack: z.array(z.object({ group: text(40), items: text(200) })).default([]),
  ctaTitle: text(120).default("Let's talk."),
  ctaNote: text(200).default(""),
});

export type Pitch = z.infer<typeof pitchSchema>;

const DIR = path.join(process.cwd(), "content", "pitches");

export function pitches(): Pitch[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => pitchSchema.parse({ slug: f.replace(/\.json$/, ""), ...JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) }));
}

export function pitchBySlug(slug: string): Pitch | null {
  return pitches().find((p) => p.slug === slug) ?? null;
}
