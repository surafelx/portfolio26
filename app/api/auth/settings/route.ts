import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    // Check for authentication
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Read current .env file
    const envPath = path.join(process.cwd(), '.env');
    let envContent = fs.readFileSync(envPath, 'utf-8');

    // Update credentials using string replacement
    envContent = envContent.replace(/^ADMIN_USERNAME=.*$/m, `ADMIN_USERNAME=${username}`);
    envContent = envContent.replace(/^ADMIN_PASSWORD=.*$/m, `ADMIN_PASSWORD=${password}`);

    // Write back to .env file
    fs.writeFileSync(envPath, envContent);

    // Note: In production (Vercel), you'd need to use their Environment Variables API
    // This local file approach works for local development

    return NextResponse.json({ success: true, message: 'Credentials updated. Note: On Vercel, changes require using their Environment Variables API.' });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
