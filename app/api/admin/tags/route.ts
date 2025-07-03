import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { tags } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const database = getDb();

// GET /api/admin/tags
export async function GET() {
  try {
    const allTags = await database.select().from(tags).all();
    
    // For now, we'll set postCount to 0 since we don't have the relationship set up yet
    const tagsWithCount = allTags.map(tag => ({
      ...tag,
      postCount: 0 // TODO: Add proper post count when we have the relationship
    }));
    
    return NextResponse.json({ tags: tagsWithCount });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

// POST /api/admin/tags
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 });
    }
    
    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const newTag = await database.insert(tags).values({
      name,
      slug,
    }).returning();
    
    return NextResponse.json({ tag: newTag[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
} 