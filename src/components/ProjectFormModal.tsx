import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Project } from "@/data/projects";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Omit<Project, 'id'>) => void;
  initialData?: Partial<Project>;
  isEditing?: boolean;
}

export const ProjectFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = {}, 
  isEditing = false
}: ProjectFormModalProps) => {
  const [project, setProject] = useState<Omit<Project, 'id'>>({
    title: "",
    brief: "",
    description: "",
    tags: [],
    keywords: [],
    techStack: [],
    imageUrl: "",
    liveUrl: "",
    githubUrl: "",
    videoUrl: "",
    year: new Date().getFullYear().toString()
  } as Omit<Project, 'id'>);

  useEffect(() => {
    if (initialData) {
      setProject({
        title: initialData.title || "",
        brief: initialData.brief || "",
        description: initialData.description || "",
        tags: initialData.tags || [],
        keywords: initialData.keywords || [],
        techStack: initialData.techStack || [],
        imageUrl: initialData.imageUrl || "",
        liveUrl: initialData.liveUrl || "",
        githubUrl: initialData.githubUrl || "",
        videoUrl: initialData.videoUrl || "",
        year: initialData.year || new Date().getFullYear().toString()
      } as Omit<Project, 'id'>);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(project);
    onClose();
  };

  const availableTags = ["AI/ML", "Distributed Systems", "Security", "Cryptography", "DevOps", "Monitoring", "Developer Tools", "Networking", "IoT", "P2P"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={project.title}
                onChange={(e) => setProject({...project, title: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brief">Brief Description</Label>
              <Input
                id="brief"
                value={project.brief}
                onChange={(e) => setProject({...project, brief: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                value={project.description}
                onChange={(e) => setProject({...project, description: e.target.value})}
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={project.tags.join(", ")}
                onChange={(e) => setProject({...project, tags: e.target.value.split(",").map(s => s.trim()).filter(s => s)})}
                placeholder="AI/ML, Distributed Systems"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords (comma-separated)</Label>
              <Input
                id="keywords"
                value={project.keywords.join(", ")}
                onChange={(e) => setProject({...project, keywords: e.target.value.split(",").map(s => s.trim()).filter(s => s)})}
                placeholder="collaborative, neural networks"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
              <Input
                id="techStack"
                value={project.techStack.join(", ")}
                onChange={(e) => setProject({...project, techStack: e.target.value.split(",").map(s => s.trim()).filter(s => s)})}
                placeholder="Python, PyTorch, React"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={project.imageUrl}
                onChange={(e) => setProject({...project, imageUrl: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live URL</Label>
              <Input
                id="liveUrl"
                value={project.liveUrl || ""}
                onChange={(e) => setProject({...project, liveUrl: e.target.value})}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                value={project.githubUrl || ""}
                onChange={(e) => setProject({...project, githubUrl: e.target.value})}
                placeholder="https://github.com/user/repo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={project.videoUrl || ""}
                onChange={(e) => setProject({...project, videoUrl: e.target.value})}
                placeholder="https://example.com/demo.mp4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={project.year}
                onChange={(e) => setProject({...project, year: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Project" : "Add Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};