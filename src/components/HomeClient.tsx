"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TerminalInput } from "@/components/TerminalInput";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectModal } from "@/components/ProjectModal";
import type { Project } from "@/data/projects";
import { ProjectSearchAccordion } from "@/components/ProjectSearchAccordion";
import { toast } from "sonner";
import { Download, Github, Linkedin, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeClientProps {
  initialProjects: Project[];
  modules: string[];
}

export default function HomeClient({ initialProjects, modules }: HomeClientProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");

  useEffect(() => {
    // Brief delay for staggered animation effect
    const timer = setTimeout(() => setShowContent(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Record page visit
    const baseUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    fetch(`${baseUrl}/api/analytics/visits`, { method: 'POST' }).catch(console.error);
  }, []);

  useEffect(() => {
    if (initialProjects.length > 0) {
      setFilteredProjects(initialProjects);
    }
  }, [initialProjects]);

  const handleMessageSubmit = (message: string) => {
    toast.success("Message sent!", {
      description: `"${message}" - I'll get back to you soon.`,
    });
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    // Record project view
    const baseUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    fetch(`${baseUrl}/api/analytics/project-views`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: project.id }),
    }).catch(console.error);
  };

  const handleSearch = (query: string, module: string) => {
    setSearchQuery(query);
    setSelectedModule(module);

    const filtered = initialProjects.filter((project) => {
      const matchesSearch = query === "" ||
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.brief.toLowerCase().includes(query.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        project.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()));

      const matchesModule = module === "all" || project.tags.includes(module);

      return matchesSearch && matchesModule;
    });

    setFilteredProjects(filtered);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate={showContent ? "visible" : "hidden"}
        variants={containerVariants}
      >

      {/* Intro section */}
      <motion.div variants={itemVariants} className="mb-12">
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <span className="w-8 h-px bg-primary" />
          Welcome
        </h2>
        <div className="pl-4 border-l-2 border-primary/30">
          <h1 className="text-xl md:text-2xl text-foreground mb-2">
            Hi, I'm <span className="text-primary terminal-glow">Surafel Yimam</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Building software that matters. Focused on{" "}
            <span className="text-terminal-cyan">distributed systems</span>,{" "}
            <span className="text-terminal-amber">developer tools</span>, and{" "}
            <span className="text-terminal-pink">AI/ML</span> applications.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <Button
              asChild
              variant="default"
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <a href="/resume.pdf" download className="flex items-center gap-2">
                <Download size={16} />
                Download Resume
              </a>
            </Button>

            <div className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-secondary/50 rounded"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-secondary/50 rounded"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-secondary/50 rounded"
              >
                <Twitter size={18} />
              </a>
              <a
                href="mailto:hello@example.dev"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-secondary/50 rounded"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Latest Article */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="terminal-border bg-card/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-primary flex items-center gap-2">
              <span className="w-4 h-px bg-primary" />
              Latest Article
            </h3>
            <div className="flex items-center gap-3">
              <Link
                href="/notes"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                All Articles →
              </Link>
              <Link
                href="/notes/using-code-for-expression"
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Read More →
              </Link>
            </div>
          </div>
          <h4 className="text-base text-foreground mb-2 terminal-glow">
            Using Code for Expression: My Journey as Ethiopia's First Live-Coding Music Performer
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            How discovering live-coding music transformed my creative journey and led to pioneering performances in Ethiopia, merging technology with artistic expression.
          </p>
        </div>
      </motion.div>

    {/* Quick message input */}
      <motion.div variants={itemVariants} className="mb-8">
        <TerminalInput onSubmit={handleMessageSubmit} />
      </motion.div>


      {/* Projects section */}
      <motion.div variants={itemVariants}>


        {/* Retractable search and filter accordion */}
        <motion.div variants={itemVariants} className="mb-6">
          <ProjectSearchAccordion
            modules={modules}
            onSearch={handleSearch}
            photoUrl="/placeholder.svg"
          />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-6 text-sm text-muted-foreground flex items-center gap-2"
        >
          <span className="text-primary">{initialProjects.length}</span> projects •{" "}
          <span className="text-terminal-cyan">click to view details</span>
        </motion.div>
      </motion.div>
    </motion.div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}