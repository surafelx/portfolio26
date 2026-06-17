import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { StrudelMusic } from "@/components/StrudelMusic";
import { getArticleById, getArticles } from "@/data";
import type { ArticleBlock } from "@/data";

export function generateStaticParams() {
  return getArticles().map((article) => ({ id: article.id }));
}

export default function Article({ params }: { params: { id: string } }) {
  const { id } = params;
  const article = getArticleById(id);

  if (!article) {
    notFound();
  }

  const renderBlock = (block: ArticleBlock) => {
    switch (block.type) {
      case 'h1':
        return (
          <h1 key={block.id} className="text-3xl text-primary terminal-glow mt-10 mb-6">
            {block.content}
          </h1>
        );
      case 'h2':
        return (
          <h2 key={block.id} className="text-2xl text-primary mt-8 mb-4">
            {block.content}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={block.id} className="text-xl text-terminal-cyan mt-6 mb-3">
            {block.content}
          </h3>
        );
      case 'h4':
        return (
          <h4 key={block.id} className="text-lg text-terminal-amber mt-4 mb-2">
            {block.content}
          </h4>
        );
      case 'paragraph':
        return (
          <p key={block.id} className="text-foreground/90 leading-relaxed mb-6">
            {block.content}
          </p>
        );
      case 'image':
        // Handle multiple images in a single image block
        if (block.metadata?.images && block.metadata.images.length > 0) {
          return (
            <div key={block.id} className="space-y-4 mb-6">
              {block.metadata.images.map((image, index) => (
                <div key={index} className="terminal-border bg-secondary/30 p-4">
                  <ImageWithFallback
                    src={image.url}
                    alt={image.alt || ''}
                    className="w-full max-h-96 object-cover rounded mb-3"
                    fallbackText="Image not available"
                  />
                  {image.caption && (
                    <p className="text-sm text-muted-foreground text-center">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          );
        }
        // Fallback for legacy single image blocks
        return (
          <div key={block.id} className="terminal-border bg-secondary/30 p-4 mb-6">
            <ImageWithFallback
              src={block.content}
              alt={block.metadata?.alt || ''}
              className="w-full max-h-96 object-cover rounded mb-3"
              fallbackText="Image not available"
            />
            {block.metadata?.caption && (
              <p className="text-sm text-muted-foreground text-center">
                {block.metadata.caption}
              </p>
            )}
          </div>
        );
      case 'image-grid': {
        const layout = block.metadata?.layout || 'grid-2';
        const gridClass = layout === 'grid-2' ? 'grid-cols-1 md:grid-cols-2' :
                         layout === 'grid-3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                         layout === 'grid-4' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                         'grid-cols-1';

        return (
          <div key={block.id} className={`grid ${gridClass} gap-4 mb-6`}>
            {block.metadata?.images?.map((image, index) => (
              <div key={index} className="terminal-border bg-secondary/30 p-3">
                <ImageWithFallback
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-48 object-cover rounded mb-2"
                  fallbackText="Image not available"
                  iconSize={24}
                />
                {image.caption && (
                  <p className="text-xs text-muted-foreground text-center">
                    {image.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        );
      }
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
      case 'two-column':
        return (
          <div key={block.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="text-foreground/90 leading-relaxed">
              {block.content.split('\n').map((line, i) => (
                <p key={i} className="mb-4">{line}</p>
              ))}
            </div>
            <div className="text-foreground/90 leading-relaxed">
              {block.metadata?.caption?.split('\n').map((line, i) => (
                <p key={i} className="mb-4">{line}</p>
              ))}
            </div>
          </div>
        );
      case 'youtube-video': {
        const getYouTubeEmbedUrl = (url: string) => {
          const videoId = url.includes('youtu.be/')
            ? url.split('youtu.be/')[1].split('?')[0]
            : url.includes('youtube.com/watch?v=')
            ? url.split('v=')[1].split('&')[0]
            : url;
          return `https://www.youtube.com/embed/${videoId}`;
        };

        return (
          <div key={block.id} className="terminal-border bg-secondary/30 p-4 mb-6">
            {block.metadata?.title && (
              <h3 className="text-lg font-medium mb-3 text-primary">{block.metadata.title}</h3>
            )}
            <div className="aspect-video">
              <iframe
                src={getYouTubeEmbedUrl(block.metadata?.videoUrl || '')}
                title={block.metadata?.title || 'YouTube video'}
                className="w-full h-full rounded"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        );
      }
      case 'video':
        return (
          <div key={block.id} className="terminal-border bg-secondary/30 p-4 mb-6">
            {block.metadata?.title && (
              <h3 className="text-lg font-medium mb-3 text-primary">{block.metadata.title}</h3>
            )}
            <div className="aspect-video">
              <video
                src={block.metadata?.videoUrl}
                title={block.metadata?.title || 'Video'}
                className="w-full h-full rounded"
                controls
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        );
      case 'strudel-music':
        return (
          <StrudelMusic
            key={block.id}
            code={block.content}
            title={block.metadata?.title}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Back Link */}
      <div className="mb-6">
        <Link href="/notes" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Articles</span>
        </Link>
      </div>

      {/* Content Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-primary terminal-glow mb-4">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {article.readingTime}
          </span>
          <span>By {article.author}</span>
          <span>{article.blocks?.length || 0} blocks</span>
        </div>
        <p className="text-foreground/80 text-lg leading-relaxed">
          {article.excerpt}
        </p>
      </div>

      {/* Tags */}
      {article.tags && (
        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 bg-primary/10 border border-primary/30 text-primary"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="space-y-6">
        {article.blocks?.map(renderBlock)}
      </div>
    </div>
  );
}
