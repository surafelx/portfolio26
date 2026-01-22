"use client"
import { motion } from "framer-motion";
import { Notebook, BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function Notes() {
  const res = await fetch('http://localhost:3000/api/articles', { cache: 'no-store' });
  const articles = await res.json();
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
        <div className="space-y-3">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="terminal-border bg-card/30 p-4 hover:bg-card/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Link href={`/notes/${article.id}`}>
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
                  href={`/notes/${article.id}`}
                  className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors text-xs"
                >
                  <span>Read</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}