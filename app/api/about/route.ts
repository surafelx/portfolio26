import { getAbout, updateAbout } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const about = await getAbout();
    if (about) {
      return NextResponse.json(about);
    } else {
      return NextResponse.json({ error: 'About not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updatedAbout = await updateAbout(body);
    if (updatedAbout) {
      return NextResponse.json(updatedAbout);
    } else {
      return NextResponse.json({ error: 'Failed to update about' }, { status: 500 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}