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
import { useProjects } from "@/hooks/useProjects";
import { useArticles } from "@/hooks/useArticles";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ImageWithFallback } from "@/components/ImageWithFallback";

interface HomeClientProps {
  initialProjects: Project[];
  initialArticles: any[];
  modules: string[];
}

export default function HomeClient({ initialProjects, initialArticles, modules }: HomeClientProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");

  // Use hooks for data management
  const { projects, loading: projectsLoading } = useProjects();
  const { articles, loading: articlesLoading } = useArticles();

  // Use hook data if available, otherwise initial data
  const displayProjects = projects.length > 0 ? projects : initialProjects;
  const displayArticles = articles.length > 0 ? articles : initialArticles;
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(displayProjects);

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
    setFilteredProjects(displayProjects);
  }, [displayProjects]);

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

    const filtered = displayProjects.filter((project) => {
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
            Building software that matters. Focused on distributed systems, developer tools, and AI/ML applications.
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
        {articlesLoading ? (
          <div className="terminal-border bg-card/30 p-4">
            <LoadingSpinner message="Loading latest article..." />
          </div>
        ) : displayArticles.length > 0 ? (
          <div className="terminal-border bg-card/30 hover:bg-card/40 transition-all duration-300 cursor-pointer group overflow-hidden relative">
            {/* Article Image Overlay */}
            {displayArticles[0].imageUrl && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <ImageWithFallback
                  src={displayArticles[0].imageUrl}
                  alt={displayArticles[0].title}
                  className="w-full h-full object-cover"
                  fallbackText="Article Image"
                  showIcon={false}
                />
                <div className="absolute inset-0 bg-black/60" />

                {/* Terminal-themed overlay content */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-terminal-cyan font-medium text-lg terminal-glow mb-2">
                    {displayArticles[0].title}
                  </h4>
                  <p className="text-terminal-cyan/90 text-sm leading-relaxed line-clamp-2 mb-3">
                    {displayArticles[0].excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {displayArticles[0].tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-terminal-cyan/80">
                    <span>{new Date(displayArticles[0].publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                    <span>•</span>
                    <span>{displayArticles[0].readingTime}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Default Content */}
            <div className={`p-4 ${displayArticles[0].imageUrl ? 'group-hover:opacity-0' : ''} transition-opacity duration-300`}>
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
                    href={`/articles/${displayArticles[0].id}`}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
              <Link href={`/articles/${displayArticles[0].id}`}>
                <h4 className="text-base text-foreground mb-2 terminal-glow group-hover:text-primary/80 transition-colors">
                  {displayArticles[0].title}
                </h4>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {displayArticles[0].excerpt}
              </p>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <span>{new Date(displayArticles[0].publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</span>
                <span>•</span>
                <span>{displayArticles[0].readingTime}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="terminal-border bg-card/30 p-4">
            <h3 className="text-sm font-medium text-primary flex items-center gap-2 mb-2">
              <span className="w-4 h-px bg-primary" />
              Latest Article
            </h3>
            <p className="text-sm text-muted-foreground">No articles published yet.</p>
          </div>
        )}
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

        {projectsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner message="Loading projects..." />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="cursor-pointer transform hover:scale-[1.02] transition-all duration-200"
                onClick={() => handleProjectClick(project)}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  onClick={() => {}} // Handled by parent div
                />
              </div>
            ))}
          </div>
        )}

        <motion.div
          variants={itemVariants}
          className="mt-6 text-sm text-muted-foreground flex items-center gap-2"
        >
          <span className="text-primary">{displayProjects.length}</span> projects •{" "}
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