import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { tags, postTags, posts } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

// GET /api/tags - Get all tags with post counts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'published'
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Get tags with post counts
    let tagsWithCounts
    if (status === 'all') {
      tagsWithCounts = await db
        .select({
          id: tags.id,
          name: tags.name,
          slug: tags.slug,
          postCount: sql<number>`COALESCE(COUNT(${posts.id}), 0)`.as('postCount')
        })
        .from(tags)
        .leftJoin(postTags, eq(tags.id, postTags.tagId))
        .leftJoin(posts, eq(postTags.postId, posts.id))
        .groupBy(tags.id, tags.name, tags.slug)
        .orderBy(sql`postCount DESC`)
        .limit(limit)
    } else {
      tagsWithCounts = await db
        .select({
          id: tags.id,
          name: tags.name,
          slug: tags.slug,
          postCount: sql<number>`COALESCE(COUNT(CASE WHEN ${posts.status} = ${status} THEN ${posts.id} END), 0)`.as('postCount')
        })
        .from(tags)
        .leftJoin(postTags, eq(tags.id, postTags.tagId))
        .leftJoin(posts, eq(postTags.postId, posts.id))
        .groupBy(tags.id, tags.name, tags.slug)
        .orderBy(sql`postCount DESC`)
        .limit(limit)
    }

    // Filter out tags with 0 posts when not showing all
    const filteredTags = status === 'all' 
      ? tagsWithCounts 
      : tagsWithCounts.filter(tag => tag.postCount > 0)

    return NextResponse.json(filteredTags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
} 