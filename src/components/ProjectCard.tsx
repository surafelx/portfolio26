import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import type { Project } from "@/data/types";

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export const ProjectCard = ({ project, index, onClick }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group terminal-border bg-card cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40"
    >
      {/* Cover image */}
      <div className="relative h-44 overflow-hidden bg-secondary">
        <ImageWithFallback
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          fallbackText="Coming Soon"
          showIcon={false}
        />

        {/* Action icons */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="GitHub repository"
              className="w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm text-foreground hover:text-primary transition-colors rounded-lg shadow-sm"
            >
              <Github size={16} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Live site"
              className="w-8 h-8 flex items-center justify-center bg-background/80 backdrop-blur-sm text-foreground hover:text-primary transition-colors rounded-lg shadow-sm"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-xs font-mono text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
            {project.title}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
          {project.brief}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{project.year}</span>
          <span>·</span>
          <span className="truncate">{project.techStack.slice(0, 3).join(" / ")}</span>
        </div>
      </div>
    </motion.div>
  );
};
