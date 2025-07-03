import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { comments, blockedIPs } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getOrCreateAnonymousUser } from '@/lib/anonymous-auth';
import { filterComment } from '@/lib/content-filter';

const database = getDb();

// GET /api/comments?postId=123
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url!);
  const postId = searchParams.get('postId');
  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 });
  }
  
  // Only return approved comments for public display
  const postComments = await database
    .select()
    .from(comments)
    .where(and(
      eq(comments.postId, Number(postId)),
      eq(comments.status, 'approved')
    ))
    .all();
    
  return NextResponse.json({ comments: postComments });
}

// POST /api/comments
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { content, authorName, authorEmail, postId, userId, anonymousToken } = body;
  
  if (!content || !authorName || !postId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Get user IP for anonymous users
  const forwarded = request.headers.get('x-forwarded-for');
  const userIp = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

  // Check if IP is blocked
  if (userIp !== 'unknown') {
    const blockedIP = await database
      .select()
      .from(blockedIPs)
      .where(eq(blockedIPs.ipAddress, userIp))
      .get();

    if (blockedIP) {
      return NextResponse.json({ 
        error: 'Your IP address has been blocked from commenting',
        reason: blockedIP.reason 
      }, { status: 403 });
    }
  }

  // Apply automatic content filtering
  const filterResult = filterComment(content, authorName);
  
  let anonymousUserId: number | null = null;

  // Handle anonymous user
  if (!userId && anonymousToken) {
    const anonymousUser = await getOrCreateAnonymousUser(anonymousToken, userIp);
    anonymousUserId = anonymousUser.id;
  } else if (!userId && !anonymousToken) {
    // Create new anonymous user if no token provided
    const anonymousUser = await getOrCreateAnonymousUser(undefined, userIp);
    anonymousUserId = anonymousUser.id;
    
    // Create comment with automatic approval status
    const newComment = await database.insert(comments).values({
      content,
      authorName,
      authorEmail: authorEmail || 'anonymous@example.com',
      postId: Number(postId),
      anonymousUserId,
      status: filterResult.isApproved ? 'approved' : 'pending',
      createdAt: new Date(),
    }).returning();
    
    return NextResponse.json({ 
      comment: newComment[0],
      anonymousToken: anonymousUser.token,
      autoApproved: filterResult.isApproved,
      moderationReason: filterResult.reason
    }, { status: 201 });
  }

  // Create comment with automatic approval status
  const newComment = await database.insert(comments).values({
    content,
    authorName,
    authorEmail: authorEmail || 'anonymous@example.com',
    postId: Number(postId),
    userId: userId || null,
    anonymousUserId: anonymousUserId || null,
    status: filterResult.isApproved ? 'approved' : 'pending',
    createdAt: new Date(),
  }).returning();

  return NextResponse.json({ 
    comment: newComment[0],
    autoApproved: filterResult.isApproved,
    moderationReason: filterResult.reason
  }, { status: 201 });
} 