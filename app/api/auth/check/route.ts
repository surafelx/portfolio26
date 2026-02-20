import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (session) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}
