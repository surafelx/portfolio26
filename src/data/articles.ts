import type { Article } from "@/data/types";

export type { Article, ArticleBlock } from "@/data/types";

export const articles: Article[] = [
  {
    id: "5-agent-orchestration",
    title: "How I Built a 5-Agent AI Orchestration System",
    excerpt:
      "What I learned building an AI system where 5 agents work together like a classical orchestra — each with a distinct role, all coordinated through a central conductor layer.",
    author: "Surafel Yimam",
    publishedAt: "2026-06-10",
    readingTime: "7 min",
    tags: ["AI", "Agents", "Architecture"],
    blocks: [
      { id: "b1", type: "paragraph", content: "A single large prompt can only take you so far. The moment a product needs to sell, support, schedule, analyze, and report, one model juggling everything becomes brittle. So I built Celerus.io as an orchestra instead of a soloist." },
      { id: "b2", type: "h2", content: "One conductor, many specialists" },
      { id: "b3", type: "paragraph", content: "Five agents each own a single responsibility — sales, support, analytics, scheduling, reporting. A thin orchestration layer routes work between them and keeps shared context, so no agent has to know how the others do their job." },
      { id: "b4", type: "quote", content: "Specialized agents with a clear contract beat one generalist prompt trying to do everything." },
      { id: "b5", type: "h2", content: "What made it reliable" },
      { id: "b6", type: "paragraph", content: "Clear hand-offs, explicit state, and treating each agent's output as data the orchestrator validates — not gospel. That's what turned a demo into something a business can run on." },
    ],
  },
  {
    id: "automating-seo-searchatlas",
    title: "Automating SEO Operations with the SearchAtlas API",
    excerpt:
      "How I connected SearchAtlas to OpenClaw to replace 30 minutes of daily manual reporting with an automated digest — and what the data revealed about the business.",
    author: "Surafel Yimam",
    publishedAt: "2026-06-02",
    readingTime: "6 min",
    tags: ["Automation", "SEO", "APIs"],
    blocks: [
      { id: "b1", type: "paragraph", content: "Every morning the agency pulled the same numbers by hand across seven clients. It was accurate, slow, and exactly the kind of work software should do." },
      { id: "b2", type: "h2", content: "From dashboards to a digest" },
      { id: "b3", type: "paragraph", content: "I wired the SearchAtlas API into an OpenClaw workflow that compiles a daily digest, flags ranking and backlink changes, and opens Monday.com tasks automatically when something needs a human." },
      { id: "b4", type: "code", content: "// daily: pull metrics, diff against yesterday, alert on deltas\nconst changes = diff(today, yesterday);\nif (changes.length) notify(changes);", metadata: { language: "javascript" } },
      { id: "b5", type: "paragraph", content: "The surprise wasn't the time saved — it was seeing patterns nobody noticed when the numbers lived in separate dashboards." },
    ],
  },
  {
    id: "building-in-ethiopia",
    title: "What Building in the Ethiopian Market Taught Me About Building Globally",
    excerpt:
      "Three things I learned shipping products in Ethiopia that changed how I think about building for any market — constraints, trust, and the difference between local and global.",
    author: "Surafel Yimam",
    publishedAt: "2026-05-20",
    readingTime: "5 min",
    tags: ["Product", "Markets"],
    blocks: [
      { id: "b1", type: "paragraph", content: "Building in a constrained market is the best product education I've had. When bandwidth, payments, and trust can't be assumed, you learn what actually matters." },
      { id: "b2", type: "h2", content: "Constraints sharpen products" },
      { id: "b3", type: "paragraph", content: "Designing for low bandwidth and offline-first made everything I build leaner — and that leanness travels well to any market." },
      { id: "b4", type: "h2", content: "Trust is the real feature" },
      { id: "b5", type: "paragraph", content: "In markets where institutions are thin, trust has to be designed in. That lens makes you build clearer, more honest products everywhere." },
    ],
  },
];

export function getArticles(): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}
