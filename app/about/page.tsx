"use client";
import { motion } from "framer-motion";
import { Code, Coffee, Cpu, Database, Globe, Zap } from "lucide-react";

const skills = [
  { name: "Languages", items: ["TypeScript", "Python", "Rust", "Go"], icon: Code },
  { name: "Frontend", items: ["React", "Next.js", "Vue", "TailwindCSS"], icon: Globe },
  { name: "Backend", items: ["Node.js", "FastAPI", "gRPC", "GraphQL"], icon: Database },
  { name: "Infrastructure", items: ["Kubernetes", "Docker", "AWS", "GCP"], icon: Cpu },
];

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-muted-foreground">$</span>
        <span className="text-foreground">cat</span>
        <span className="text-terminal-cyan">about.md</span>
      </div>

      {/* Bio */}
      <div className="terminal-border bg-card/50 p-4 mb-6">
        <h1 className="text-base text-primary terminal-glow mb-3">About Me</h1>
        <div className="space-y-3 text-foreground/80 leading-relaxed text-sm">
          <p>
            Software engineer with <span className="text-terminal-cyan">5+ years</span> of experience
            building scalable systems and developer tools. Passionate about clean architecture,
            performance optimization, and making complex things simple.
          </p>
          <p>
            Currently focused on <span className="text-terminal-amber">distributed systems</span> and
            <span className="text-terminal-pink"> AI infrastructure</span>. Previously worked at
            startups and scale-ups, shipping products used by millions.
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Coffee size={16} className="text-terminal-amber" />
            Fueled by coffee and curiosity.
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-muted-foreground">$</span>
        <span className="text-foreground">./skills</span>
        <span className="text-terminal-cyan">--list</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="terminal-border bg-card/50 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <category.icon size={16} className="text-primary" />
              <h3 className="text-primary font-medium text-sm">{category.name}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item) => (
                <span
                  key={item}
                  className="text-xs px-2 py-1 bg-secondary text-foreground border border-border"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 terminal-border bg-secondary/30 p-4 flex items-center gap-3"
      >
        <Zap size={16} className="text-primary animate-pulse" />
        <span className="text-muted-foreground">
          Status: <span className="text-primary">Open to opportunities</span>
        </span>
      </motion.div>
    </motion.div>
  );
}