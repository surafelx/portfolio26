import "server-only";
import { MongoClient } from 'mongodb';
import type { Project, Article, Note, Visit, ProjectView, ArticleView } from '@/types/database';

export type { Project, Article, Note, Visit, ProjectView, ArticleView };

// Global variable to cache the database connection
let cachedClient: MongoClient | null = null;

export async function connectToDatabase(): Promise<any> {
  // If we have a cached connection, use it
  if (cachedClient && cachedClient) {
    return cachedClient.db('portfolio26');
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  // Create new connection
  cachedClient = new MongoClient(uri);

  try {
    await cachedClient.connect();
    console.log('Connected to MongoDB');
    return cachedClient.db('portfolio26');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// CRUD Operations for Projects
export async function getProjects(): Promise<Project[]> {
  const db = await connectToDatabase();
  const projectsCollection = db.collection('projects');
  const projects = await projectsCollection.find({}).sort({ createdAt: -1 }).toArray();
  return projects;
}

export async function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const db = await connectToDatabase();
  const projectsCollection = db.collection('projects');

  const newProject: Project = {
    ...projectData,
    id: projectData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await projectsCollection.insertOne(newProject);
  return newProject;
}

export async function updateProject(id: string, projectData: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project | null> {
  const db = await connectToDatabase();
  const projectsCollection = db.collection('projects');

  const result = await projectsCollection.findOneAndUpdate(
    { id },
    {
      $set: {
        ...projectData,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );

  return result;
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  const projectsCollection = db.collection('projects');

  const result = await projectsCollection.deleteOne({ id });
  return result.deletedCount > 0;
}

// CRUD Operations for Articles
export async function getArticles(): Promise<Article[]> {
  const db = await connectToDatabase();
  const articlesCollection = db.collection('articles');
  const articles = await articlesCollection.find({}).sort({ createdAt: -1 }).toArray();
  return articles;
}

export async function createArticle(articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
  const db = await connectToDatabase();
  const articlesCollection = db.collection('articles');

  const newArticle: Article = {
    ...articleData,
    id: articleData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await articlesCollection.insertOne(newArticle);
  return newArticle;
}

export async function updateArticle(id: string, articleData: Partial<Omit<Article, 'id' | 'createdAt'>>): Promise<Article | null> {
  const db = await connectToDatabase();
  const articlesCollection = db.collection('articles');

  const result = await articlesCollection.findOneAndUpdate(
    { id },
    {
      $set: {
        ...articleData,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );

  return result;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  const articlesCollection = db.collection('articles');

  const result = await articlesCollection.deleteOne({ id });
  return result.deletedCount > 0;
}

// CRUD Operations for Notes
export async function getNotes(): Promise<Note[]> {
  const db = await connectToDatabase();
  const notesCollection = db.collection('notes');
  const notes = await notesCollection.find({}).sort({ createdAt: -1 }).toArray();
  return notes;
}

export async function createNote(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
  const db = await connectToDatabase();
  const notesCollection = db.collection('notes');

  const newNote: Note = {
    ...noteData,
    id: `note-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await notesCollection.insertOne(newNote);
  return newNote;
}

export async function updateNote(id: string, noteData: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<Note | null> {
  const db = await connectToDatabase();
  const notesCollection = db.collection('notes');

  const result = await notesCollection.findOneAndUpdate(
    { id },
    {
      $set: {
        ...noteData,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );

  return result;
}

export async function deleteNote(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  const notesCollection = db.collection('notes');

  const result = await notesCollection.deleteOne({ id });
  return result.deletedCount > 0;
}

// Analytics Functions
export async function recordVisit(visitData: Omit<Visit, 'id'>): Promise<Visit> {
  const db = await connectToDatabase();
  const visitsCollection = db.collection('visits');

  const newVisit: Visit = {
    ...visitData,
    id: `visit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };

  await visitsCollection.insertOne(newVisit);
  return newVisit;
}

export async function getVisitStats(): Promise<{ total: number; uniqueIPs: number }> {
  const db = await connectToDatabase();
  const visitsCollection = db.collection('visits');

  const total = await visitsCollection.countDocuments();
  const uniqueIPs = (await visitsCollection.distinct('ip')).length;

  return { total, uniqueIPs };
}

export async function recordProjectView(projectId: string): Promise<ProjectView> {
  const db = await connectToDatabase();
  const projectViewsCollection = db.collection('project_views');

  const newView: ProjectView = {
    id: `view-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    projectId,
    timestamp: new Date(),
  };

  await projectViewsCollection.insertOne(newView);
  return newView;
}

export async function getProjectViewStats(): Promise<Array<{ projectId: string; views: number }>> {
  const db = await connectToDatabase();
  const projectViewsCollection = db.collection('project_views');

  const pipeline = [
    { $group: { _id: '$projectId', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
  ];

  const results = await projectViewsCollection.aggregate(pipeline).toArray();
  return results.map(r => ({ projectId: r._id, views: r.views }));
}

export async function recordArticleView(articleId: string): Promise<ArticleView> {
  const db = await connectToDatabase();
  const articleViewsCollection = db.collection('article_views');

  const newView: ArticleView = {
    id: `view-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    articleId,
    timestamp: new Date(),
  };

  await articleViewsCollection.insertOne(newView);
  return newView;
}

export async function getArticleViewStats(): Promise<Array<{ articleId: string; views: number }>> {
  const db = await connectToDatabase();
  const articleViewsCollection = db.collection('article_views');

  const pipeline = [
    { $group: { _id: '$articleId', views: { $sum: 1 } } },
    { $sort: { views: -1 } },
  ];

  const results = await articleViewsCollection.aggregate(pipeline).toArray();
  return results.map(r => ({ articleId: r._id, views: r.views }));
}