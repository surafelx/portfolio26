import { getVisitStats, getProjectViewStats, getArticleViewStats, getNoteViewStats } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const [visitStats, projectStats, articleStats, noteStats] = await Promise.all([
      getVisitStats(),
      getProjectViewStats(),
      getArticleViewStats(),
      getNoteViewStats(),
    ]);

    return NextResponse.json({
      visitors: visitStats.total,
      uniqueVisitors: visitStats.uniqueIPs,
      pageViews: visitStats.total, // Assuming each visit is a page view
      projectsViewed: projectStats.reduce((sum, p) => sum + p.views, 0),
      projectStats,
      articleStats,
      noteStats,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}