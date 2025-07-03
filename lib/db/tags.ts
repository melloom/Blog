import { getDb } from '@/lib/db'
import { tags, postTags, posts } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function getTagsWithCounts({ status = 'published', limit = 10 }: { status?: string, limit?: number } = {}) {
  // Try to get the database, but handle the case where it's not available
  let db
  try {
    db = getDb()
  } catch (dbError) {
    console.warn('Database not available during build time, returning empty tags')
    return []
  }

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

  return filteredTags
} 