import { z } from "zod";

/**
 * The whole site is one JSON document (content/site.json) validated by this schema.
 * The admin editor edits it, the API validates it before saving, and the site renders it.
 */

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex colour like #2456d6");
const text = (max: number) => z.string().trim().max(max);
const link = z.string().trim().max(500);

export const SECTION_IDS = ["hero", "featured", "products", "more", "experience", "testimonials", "writing", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const statSchema = z.object({
  value: text(14).min(1, "Add a value"),
  label: text(48).min(1, "Add a label"),
});

export const roleSchema = z.object({
  title: text(60).min(1, "Add a title"),
  org: text(80).min(1, "Add an organisation"),
  place: text(60).default(""),
});

export const stepSchema = z.object({
  name: text(40).min(1, "Name the step"),
  note: text(24).default(""),
});

export const projectSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
  name: text(60).min(1, "Name the project"),
  label: text(60).default(""),
  tagline: text(260).default(""),
  placement: z.enum(["featured", "grid", "compact"]),
  image: link.default(""),
  liveUrl: link.default(""),
  codeUrl: link.default(""),
  ctaLabel: text(40).default(""),
  ctaUrl: link.default(""),
  steps: z.array(stepSchema).max(6).default([]),
  visible: z.boolean().default(true),
});

export const jobSchema = z.object({
  when: text(24).min(1, "Add dates"),
  title: text(60).min(1, "Add a title"),
  org: text(80).default(""),
  summary: text(200).default(""),
  visible: z.boolean().default(true),
});

export const skillSchema = z.object({
  group: text(40).min(1, "Name the group"),
  items: text(300).default(""),
});

export const postSchema = z.object({
  date: text(24).default(""),
  title: text(120).min(1, "Add a title"),
  summary: text(240).default(""),
  url: link.default(""),
});

export const testimonialSchema = z.object({
  quote: text(400).min(1, "Add the quote"),
  name: text(60).min(1, "Add who said it"),
  role: text(60).default(""),
});

export const sectionSchema = z.object({
  id: z.enum(SECTION_IDS),
  visible: z.boolean().default(true),
  nav: text(20).default(""),
  eyebrow: text(40).default(""),
  title: text(90).default(""),
  intro: text(240).default(""),
});

export const siteSchema = z
  .object({
    profile: z.object({
      name: text(60).min(1),
      shortName: text(30).min(1),
      greeting: text(60).default(""),
      headline: text(80).default(""),
      headlineMuted: text(80).default(""),
      intro: text(400).default(""),
      availability: text(80).default(""),
      location: text(60).default(""),
      timeZone: z.string().default("Africa/Addis_Ababa"),
      email: text(120).default(""),
      bookingUrl: link.default(""),
      cvUrl: link.default(""),
      githubUrl: link.default(""),
      linkedinUrl: link.default(""),
      seoTitle: text(70).default(""),
      seoDescription: text(170).default(""),
    }),
    settings: z.object({
      defaultTheme: z.enum(["system", "light", "dark"]).default("system"),
      accentLight: hex.default("#2456d6"),
      accentDark: hex.default("#7aa2ff"),
      texture: z.number().int().min(0).max(100).default(45),
      snapScroll: z.boolean().default(true),
      animations: z.boolean().default(true),
      showRail: z.boolean().default(true),
      showProgress: z.boolean().default(true),
    }),
    headerStats: z.array(statSchema).max(5),
    now: z.array(roleSchema).max(5),
    highlights: z.array(statSchema).max(4),
    sections: z.array(sectionSchema),
    projects: z.array(projectSchema),
    jobs: z.array(jobSchema),
    skills: z.array(skillSchema).max(6),
    education: text(200).default(""),
    posts: z.array(postSchema).max(9),
    testimonials: z.array(testimonialSchema).max(6).default([]),
    contact: z.object({
      note: text(140).default(""),
      footerNote: text(160).default(""),
    }),
  })
  .superRefine((site, ctx) => {
    const seen = new Set<string>();
    site.projects.forEach((p, i) => {
      if (seen.has(p.id)) ctx.addIssue({ code: "custom", path: ["projects", i, "id"], message: `Another project already uses the id "${p.id}"` });
      seen.add(p.id);
    });
    const ids = new Set<string>();
    site.sections.forEach((s, i) => {
      if (ids.has(s.id)) ctx.addIssue({ code: "custom", path: ["sections", i, "id"], message: `The "${s.id}" section appears twice` });
      ids.add(s.id);
    });
  })
  // Older content files (or backups) may predate a section. Add any missing ones, hidden, at the end,
  // so they show up in the Sections tab instead of failing validation.
  .transform((site) => {
    const present = new Set(site.sections.map((s) => s.id));
    const missing = SECTION_IDS.filter((id) => !present.has(id)).map((id) => ({ id, visible: false, nav: id, eyebrow: "", title: "", intro: "" }));
    return missing.length ? { ...site, sections: [...site.sections, ...missing] } : site;
  });

export type Site = z.infer<typeof siteSchema>;
export type Project = Site["projects"][number];
export type Section = Site["sections"][number];
export type Stat = Site["headerStats"][number];
export type Testimonial = Site["testimonials"][number];
