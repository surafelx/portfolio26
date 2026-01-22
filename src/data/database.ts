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
}

export interface Note {
  id: string;
  title: string;
  content: string;
}