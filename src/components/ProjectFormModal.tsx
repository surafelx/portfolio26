import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";
import { ProjectNodeGraph } from "@/components/ProjectNodeGraph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project } from "@/lib/database";

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
    year: new Date().getFullYear().toString(),
    priority: 5,
    nodeGraph: {
      nodes: [],
      edges: []
    }
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
        year: initialData.year || new Date().getFullYear().toString(),
        priority: initialData.priority || 5,
        nodeGraph: initialData.nodeGraph || {
          nodes: [],
          edges: []
        }
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="py-4">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Project Details</TabsTrigger>
              <TabsTrigger value="structure">Project Structure</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
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

                <ImageUpload
                  value={project.imageUrl}
                  onChange={(url) => setProject({...project, imageUrl: url})}
                  label="Project Image"
                  placeholder="Upload project image or enter URL"
                />

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

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Score (1-10)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={project.priority}
                    onChange={(e) => setProject({...project, priority: parseInt(e.target.value) || 5})}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher scores appear first on the main site (10 = highest priority)
                  </p>
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
            </TabsContent>

            <TabsContent value="structure" className="mt-4">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Create a visual representation of your project structure. Drag nodes to reposition them, click to edit properties.
                </div>

                <ProjectNodeGraph
                  nodes={project.nodeGraph?.nodes || []}
                  edges={project.nodeGraph?.edges || []}
                  onChange={(nodes, edges) => setProject({
                    ...project,
                    nodeGraph: { nodes, edges }
                  })}
                />
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  );
};