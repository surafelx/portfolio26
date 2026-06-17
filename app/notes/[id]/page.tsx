import { Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { getNoteById, getNotes } from "@/data";

export function generateStaticParams() {
  return getNotes().map((note) => ({ id: note.id }));
}

export default function Note({ params }: { params: { id: string } }) {
  const { id } = params;
  const note = getNoteById(id);

  if (!note) {
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
          {note.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {new Date(note.createdAt ?? Date.now()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span>{note.blocks?.length || 0} blocks</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {note.blocks?.map((block) => {
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
    </div>
  );
}
