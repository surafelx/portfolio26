import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minimize2, ExternalLink, Github, Play, Info, Layout, Code, Video, Mail, MapPin } from "lucide-react";
import type { Project } from "@/data/projects";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "overview" | "details" | "tech" | "demo";

const tabs = [
  { id: "overview" as TabType, label: "Overview", icon: Layout },
  { id: "details" as TabType, label: "Details", icon: Info },
  { id: "tech" as TabType, label: "Tech Stack", icon: Code },
  { id: "demo" as TabType, label: "Demo", icon: Play },
];

export const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showDemo, setShowDemo] = useState(false);

  if (!project) return null;

  const highlightText = (text: string, keywords: string[]) => {
    let result = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, "gi");
      result = result.replace(
        regex,
        '<span class="text-terminal-cyan font-medium">$1</span>'
      );
    });
    return result;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Brief */}
            <div>
              <h3 className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <span className="w-4 h-px bg-primary" />
                Brief
              </h3>
              <p
                className="text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlightText(project.brief, project.keywords),
                }}
              />
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <span className="w-4 h-px bg-primary" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm px-3 py-1 bg-primary/10 border border-primary/30 text-primary"
                  >
                    #{tag.toLowerCase().replace(/\//g, "-").replace(/\s/g, "")}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-4 pt-4 border-t border-border">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:terminal-glow transition-all"
                >
                  <ExternalLink size={16} />
                  <span>Live Demo</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                >
                  <Github size={16} />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>
        );

      case "details":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <span className="w-4 h-px bg-primary" />
                Full Description
              </h3>
              <p
                className="text-foreground/80 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlightText(project.description, project.keywords),
                }}
              />
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <span className="w-4 h-px bg-primary" />
                Key Highlights
              </h3>
              <ul className="space-y-2">
                {project.keywords.map((keyword, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground/80">
                    <span className="text-primary">→</span>
                    <span className="text-terminal-cyan">{keyword}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "tech":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <span className="w-4 h-px bg-primary" />
                Technologies Used
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {project.techStack.map((tech) => (
                  <div
                    key={tech}
                    className="terminal-border bg-secondary/50 p-3 flex items-center gap-2"
                  >
                    <Code size={14} className="text-terminal-amber" />
                    <span className="text-foreground">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "demo":
        return (
          <div className="space-y-6">
            {project.videoUrl ? (
              <div className="terminal-border bg-secondary/30 aspect-video flex items-center justify-center group cursor-pointer hover:border-primary transition-colors">
                <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                  <Play size={48} />
                  <span className="text-sm">Play Demo Video</span>
                </div>
              </div>
            ) : (
              <div className="terminal-border bg-secondary/30 aspect-video flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Video size={48} className="opacity-30" />
                  <span className="text-sm">No demo video available</span>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground text-center">
              {project.videoUrl
                ? "Click to watch a demonstration of the project in action."
                : "Demo video coming soon."}
            </p>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center"
            onClick={onClose}
          >
            {/* Modal Container - fixed size */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`terminal-border bg-card overflow-hidden flex flex-col ${
                isMaximized
                  ? "fixed inset-4"
                  : "w-full max-w-4xl h-[600px] mx-4"
              }`}
            >
              {/* Header with contact info */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/50 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <button
                      onClick={onClose}
                      className="w-3 h-3 rounded-full bg-destructive hover:brightness-110 transition-all"
                    />
                    <button
                      onClick={() => setIsMaximized(false)}
                      className="w-3 h-3 rounded-full bg-terminal-amber hover:brightness-110 transition-all"
                    />
                    <button
                      onClick={() => setIsMaximized(!isMaximized)}
                      className="w-3 h-3 rounded-full bg-primary hover:brightness-110 transition-all"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {project.title}
                  </span>
                </div>

                {/* Contact info in header */}
                <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail size={12} className="text-primary" />
                    hello@example.dev
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-terminal-cyan" />
                    SF, CA
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="text-muted-foreground hover:text-primary transition-colors p-1"
                  >
                    {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Main content with sidebar */}
              <div className="flex flex-1 overflow-hidden min-h-0">
                {/* Sidebar Navigation */}
                <div className="w-48 border-r border-border bg-secondary/30 p-4 hidden sm:flex flex-col shrink-0">
                  {/* Project Identity */}
                  <div className="mb-6 pb-4 border-b border-border">
                    <div className="w-16 h-16 terminal-border overflow-hidden mb-3">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-primary font-medium terminal-glow text-sm">
                      {project.title}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">{project.year}</p>
                  </div>

                  {/* Tab Navigation */}
                  <nav className="space-y-1 flex-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-all ${
                          activeTab === tab.id
                            ? "bg-primary/10 text-primary border-l-2 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        <tab.icon size={14} />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>

                  {/* Quick links */}
                  <div className="pt-4 border-t border-border space-y-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink size={12} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github size={12} />
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Content Area - scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Mobile tab selector */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2 sm:hidden">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs whitespace-nowrap transition-all ${
                          activeTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        <tab.icon size={12} />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab Title */}
                  <h3 className="text-lg font-medium text-foreground mb-6 flex items-center gap-2">
                    <span className="w-6 h-px bg-primary" />
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h3>

                  {/* Tab Content */}
                  <div className="min-h-[300px]">
                    {renderTabContent()}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}

      {/* Demo Overlay */}
      {showDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowDemo(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Demo: {project.title}</h3>
              <button
                onClick={() => setShowDemo(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-secondary/20 p-4 rounded border border-border">
                <p className="text-sm text-muted-foreground mb-2">Interactive Demo</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-foreground">Demo is running...</span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>This is a placeholder for the interactive demo of <strong>{project.title}</strong>.</p>
                <p className="mt-2">In a real implementation, this would contain:</p>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Interactive features of the project</li>
                  <li>• Sample data and functionality</li>
                  <li>• Guided tour of key features</li>
                </ul>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setShowDemo(false)}
                  className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors rounded"
                >
                  Close Demo
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
