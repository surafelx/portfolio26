import { recordVisit } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { ip, userAgent } = await request.json();

    // Use provided IP or get from headers
    const clientIP = ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    const visit = await recordVisit({
      ip: clientIP,
      userAgent: userAgent || request.headers.get('user-agent') || 'unknown',
      timestamp: new Date(),
    });

    return NextResponse.json(visit, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}