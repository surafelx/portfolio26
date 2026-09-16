import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/lib/articles";
import { site } from "@/lib/content";
import { ThemeToggle } from "@/components/ThemeToggle";

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = getArticle(id);
  if (!article) return {};
  return {
    title: `${article.title} · ${site.profile.shortName}`,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, type: "article", publishedTime: article.publishedAt },
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = getArticle(id);
  if (!article) notFound();

  const others = articles.filter((a) => a.id !== article.id);

  return (
    <div className="site">
      <header className="header">
        <div className="container bar">
          <a className="brand" href="/">
            <span className="dot" aria-hidden="true" />
            {site.profile.shortName}
          </a>
          <span className="spacer" style={{ display: "block", flex: 1 }} />
          <div className="tools">
            <ThemeToggle />
            {site.profile.bookingUrl && (
              <a className="btn sm cta" href={site.profile.bookingUrl}>
                Book a call
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="article container">
        <a className="back" href="/#writing">
          ← All writing
        </a>
        <p className="label">
          {formatDate(article.publishedAt)} · {article.readingTime} read
        </p>
        <h1>{article.title}</h1>
        <p className="excerpt">{article.excerpt}</p>

        <div className="article-body">
          {article.blocks.map((block) => {
            switch (block.type) {
              case "h2":
                return <h2 key={block.id}>{block.content}</h2>;
              case "quote":
                return <blockquote key={block.id}>{block.content}</blockquote>;
              case "code":
                return (
                  <pre key={block.id}>
                    <code>{block.content}</code>
                  </pre>
                );
              default:
                return <p key={block.id}>{block.content}</p>;
            }
          })}
        </div>

        {article.tags.length > 0 && (
          <ul className="tags" aria-label="Topics">
            {article.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}

        {others.length > 0 && (
          <nav className="more-articles" aria-label="More writing">
            <span className="label">Keep reading</span>
            {others.map((a) => (
              <a key={a.id} href={`/articles/${a.id}`}>
                {a.title}
              </a>
            ))}
          </nav>
        )}
      </main>
    </div>
  );
}
