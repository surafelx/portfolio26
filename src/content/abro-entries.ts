import fs from "node:fs";
import path from "node:path";
import type { Entry as AbroEntry, Store } from "@/lib/abro";
import type { Entry } from "./site";

/**
 * What Abro has published, read from content/abro.json when the site builds. Drafts never show.
 * Server-only (it reads the disk), so pages pass the results down rather than client code importing this.
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const month = (date: string) => {
  const [y, m] = date.split("-").map(Number);
  return `${MONTHS[(m || 1) - 1]} ${y}`;
};

function published(kind: AbroEntry["kind"]): AbroEntry[] {
  try {
    const store = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "abro.json"), "utf8")) as Store;
    return store.entries.filter((e) => e.kind === kind && e.visible).sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export function abroProjects(): (Entry & { stack?: string })[] {
  return published("project").map((e) => ({
    title: e.title,
    kicker: `Built · ${month(e.date)}`,
    body: e.summary,
    stack: e.stack.join(", ") || undefined,
    links: [
      e.links.live && { label: "Live", href: e.links.live },
      e.links.code && { label: "Code", href: e.links.code },
      e.links.post && { label: "Write-up", href: e.links.post },
    ].filter((l): l is { label: string; href: string } => !!l),
  }));
}

export function abroPosts(): { title: string; summary: string; date: string; href: string }[] {
  return published("post")
    .map((e) => ({ title: e.title, summary: e.summary, date: month(e.date), href: e.links.post || e.links.live || "" }))
    .filter((p) => p.href);
}

/** Skills Abro has published, shown as a "Currently learning" group. */
export function abroLearning(): string {
  return published("skill")
    .map((e) => e.title)
    .join(", ");
}
