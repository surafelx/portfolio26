"use client";

import { useEffect } from "react";

interface ArticleTrackerProps {
  articleId: string;
}

export function ArticleTracker({ articleId }: ArticleTrackerProps) {
  useEffect(() => {
    fetch('/api/analytics/article-views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId }),
    }).catch(console.error);
  }, [articleId]);

  return null;
}