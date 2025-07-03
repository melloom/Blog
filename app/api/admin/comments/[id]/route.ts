import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// PATCH /api/admin/comments/[id] - Update comment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'approved', 'spam'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedComment = await db
      .update(comments)
      .set({ status })
      .where(eq(comments.id, Number(id)))
      .returning();

    if (updatedComment.length === 0) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ comment: updatedComment[0] });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

// DELETE /api/admin/comments/[id] - Delete comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const deletedComment = await db
      .delete(comments)
      .where(eq(comments.id, Number(id)))
      .returning();

    if (deletedComment.length === 0) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
} 