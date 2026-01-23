import { useState, useEffect } from 'react';
import type { About } from '@/lib/database';

const API_BASE = '/api';

export const useAbout = () => {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/about`);
      if (!response.ok) {
        if (response.status === 404) {
          setAbout(null);
          return;
        }
        throw new Error('Failed to fetch about');
      }
      const data = await response.json();
      setAbout(data);
    } catch (err) {
      setError('Failed to fetch about');
      console.error('Error fetching about:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const refetch = () => {
    fetchAbout();
  };

  return { about, loading, error, refetch };
};