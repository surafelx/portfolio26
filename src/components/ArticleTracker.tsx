"use client";

import { useEffect } from "react";

interface ArticleTrackerProps {
  articleId: string;
}

export function ArticleTracker({ articleId }: ArticleTrackerProps) {
  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    fetch(`${baseUrl}/api/analytics/article-views`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId }),
    }).catch(console.error);
  }, [articleId]);

  return null;
}