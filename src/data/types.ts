// Shared content types for the portfolio. These were previously colocated with
// the MongoDB layer; the site now serves static content from src/data/*.

export interface ProjectNode {
  id: string;
  type: 'input' | 'default' | 'output';
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    tech?: string[];
  };
}

export interface ProjectEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
}

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
  priority: number; // higher = more important
  nodeGraph?: {
    nodes: ProjectNode[];
    edges: ProjectEdge[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ArticleBlock {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'paragraph' | 'image' | 'code' | 'quote' | 'image-grid' | 'two-column' | 'youtube-video' | 'video' | 'strudel-music';
  content: string;
  metadata?: {
    alt?: string;
    caption?: string;
    language?: string;
    images?: Array<{
      url: string;
      alt: string;
      caption: string;
    }>;
    layout?: 'single' | 'grid-2' | 'grid-3' | 'grid-4';
    videoUrl?: string;
    title?: string;
  };
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  blocks: ArticleBlock[];
  tags: string[];
  publishedAt: string;
  readingTime: string;
  author: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NoteBlock {
  id: string;
  type: 'paragraph' | 'title' | 'image' | 'code' | 'quote';
  content: string;
  metadata?: {
    alt?: string;
    caption?: string;
    language?: string;
  };
}

export interface Note {
  id: string;
  title: string;
  blocks: NoteBlock[];
  createdAt?: string;
  updatedAt?: string;
}

export interface About {
  id: string;
  summary: string;
  qualifications?: string[];
  skills: {
    programming: string[];
    tools: string[];
    databases: string[];
    ai: string[];
    testing: string[];
    devops: string[];
    other: string[];
  };
  experience: Array<{
    company: string;
    position: string;
    dates: string;
    description: string[];
    location?: string;
  }>;
  education: {
    institution: string;
    degree: string;
    graduation: string;
    gpa?: string;
  };
  personalInterests?: {
    coffeeAndLateNights?: string;
    liveCodingMusic?: string;
    gamingAndStrategy?: string;
    photographyAndTech?: string;
  };
  contact?: {
    email?: string;
    location?: string;
    responseTime?: string;
  };
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
    upwork?: string;
  };
  resumeUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
