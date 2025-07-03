import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { comments } from '@/lib/db/schema';
import { inArray } from 'drizzle-orm';

// PATCH /api/admin/comments/bulk - Bulk actions on comments
export async function PATCH(request: NextRequest) {
  try {
    // Check if we're in build time
    if (process.env.NODE_ENV === 'production' && !process.env.TURSO_DATABASE_URL) {
      return NextResponse.json({ error: 'Service unavailable during build' }, { status: 503 });
    }

    const database = getDb();

    const body = await request.json();
    const { commentIds, action } = body;

    if (!commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
      return NextResponse.json({ error: 'Comment IDs are required' }, { status: 400 });
    }

    if (!action || !['approve', 'spam', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (action === 'delete') {
      // Delete comments
      const deletedComments = await database
        .delete(comments)
        .where(inArray(comments.id, commentIds))
        .returning();

      return NextResponse.json({ 
        message: `Deleted ${deletedComments.length} comments`,
        deletedCount: deletedComments.length 
      });
    } else {
      // Update comment status
      const newStatus = action === 'approve' ? 'approved' : 'spam';
      
      const updatedComments = await database
        .update(comments)
        .set({ status: newStatus })
        .where(inArray(comments.id, commentIds))
        .returning();

      return NextResponse.json({ 
        message: `Updated ${updatedComments.length} comments to ${newStatus}`,
        updatedCount: updatedComments.length 
      });
    }
  } catch (error) {
    console.error('Error performing bulk action:', error);
    return NextResponse.json({ error: 'Failed to perform bulk action' }, { status: 500 });
  }
} 