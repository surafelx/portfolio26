import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleTracker } from "@/components/ArticleTracker";

export default async function Article({ params }: { params: { id: string } }) {
  const { id } = params;

  let post: any = null;
  let isNote = false;

  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

    // Try articles first
    let res = await fetch(`${baseUrl}/api/articles/${id}`, { cache: 'no-store' });
    if (res.ok) {
      post = await res.json();
    } else {
      // Try notes
      res = await fetch(`${baseUrl}/api/notes/${id}`, { cache: 'no-store' });
      if (res.ok) {
        post = await res.json();
        isNote = true;
      } else {
        console.error(`Failed to fetch content: articles ${res.status}, notes ${res.status}`);
      }
    }
  } catch (error) {
    console.error('Error fetching content:', error);
  }

  if (!post) {
    notFound();
  }

  return (
    <div>
      {/* Back Link */}
      <div className="mb-6">
        <Link href="/notes" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Notes</span>
        </Link>
      </div>

      {/* Content Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-primary terminal-glow mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(isNote ? post.createdAt : post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          {!isNote && (
            <>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {post.readingTime}
              </span>
              <span>By {post.author}</span>
            </>
          )}
          {isNote && (
            <span>{post.blocks?.length || 0} blocks</span>
          )}
        </div>
        {!isNote && (
          <p className="text-foreground/80 text-lg leading-relaxed">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Tags - Only for articles */}
      {!isNote && post.tags && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 bg-primary/10 border border-primary/30 text-primary"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Images - Only for articles */}
      {!isNote && post.images && post.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {post.images.map((image, index) => (
            <div key={index} className="terminal-border bg-secondary/30 p-4">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-64 object-cover rounded mb-3"
              />
              <p className="text-sm text-muted-foreground text-center">
                {image.caption}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {isNote ? (
        <div className="space-y-6">
          {post.blocks?.map((block) => {
            switch (block.type) {
              case 'title':
                return (
                  <h2 key={block.id} className="text-2xl text-primary terminal-glow mt-8 mb-4">
                    {block.content}
                  </h2>
                );
              case 'paragraph':
                return (
                  <p key={block.id} className="text-foreground/90 leading-relaxed mb-6">
                    {block.content}
                  </p>
                );
              case 'image':
                return (
                  <div key={block.id} className="terminal-border bg-secondary/30 p-4 mb-6">
                    <img
                      src={block.content}
                      alt={block.metadata?.alt || ''}
                      className="w-full max-h-96 object-cover rounded mb-3"
                    />
                    {block.metadata?.caption && (
                      <p className="text-sm text-muted-foreground text-center">
                        {block.metadata.caption}
                      </p>
                    )}
                  </div>
                );
              case 'code':
                return (
                  <pre key={block.id} className="bg-secondary p-4 rounded text-sm overflow-x-auto mt-6 mb-6">
                    <code className={block.metadata?.language ? `language-${block.metadata.language}` : ''}>
                      {block.content}
                    </code>
                  </pre>
                );
              case 'quote':
                return (
                  <blockquote key={block.id} className="border-l-4 border-primary pl-4 italic text-foreground/80 my-6">
                    {block.content}
                  </blockquote>
                );
              default:
                return null;
            }
          })}
        </div>
      ) : (
        <div
          className="prose prose-invert max-w-none text-foreground/90 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: post.content
              .replace(/^# (.*$)/gim, '<h1 class="text-2xl text-primary terminal-glow mt-10 mb-6">$1</h1>')
              .replace(/^## (.*$)/gim, '<h2 class="text-xl text-primary mt-8 mb-4">$1</h2>')
              .replace(/^### (.*$)/gim, '<h3 class="text-lg text-terminal-cyan mt-6 mb-3">$1</h3>')
              .replace(/```([\s\S]*?)```/g, '<pre class="bg-secondary p-4 rounded text-sm overflow-x-auto mt-6 mb-6"><code>$1</code></pre>')
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
              .replace(/\*(.*?)\*/g, '<em class="text-foreground/80">$1</em>')
              .replace(/\n\n/g, '</p><p class="mb-6">')
              .replace(/\n/g, '<br/>')
          }}
        />
      )}
      {!isNote && <ArticleTracker articleId={id} />}
    </div>
  );
}