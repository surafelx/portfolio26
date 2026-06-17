import type { Article } from "@/data/types";

export type { Article, ArticleBlock } from "@/data/types";

// Static articles. Each article is composed of typed content blocks that the
// article renderer knows how to display.
export const articles: Article[] = [
  {
    id: "shipping-realtime-collaboration",
    title: "Shipping Real-Time Collaboration Without Losing Your Mind",
    excerpt:
      "What I learned building a multiplayer canvas: CRDTs, presence, and the unglamorous work of conflict-free state.",
    author: "Surafel Yimam",
    publishedAt: "2025-03-12",
    readingTime: "8 min",
    tags: ["realtime", "crdt", "architecture"],
    imageUrl: "/projects/neural.jpg",
    blocks: [
      { id: "b1", type: "paragraph", content: "Real-time collaboration looks like magic until you try to build it. The hard part isn't the websockets — it's deciding what 'the truth' is when two people edit the same thing at the same moment." },
      { id: "b2", type: "h2", content: "Why CRDTs" },
      { id: "b3", type: "paragraph", content: "Conflict-free replicated data types let each client apply edits locally and converge to the same state without a central lock. That sounds abstract, so here is the rule I keep coming back to: design your data so that any two operations can be applied in any order and still produce the same result." },
      { id: "b4", type: "code", content: "// merge is commutative and idempotent\nstate = merge(merge(state, opA), opB)\n     === merge(merge(state, opB), opA)", metadata: { language: "javascript" } },
      { id: "b5", type: "quote", content: "Make the data structure do the hard work, and your sync layer becomes almost boring." },
      { id: "b6", type: "h2", content: "Presence is a separate problem" },
      { id: "b7", type: "paragraph", content: "Cursors, selections, and 'who is here' don't need to be durable. Keep ephemeral presence on a fast, lossy channel and your persistent document model stays small and clean." },
    ],
  },
  {
    id: "self-hosting-analytics",
    title: "A Case for Self-Hosting Your Analytics",
    excerpt:
      "Third-party analytics is convenient and expensive in ways that don't show up on the invoice. Here's the alternative I reach for.",
    author: "Surafel Yimam",
    publishedAt: "2024-11-02",
    readingTime: "6 min",
    tags: ["analytics", "privacy", "self-hosted"],
    imageUrl: "/projects/pulse.jpg",
    blocks: [
      { id: "b1", type: "paragraph", content: "Every product needs to understand how people use it. Most teams reach for a hosted analytics SaaS and never look back — but you trade away data ownership, privacy posture, and a surprising amount of control." },
      { id: "b2", type: "h2", content: "What you actually need" },
      { id: "b3", type: "paragraph", content: "For most products, analytics is three questions: who is using this, what are they doing, and where do they drop off. You can answer all three with an event table and a handful of queries." },
      { id: "b4", type: "code", content: "SELECT step, count(distinct user_id) AS users\nFROM events\nWHERE name IN ('view','signup','activate')\nGROUP BY step\nORDER BY step;", metadata: { language: "sql" } },
      { id: "b5", type: "paragraph", content: "An embedded column store like DuckDB makes this fast enough that 'self-hosted' no longer means 'slow and painful'." },
    ],
  },
  {
    id: "literate-tooling",
    title: "Literate Tooling: Notes That Run",
    excerpt:
      "Documentation rots because it can't be tested. What if your notes executed their own code blocks?",
    author: "Surafel Yimam",
    publishedAt: "2024-05-20",
    readingTime: "5 min",
    tags: ["tools", "developer-experience"],
    imageUrl: "/projects/syntax.jpg",
    blocks: [
      { id: "b1", type: "paragraph", content: "The fastest way to make documentation lie is to write it once and never run it again. Executable notes fix this by treating code blocks as runnable cells." },
      { id: "b2", type: "h2", content: "Keep the source plain" },
      { id: "b3", type: "paragraph", content: "The trick that makes this maintainable is storing everything as ordinary markdown. Your notes stay diff-friendly and reviewable, and the execution layer is just a viewer on top." },
      { id: "b4", type: "quote", content: "If your docs can fail CI, they'll stay honest." },
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
