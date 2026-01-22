import { useState, useEffect } from 'react';
import type { Note } from '@/lib/database';

const API_BASE = '/api';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/notes`);
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`${API_BASE}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) {
        throw new Error('Failed to create note');
      }
      const newNote = await response.json();
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError('Failed to create note');
      console.error('Error creating note:', err);
      throw err;
    }
  };

  const editNote = async (id: string, noteData: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    try {
      const response = await fetch(`${API_BASE}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) {
        throw new Error('Failed to update note');
      }
      const updatedNote = await response.json();
      setNotes(prev => prev.map(n => n.id === id ? updatedNote : n));
      return updatedNote;
    } catch (err) {
      setError('Failed to update note');
      console.error('Error updating note:', err);
      throw err;
    }
  };

  const removeNote = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/notes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
      setNotes(prev => prev.filter(n => n.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
      throw err;
    }
  };

  const refetch = () => {
    fetchNotes();
  };

  return { notes, loading, error, refetch, addNote, editNote, removeNote };
};