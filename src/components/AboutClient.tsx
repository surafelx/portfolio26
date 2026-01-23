"use client";
import { motion } from "framer-motion";
import { User, Code, Briefcase, GraduationCap, ChevronDown, Award, Heart, Zap, Coffee, Gamepad2, Music, Camera, ExternalLink } from "lucide-react";
import { useAbout } from "@/hooks/useAbout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PDFResume } from "@/components/PDFResume";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AboutClientProps {
  initialAbout: any;
}
export default function AboutClient({ initialAbout }: AboutClientProps) {
  const { about, loading, error } = useAbout();
  const displayAbout = about || initialAbout;

  if (loading && !displayAbout) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-muted-foreground">$</span>
          <span className="text-foreground">cat</span>
          <span className="text-terminal-cyan">about.md</span>
        </div>
        <LoadingSpinner message="Loading about information..." />
      </div>
    );
  }

  if (error && !displayAbout) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-muted-foreground">$</span>
          <span className="text-foreground">cat</span>
          <span className="text-terminal-cyan">about.md</span>
        </div>
        <div className="terminal-border bg-card/50 p-8 text-center">
          <p className="text-destructive">Error loading about information</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!displayAbout) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-muted-foreground">$</span>
          <span className="text-foreground">cat</span>
          <span className="text-terminal-cyan">about.md</span>
        </div>

        <div className="terminal-border bg-card/50 p-8 text-center">
          <h2 className="text-xl text-primary terminal-glow mb-4">About Data Not Found</h2>
          <p className="text-muted-foreground mb-6">
            Resume information hasn't been added yet. Visit the admin panel to populate your about section.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Go to <code className="bg-secondary px-2 py-1 rounded">/admin</code> → <strong>About</strong> tab → <strong>Edit About</strong></p>
            <p>Or run: <code className="bg-secondary px-2 py-1 rounded">npx tsx scripts/populate-about.ts</code></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">$</span>
          <span className="text-foreground">cat</span>
          <span className="text-terminal-cyan">about.md</span>
        </div>
        <PDFResume about={displayAbout} />
      </div>

      {/* Hero Summary - Always Visible */}
      <div className="terminal-border bg-card/50 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <User size={24} className="text-primary" />
          <h2 className="text-xl text-primary terminal-glow">About Me</h2>
        </div>
        <p className="text-foreground/80 leading-relaxed text-base">
          {displayAbout.summary}
        </p>
      </div>

      {/* Key Skills Overview - Always Visible */}
      <div className="terminal-border bg-card/50 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Code size={24} className="text-primary" />
          <h2 className="text-xl text-primary terminal-glow">Technical Skills</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(displayAbout.skills).map(([category, skills]: [string, any]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-base text-primary font-medium capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 4).map((skill: string) => (
                  <span
                    key={skill}
                    className="text-sm px-3 py-2 bg-primary/10 border border-primary/30 text-primary rounded-md whitespace-nowrap cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(skill)}+programming`, '_blank')}
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="text-sm px-3 py-2 bg-secondary/50 border border-border text-muted-foreground rounded-md cursor-pointer hover:bg-secondary/70 transition-colors">
                    +{skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Interests - Always Visible */}
      <div className="terminal-border bg-card/50 p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Heart size={24} className="text-primary" />
          <h2 className="text-xl text-primary terminal-glow">Beyond Code</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center gap-2 p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer group">
            <Coffee size={32} className="text-terminal-amber group-hover:scale-110 transition-transform" />
            <span className="text-sm text-center">Coffee & Late Nights</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer group">
            <Music size={32} className="text-terminal-pink group-hover:scale-110 transition-transform" />
            <span className="text-sm text-center">Live Coding Music</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer group">
            <Gamepad2 size={32} className="text-terminal-cyan group-hover:scale-110 transition-transform" />
            <span className="text-sm text-center">Gaming & Strategy</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer group">
            <Camera size={32} className="text-terminal-green group-hover:scale-110 transition-transform" />
            <span className="text-sm text-center">Photography & Tech</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          When I'm not coding, you'll find me exploring the intersection of technology and creativity
        </p>
      </div>

      {/* Detailed Sections with Accordions */}
      <Accordion type="single" collapsible className="w-full space-y-4">
        {/* Qualifications */}
        {displayAbout.qualifications && displayAbout.qualifications.length > 0 && (
          <AccordionItem value="qualifications" className="terminal-border bg-card/50 border-0">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <Award size={20} className="text-primary" />
                <span className="text-lg text-primary terminal-glow">Qualifications & Certifications</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({displayAbout.qualifications.length} items)
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                {displayAbout.qualifications.map((qualification: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-secondary/20 rounded-md border-l-2 border-primary/30"
                  >
                    <Award size={16} className="text-primary mt-1 flex-shrink-0" />
                    <span className="text-foreground/80 leading-relaxed">{qualification}</span>
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Experience Details */}
        <AccordionItem value="experience" className="terminal-border bg-card/50 border-0">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <Briefcase size={20} className="text-primary" />
              <span className="text-lg text-primary terminal-glow">Work Experience</span>
              <span className="text-sm text-muted-foreground ml-2">
                ({displayAbout.experience.length} positions)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-6">
              {displayAbout.experience.map((exp: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-2 border-primary/30 pl-6 py-4 bg-secondary/20 rounded-r-md hover:bg-secondary/30 transition-colors cursor-pointer group"
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(exp.company)}+company`, '_blank')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base text-primary font-medium group-hover:text-primary/80 transition-colors">
                      {exp.position}
                    </h3>
                    <ExternalLink size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {exp.company} • {exp.dates}
                  </p>
                  <ul className="text-foreground/80 text-sm space-y-2">
                    {exp.description.map((desc: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1 text-xs">•</span>
                        <span className="leading-relaxed">{desc}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Education Details */}
        <AccordionItem value="education" className="terminal-border bg-card/50 border-0">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <GraduationCap size={20} className="text-primary" />
              <span className="text-lg text-primary terminal-glow">Education</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div
              className="bg-secondary/20 rounded-md p-6 hover:bg-secondary/30 transition-colors cursor-pointer group"
              onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(displayAbout.education.institution)}+university`, '_blank')}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg text-primary font-medium group-hover:text-primary/80 transition-colors">
                  {displayAbout.education.degree}
                </h3>
                <ExternalLink size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-base text-muted-foreground mb-2">
                {displayAbout.education.institution} • {displayAbout.education.graduation}
              </p>
              {displayAbout.education.gpa && (
                <p className="text-sm text-primary">
                  GPA: {displayAbout.education.gpa}
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}