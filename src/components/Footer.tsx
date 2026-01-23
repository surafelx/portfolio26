"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Menu, X, Home, User, BookOpen, Users, Calendar } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

export const Footer = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { analytics, loading } = useAnalytics();

  const navigationLinks = [
    { href: "/", label: "home", icon: Home },
    { href: "/about", label: "about", icon: User },
    { href: "/notes", label: "notes", icon: BookOpen },
    { href: "/contact", label: "contact", icon: Mail },
  ];

  const socialLinks = [
    { href: "https://github.com", icon: Github, label: "GitHub" },
    { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
    { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="terminal-border border-t-0 bg-card/30 px-4 py-3"
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              <span className="text-primary">©</span> 2026 — built with code & caffeine
            </span>
            <span className="text-muted-foreground/70 flex items-center gap-1">
              <Calendar size={14} />
              Last updated: January 2026
            </span>
          </div>

          <div className="flex items-center gap-4">
            {!loading && (
              <span className="text-muted-foreground/70 flex items-center gap-1">
                <Users size={14} />
                {analytics.uniqueVisitors} visitors
              </span>
            )}

            {/* Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-muted-foreground hover:text-primary transition-colors p-1"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Collapsible Menu */}
        <motion.div
          initial={false}
          animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="flex items-center justify-center gap-6 py-2 border-t border-border/50">
            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              {navigationLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  <Icon size={14} />
                  <span>{label}</span>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};
