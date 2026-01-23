"use client";
import { motion } from "framer-motion";
import { Notebook, BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useArticles } from "@/hooks/useArticles";
import { useNotes } from "@/hooks/useNotes";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface NotesClientProps {
  initialArticles: any[];
  initialNotes: any[];
}

export default function NotesClient({ initialArticles, initialNotes }: NotesClientProps) {
  const { articles, loading: articlesLoading, error: articlesError } = useArticles();
  const { notes, loading: notesLoading, error: notesError } = useNotes();
  const displayArticles = articles.length > 0 ? articles : initialArticles;
  const displayNotes = notes.length > 0 ? notes : initialNotes;

  // In production, show fallback content if database fails
  const showFallbackArticles = process.env.NODE_ENV === 'production' && articlesError && displayArticles.length === 0;
  const showFallbackNotes = process.env.NODE_ENV === 'production' && notesError && displayNotes.length === 0;

  // Fallback sample data for production
  const fallbackArticles = showFallbackArticles ? [
    {
      id: 'sample-article-1',
      title: 'Welcome to My Portfolio',
      excerpt: 'An introduction to my work and journey in technology.',
      publishedAt: new Date().toISOString().split('T')[0],
      readingTime: '3 min',
      author: 'Surafel Yimam',
      tags: ['introduction', 'portfolio']
    }
  ] : [];

  const fallbackNotes = showFallbackNotes ? [
    {
      id: 'sample-note-1',
      title: 'Database Connection Status',
      createdAt: new Date(),
      blocks: [
        {
          id: 'sample-block-1',
          type: 'paragraph',
          content: 'Database connection is currently unavailable. Full content will be restored soon.'
        }
      ]
    }
  ] : [];

  const finalArticles = showFallbackArticles ? fallbackArticles : displayArticles;
  const finalNotes = showFallbackNotes ? fallbackNotes : displayNotes;
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-muted-foreground">$</span>
        <span className="text-foreground">cat</span>
        <span className="text-terminal-cyan">notes.md</span>
      </div>

      {/* Notes Header */}
      <div className="terminal-border bg-card/50 p-4 mb-6">
        <h1 className="text-lg text-primary terminal-glow mb-3 flex items-center gap-2">
          <Notebook size={20} /> Notes & Articles
        </h1>
        <div className="space-y-3 text-foreground/80 leading-relaxed text-sm">
          <p>
            A collection of technical insights and articles about my journey
            in technology, creativity, and live-coding music.
          </p>
        </div>
      </div>

      {/* Articles Section */}
      <div className="mb-8">
        <h2 className="text-base text-primary terminal-glow mb-4 flex items-center gap-2">
          <BookOpen size={18} /> Featured Articles
        </h2>
        {articlesLoading && !showFallbackArticles ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner message="Loading articles..." />
          </div>
        ) : (
          <div className="space-y-3">
            {finalArticles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="terminal-border bg-card/30 p-4 hover:bg-card/50 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                onClick={() => window.location.href = `/articles/${article.id}`}
              >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Link href={`/articles/${article.id}`}>
                    <h3 className="text-base text-primary terminal-glow mb-2 hover:text-primary/80 transition-colors cursor-pointer">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-foreground/80 mb-2 leading-relaxed text-sm">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(article.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {article.readingTime}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-primary/10 border border-primary/30 text-primary"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={`/articles/${article.id}`}
                  className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-xs"
                >
                  <span>Read</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="mb-8">
        <h2 className="text-base text-primary terminal-glow mb-4 flex items-center gap-2">
          <Notebook size={18} /> Personal Notes
        </h2>
        {notesLoading && !showFallbackNotes ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner message="Loading notes..." />
          </div>
        ) : (
          <div className="space-y-3">
            {finalNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="terminal-border bg-card/30 p-4 hover:bg-card/50 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                onClick={() => window.location.href = `/notes/${note.id}`}
              >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Link href={`/notes/${note.id}`}>
                    <h3 className="text-base text-primary terminal-glow mb-2 hover:text-primary/80 transition-colors cursor-pointer">
                      {note.title}
                    </h3>
                  </Link>
                  <div className="text-foreground/80 text-sm space-y-2">
                    {note.blocks?.slice(0, 2).map((block: any) => {
                      if (block.type === 'paragraph' || block.type === 'title') {
                        return <p key={block.id}>{block.content}</p>;
                      }
                      return null;
                    })}
                    {note.blocks?.length > 2 && (
                      <p className="text-muted-foreground">...and {note.blocks.length - 2} more blocks</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(note.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span>{note.blocks?.length || 0} blocks</span>
                  </div>
                </div>
                <Link
                  href={`/notes/${note.id}`}
                  className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-xs"
                >
                  <span>View</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}