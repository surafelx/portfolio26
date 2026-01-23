import { NextRequest, NextResponse } from 'next/server';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

// In a real application, you'd store this in a database
// For now, we'll just log it and return success
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // In a real application, you'd save this to a database
    // For now, we'll just log it
    const contactMessage: ContactMessage = {
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      message,
      createdAt: new Date(),
      read: false
    };

    console.log('📧 New contact message received:', {
      id: contactMessage.id,
      name: contactMessage.name,
      email: contactMessage.email,
      messageLength: contactMessage.message.length,
      timestamp: contactMessage.createdAt
    });

    // Here you could:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send to Slack/Discord webhook
    // 4. etc.

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      id: contactMessage.id
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}