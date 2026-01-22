export interface Project {
  id: string;
  title: string;
  brief: string;
  description: string;
  tags: string[];
  keywords: string[];
  techStack: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  year: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  publishedAt: string;
  readingTime: string;
  author: string;
  images?: Array<{
    url: string;
    alt: string;
    caption: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics Interfaces
export interface Visit {
  id: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
}

export interface ProjectView {
  id: string;
  projectId: string;
  timestamp: Date;
}

export interface ArticleView {
  id: string;
  articleId: string;
  timestamp: Date;
}