import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { comments, posts, users, anonymousUsers } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

const database = getDb();

// GET /api/admin/comments - Get all comments with post and user info
export async function GET(request: NextRequest) {
  try {
    const allComments = await database
      .select({
        id: comments.id,
        content: comments.content,
        authorName: comments.authorName,
        authorEmail: comments.authorEmail,
        postId: comments.postId,
        userId: comments.userId,
        anonymousUserId: comments.anonymousUserId,
        status: comments.status,
        createdAt: comments.createdAt,
        // Post information
        postTitle: posts.title,
        postSlug: posts.slug,
        // Anonymous user information
        userIp: anonymousUsers.userIp,
        displayName: anonymousUsers.displayName,
      })
      .from(comments)
      .leftJoin(posts, eq(comments.postId, posts.id))
      .leftJoin(users, eq(comments.userId, users.id))
      .leftJoin(anonymousUsers, eq(comments.anonymousUserId, anonymousUsers.id))
      .orderBy(desc(comments.createdAt))
      .all();

    // Transform the data to match the frontend interface
    const transformedComments = allComments.map(comment => ({
      id: comment.id,
      content: comment.content,
      authorName: comment.authorName,
      authorEmail: comment.authorEmail,
      postId: comment.postId,
      userId: comment.userId,
      anonymousUserId: comment.anonymousUserId,
      status: comment.status,
      createdAt: comment.createdAt,
      post: comment.postTitle ? {
        title: comment.postTitle,
        slug: comment.postSlug || '',
      } : undefined,
      anonymousUser: comment.userIp ? {
        userIp: comment.userIp,
        displayName: comment.displayName,
      } : undefined,
    }));

    return NextResponse.json({ comments: transformedComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
} 