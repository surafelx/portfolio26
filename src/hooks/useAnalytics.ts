import { useState, useEffect } from 'react';

const API_BASE = '/api';

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    visitors: 0,
    pageViews: 0,
    bounceRate: 0,
    projectsViewed: 0,
    uniqueVisitors: 0,
    projectStats: [],
    articleStats: [],
    noteStats: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/analytics`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { analytics, loading, refetch: fetchAnalytics };
};