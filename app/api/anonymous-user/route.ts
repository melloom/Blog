import { NextRequest, NextResponse } from 'next/server';
import { updateAnonymousUserDisplayName, validateAnonymousToken } from '@/lib/anonymous-auth';

// GET /api/anonymous-user?token=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url!);
  const token = searchParams.get('token');
  
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  const user = await validateAnonymousToken(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  }

  return NextResponse.json({ 
    user: {
      id: user.id,
      displayName: user.displayName,
      createdAt: user.createdAt,
      lastSeen: user.lastSeen
    }
  });
}

// PUT /api/anonymous-user
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { token, displayName } = body;
  
  if (!token || !displayName) {
    return NextResponse.json({ error: 'Token and displayName are required' }, { status: 400 });
  }

  if (displayName.length < 2 || displayName.length > 50) {
    return NextResponse.json({ error: 'Display name must be between 2 and 50 characters' }, { status: 400 });
  }

  const user = await updateAnonymousUserDisplayName(token, displayName);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  }

  return NextResponse.json({ 
    user: {
      id: user.id,
      displayName: user.displayName,
      createdAt: user.createdAt,
      lastSeen: user.lastSeen
    }
  });
} 