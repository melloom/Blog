import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { tags } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// PATCH /api/admin/tags/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if we're in build time
    if (process.env.NODE_ENV === 'production' && !process.env.TURSO_DATABASE_URL) {
      return NextResponse.json({ error: 'Service unavailable during build' }, { status: 503 });
    }

    const database = getDb();

    const body = await request.json();
    const { name } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
    }
    
    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const updatedTag = await database
      .update(tags)
      .set({
        name,
        slug,
      })
      .where(eq(tags.id, parseInt(params.id)))
      .returning();
    
    if (updatedTag.length === 0) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }
    
    return NextResponse.json({ tag: updatedTag[0] });
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
  }
}

// DELETE /api/admin/tags/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if we're in build time
    if (process.env.NODE_ENV === 'production' && !process.env.TURSO_DATABASE_URL) {
      return NextResponse.json({ error: 'Service unavailable during build' }, { status: 503 });
    }

    const database = getDb();

    const deletedTag = await database
      .delete(tags)
      .where(eq(tags.id, parseInt(params.id)))
      .returning();
    
    if (deletedTag.length === 0) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
} 