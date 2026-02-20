import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import type { Project } from "@/lib/database";

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export const ProjectCard = ({ project, index, onClick }: ProjectCardProps) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="group terminal-border bg-card/50 cursor-pointer transition-all duration-300 hover:bg-card hover:border-primary hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] overflow-hidden relative"
    >
      {/* Default Image with Overlay */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover"
          fallbackText="Coming Soon"
          showIcon={false}
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Terminal-themed overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-muted-foreground text-xs">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-terminal-cyan font-medium text-lg terminal-glow">
              {project.title}
            </h3>
          </div>

          <p
            className="text-sm text-terminal-cyan/90 mb-3 leading-relaxed line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: highlightText(project.brief, project.keywords),
            }}
          />

          <div className="flex flex-wrap gap-1 mb-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-terminal-cyan/80">
            <span>{project.year}</span>
            <span>•</span>
            <span>{project.techStack.slice(0, 3).join(" / ")}</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-sm text-white hover:text-primary transition-colors rounded"
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
              className="w-8 h-8 flex items-center justify-center bg-black/50 backdrop-blur-sm text-white hover:text-primary transition-colors rounded"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
