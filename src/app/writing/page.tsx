import type { Metadata } from "next";
import Link from "next/link";
import { Entries, PageHead } from "@/components/Entries";
import { articles } from "@/content/articles";
import { ideas, pillars, teaching } from "@/content/site";
import { formatDate } from "@/content/format";
import { abroPosts } from "@/content/abro-entries";

const pillar = pillars.find((p) => p.id === "writing")!;

export const metadata: Metadata = { title: pillar.nav, description: pillar.intro };

export default function WritingPage() {
  const sorted = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return (
    <>
      <PageHead pillar={pillar} />
      <section className="wrap entries">
        <h2 className="section-title">Essays</h2>
        <ul className="essay-list">
          {abroPosts().map((p) => (
            <li key={p.href}>
              <a href={p.href} target="_blank" rel="noopener noreferrer">
                <span className="essay-date">{p.date}</span>
                <span className="essay-title">{p.title} ↗</span>
                <span className="essay-excerpt">{p.summary}</span>
              </a>
            </li>
          ))}
          {sorted.map((a) => (
            <li key={a.id}>
              <Link href={`/writing/${a.id}`}>
                <span className="essay-date">{formatDate(a.publishedAt)}</span>
                <span className="essay-title">{a.title}</span>
                <span className="essay-excerpt">{a.excerpt}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Entries heading="Ideas still growing" items={ideas} />
      <Entries heading="Teaching what I know" items={teaching} />
    </>
  );
}
