"use client";
import { motion } from "framer-motion";
import { User, Code, Briefcase, GraduationCap } from "lucide-react";

interface AboutClientProps {
  initialAbout: any;
}

export default function AboutClient({ initialAbout }: AboutClientProps) {
  if (!initialAbout) {
    return (
      <div className="terminal-border bg-card/50 p-4">
        <p className="text-muted-foreground">About data not found.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-muted-foreground">$</span>
        <span className="text-foreground">cat</span>
        <span className="text-terminal-cyan">about.md</span>
      </div>

      {/* Summary */}
      <div className="terminal-border bg-card/50 p-4 mb-6">
        <h1 className="text-lg text-primary terminal-glow mb-3 flex items-center gap-2">
          <User size={20} /> About Me
        </h1>
        <p className="text-foreground/80 leading-relaxed text-sm">
          {initialAbout.summary}
        </p>
      </div>

      {/* Skills */}
      <div className="terminal-border bg-card/50 p-4 mb-6">
        <h2 className="text-base text-primary terminal-glow mb-4 flex items-center gap-2">
          <Code size={18} /> Technical Skills
        </h2>
        <div className="space-y-4">
          {Object.entries(initialAbout.skills).map(([category, skills]: [string, any]) => (
            <div key={category}>
              <h3 className="text-sm text-primary mb-2 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-1 bg-primary/10 border border-primary/30 text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="terminal-border bg-card/50 p-4 mb-6">
        <h2 className="text-base text-primary terminal-glow mb-4 flex items-center gap-2">
          <Briefcase size={18} /> Work Experience
        </h2>
        <div className="space-y-4">
          {initialAbout.experience.map((exp: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-l-2 border-primary/30 pl-4"
            >
              <h3 className="text-sm text-primary mb-1">{exp.position}</h3>
              <p className="text-xs text-muted-foreground mb-2">{exp.company} • {exp.dates}</p>
              <ul className="text-foreground/80 text-sm space-y-1">
                {exp.description.map((desc: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="terminal-border bg-card/50 p-4">
        <h2 className="text-base text-primary terminal-glow mb-4 flex items-center gap-2">
          <GraduationCap size={18} /> Education
        </h2>
        <div>
          <h3 className="text-sm text-primary mb-1">{initialAbout.education.degree}</h3>
          <p className="text-xs text-muted-foreground mb-2">{initialAbout.education.institution} • {initialAbout.education.graduation}</p>
        </div>
      </div>
    </div>
  );
}