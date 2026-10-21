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
      <p className="essay-back">
        <Link href="/writing">← All writing</Link>
      </p>
    </article>
  );
}
