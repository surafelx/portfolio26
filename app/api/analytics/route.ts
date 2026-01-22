import { getVisitStats, getProjectViewStats, getArticleViewStats } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const [visitStats, projectStats, articleStats] = await Promise.all([
      getVisitStats(),
      getProjectViewStats(),
      getArticleViewStats(),
    ]);

    return NextResponse.json({
      visitors: visitStats.total,
      uniqueVisitors: visitStats.uniqueIPs,
      pageViews: visitStats.total, // Assuming each visit is a page view
      projectsViewed: projectStats.reduce((sum, p) => sum + p.views, 0),
      projectStats,
      articleStats,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}