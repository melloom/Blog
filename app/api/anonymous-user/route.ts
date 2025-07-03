import { NextRequest, NextResponse } from 'next/server';
import { updateAnonymousUserDisplayName, validateAnonymousToken } from '@/lib/anonymous-auth';

// GET /api/anonymous-user?token=xxx
export async function GET(
  request: NextRequest,
  { searchParams }: { searchParams: URLSearchParams }
) {
  try {
    // During static generation, searchParams might be undefined
    let token = null
    if (searchParams && typeof searchParams.get === 'function') {
      token = searchParams.get('token')
    }
    
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
  } catch (error) {
    console.error('Error fetching anonymous user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// PUT /api/anonymous-user
export async function PUT(request: NextRequest) {
  try {
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
  } catch (error) {
    console.error('Error updating anonymous user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
} 