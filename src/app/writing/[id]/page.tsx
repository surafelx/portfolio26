import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/content/articles";
import { formatDate } from "@/content/format";

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = getArticle(id);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, type: "article", publishedTime: article.publishedAt },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = getArticle(id);
  if (!article) notFound();

  return (
    <article className="wrap essay">
      <p className="crumbs">
        <Link href="/writing">Writing</Link> · {formatDate(article.publishedAt)} · {article.readingTime}
      </p>
      <h1 className="squiggle">{article.title}</h1>
      <p className="lede">{article.excerpt}</p>
      <div className="essay-body">
        {article.blocks.map((b) => {
          switch (b.type) {
            case "h2":
              return <h2 key={b.id}>{b.content}</h2>;
            case "quote":
              return <blockquote key={b.id}>{b.content}</blockquote>;
            case "code":
              return (
                <pre key={b.id}>
                  <code>{b.content}</code>
                </pre>
              );
            default:
              return <p key={b.id}>{b.content}</p>;
          }
        })}
      </div>
      <aside className="keep-reading" aria-labelledby="keep-reading">
        <p id="keep-reading" className="label">Keep reading</p>
        <ul className="essay-list">
          {articles
            .filter((a) => a.id !== article.id)
            .map((a) => (
              <li key={a.id}>
                <Link href={`/writing/${a.id}`}>
                  <span className="essay-date">{formatDate(a.publishedAt)}</span>
                  <span className="essay-title">{a.title}</span>
                  <span className="essay-excerpt">{a.excerpt}</span>
                </Link>
              </li>
            ))}
        </ul>
        <p className="essay-back">
          <Link href="/writing">← All writing</Link>
        </p>
      </aside>
    </article>
  );
}
