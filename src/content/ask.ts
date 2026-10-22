import type { AskDoc } from "@/components/Ask";
import { abroPosts, abroProjects } from "./abro-entries";
import { articles } from "./articles";
import { art, ethiopia, ideas, jobs, music, projects, skills, teaching, visible } from "./site";

/** Everything Ask Surafel can answer from: each entry on the site, with the page it lives on. */
export function askDocs(): AskDoc[] {
  const from = (list: { title: string; kicker: string; body: string; stack?: string; draft?: boolean }[], href: string, where: string) =>
    visible(list).map((e) => ({ title: e.title, text: [e.body, e.kicker, e.stack].filter(Boolean).join(" "), href, where }));

  return [
    ...from([...projects, ...abroProjects()], "/work", "Work"),
    ...from(music, "/music", "Music"),
    ...from(art, "/art", "Art"),
    ...from(ethiopia, "/ethiopia", "Ethiopia"),
    ...from(ideas, "/writing", "Writing"),
    ...from(teaching, "/writing", "Teaching"),
    ...abroPosts().map((p) => ({ title: p.title, text: p.summary, href: p.href, where: "Post" })),
    ...articles.map((a) => ({ title: a.title, text: `${a.excerpt} ${a.tags.join(" ")}`, href: `/writing/${a.id}`, where: "Essay" })),
    ...jobs.map((j) => ({ title: `${j.role}, ${j.org}`, text: `${j.role} at ${j.org} ${j.when}`, href: "/work", where: "Experience" })),
    ...skills.map((s) => ({ title: s.group, text: s.items, href: "/work", where: "Skills" })),
  ];
}
