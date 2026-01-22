export interface Project {
  id: string;
  title: string;
  brief: string;
  description: string;
  tags: string[];
  keywords: string[];
  techStack: string[];
  videoUrl?: string;
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  year: string;
}

