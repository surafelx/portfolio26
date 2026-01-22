import { useState, useEffect } from 'react';
import type { Project } from '@/types/database';

const API_BASE = '/api';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/projects`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      const newProject = await response.json();
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      setError('Failed to create project');
      console.error('Error creating project:', err);
      throw err;
    }
  };

  const editProject = async (id: string, projectData: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    try {
      const response = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
      const updatedProject = await response.json();
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      setError('Failed to update project');
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const removeProject = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      setProjects(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete project');
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  const refetch = () => {
    fetchProjects();
  };

  return { projects, loading, error, refetch, addProject, editProject, removeProject };
};