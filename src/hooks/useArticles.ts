import { useState, useEffect } from 'react';
import type { Article } from '@/lib/database';

const API_BASE = '/api';

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/articles`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError('Failed to fetch articles');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const addArticle = async (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${API_BASE}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });
      if (!response.ok) {
        throw new Error('Failed to create article');
      }
      const newArticle = await response.json();
      setArticles(prev => [newArticle, ...prev]);
      return newArticle;
    } catch (err) {
      setError('Failed to create article');
      console.error('Error creating article:', err);
      throw err;
    }
  };

  const editArticle = async (id: string, articleData: Partial<Omit<Article, 'id' | 'createdAt'>>) => {
    try {
      const response = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });
      if (!response.ok) {
        throw new Error('Failed to update article');
      }
      const updatedArticle = await response.json();
      setArticles(prev => prev.map(a => a.id === id ? updatedArticle : a));
      return updatedArticle;
    } catch (err) {
      setError('Failed to update article');
      console.error('Error updating article:', err);
      throw err;
    }
  };

  const removeArticle = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete article');
      }
      setArticles(prev => prev.filter(a => a.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete article');
      console.error('Error deleting article:', err);
      throw err;
    }
  };

  const getArticleById = (id: string): Article | undefined => {
    return articles.find(article => article.id === id);
  };

  const refetch = () => {
    fetchArticles();
  };

  return { articles, loading, error, refetch, getArticleById, addArticle, editArticle, removeArticle };
};