import { getArticles, getNotes } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Health check: Testing database connection');

    // Test articles collection
    const articles = await getArticles();
    console.log('Health check: Articles collection OK, count:', articles.length);

    // Test notes collection
    const notes = await getNotes();
    console.log('Health check: Notes collection OK, count:', notes.length);

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        articles: articles.length,
        notes: notes.length
      },
      environment: {
        node_env: process.env.NODE_ENV,
        mongodb_uri: process.env.MONGODB_URI ? 'configured' : 'missing'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        node_env: process.env.NODE_ENV,
        mongodb_uri: process.env.MONGODB_URI ? 'configured' : 'missing'
      }
    }, { status: 500 });
  }
}