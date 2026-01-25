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
  createdAt: Date;
  updatedAt: Date;
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