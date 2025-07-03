import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { likes } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getOrCreateAnonymousUser } from '@/lib/anonymous-auth';

// GET /api/likes?postId=123
export async function GET(
  request: NextRequest,
  { searchParams }: { searchParams: URLSearchParams }
) {
  try {
    // Try to get the database, but handle the case where it's not available
    let db
    try {
      db = getDb()
    } catch (dbError) {
      console.warn('Database not available during build time, returning empty likes')
      return NextResponse.json({ count: 0 })
    }

    // During static generation, searchParams might be undefined
    let postId = null
    if (searchParams && typeof searchParams.get === 'function') {
      postId = searchParams.get('postId')
    }
    
    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }
    
    const count = await db.select().from(likes).where(eq(likes.postId, Number(postId))).all();
    return NextResponse.json({ count: count.length });
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 })
  }
}

// POST /api/likes
export async function POST(request: NextRequest) {
  try {
    // Try to get the database, but handle the case where it's not available
    let db
    try {
      db = getDb()
    } catch (dbError) {
      console.warn('Database not available during build time, returning error')
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 })
    }

    const body = await request.json();
    const { postId, userId, anonymousToken } = body;
    
    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
    }

    // Get user IP for anonymous users
    const forwarded = request.headers.get('x-forwarded-for');
    const userIp = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    let anonymousUserId: number | null = null;

    // Handle anonymous user
    if (!userId && anonymousToken) {
      const anonymousUser = await getOrCreateAnonymousUser(anonymousToken, userIp);
      anonymousUserId = anonymousUser.id;
    } else if (!userId && !anonymousToken) {
      // Create new anonymous user if no token provided
      const anonymousUser = await getOrCreateAnonymousUser(undefined, userIp);
      anonymousUserId = anonymousUser.id;
      // Return the token so client can store it
      return NextResponse.json({ 
        like: { postId: Number(postId), anonymousUserId },
        anonymousToken: anonymousUser.token 
      }, { status: 201 });
    }

    // Prevent duplicate like
    const existing = await db.select().from(likes).where(
      and(
        eq(likes.postId, Number(postId)),
        userId ? eq(likes.userId, userId) : eq(likes.anonymousUserId, anonymousUserId!)
      )
    ).get();

    if (existing) {
      return NextResponse.json({ error: 'Already liked' }, { status: 409 });
    }

    const newLike = await db.insert(likes).values({
      postId: Number(postId),
      userId: userId || null,
      anonymousUserId: anonymousUserId || null,
      createdAt: new Date(),
    }).returning();

    return NextResponse.json({ like: newLike[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating like:', error)
    return NextResponse.json({ error: 'Failed to create like' }, { status: 500 })
  }
} 