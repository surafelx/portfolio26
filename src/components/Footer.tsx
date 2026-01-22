import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Rss, Home, User, BookOpen } from "lucide-react";

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="terminal-border border-t-0 bg-card/30 px-6 py-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <span className="text-muted-foreground">
            <span className="text-primary">©</span> 2024 — built with code & caffeine
          </span>
          <span className="text-muted-foreground/70">
            Last updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Home size={16} />
              <span>home</span>
            </a>
            <a
              href="/about"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <User size={16} />
              <span>about</span>
            </a>
            <a
              href="/notes"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <BookOpen size={16} />
              <span>notes</span>
            </a>
            <a
              href="/contact"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail size={16} />
              <span>contact</span>
            </a>
            <a
              href="/rss"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Rss size={16} />
              <span>rss</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github size={16} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
