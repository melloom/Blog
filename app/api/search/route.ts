import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, categories, tags, postTags } from '@/lib/db/schema'
import { eq, like, or, and, desc, asc, sql } from 'drizzle-orm'

// GET /api/search?q=searchterm&type=posts&category=tech&limit=10
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all' // posts, categories, tags, all
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        page,
        totalPages: 0,
        query: ''
      })
    }

    const searchTerm = `%${query}%`
    const results: any[] = []

    // Search posts
    if (type === 'all' || type === 'posts') {
      let whereCondition = and(
        eq(posts.status, 'published'),
        or(
          like(posts.title, searchTerm),
          like(posts.excerpt || '', searchTerm),
          like(posts.content || '', searchTerm)
        )
      )

      // Add category filter if specified
      if (category && category !== 'all') {
        whereCondition = and(whereCondition, eq(categories.slug, category))
      }

      const postsResults = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          featuredImage: posts.featuredImage,
          publishedAt: posts.publishedAt,
          createdAt: posts.createdAt,
          status: posts.status,
          categoryId: posts.categoryId,
          categoryName: categories.name,
          type: sql`'post'`.as('type'),
          relevance: sql`CASE WHEN ${posts.title} LIKE ${searchTerm} THEN 100 WHEN ${posts.excerpt} LIKE ${searchTerm} THEN 50 ELSE 25 END`.as('relevance')
        })
        .from(posts)
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .where(whereCondition)
        .orderBy(desc(sql`relevance`), desc(posts.publishedAt))
        .limit(limit)
        .offset(offset)
        .all()

      results.push(...postsResults)
    }

    // Search categories
    if (type === 'all' || type === 'categories') {
      const categoriesResults = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          type: sql`'category'`.as('type'),
          relevance: sql`CASE WHEN ${categories.name} LIKE ${searchTerm} THEN 100 WHEN ${categories.description} LIKE ${searchTerm} THEN 50 ELSE 25 END`.as('relevance')
        })
        .from(categories)
        .where(
          or(
            like(categories.name, searchTerm),
            like(categories.description || '', searchTerm)
          )
        )
        .orderBy(desc(sql`relevance`), asc(categories.name))
        .limit(limit)
        .offset(offset)
        .all()

      results.push(...categoriesResults)
    }

    // Search tags
    if (type === 'all' || type === 'tags') {
      const tagsResults = await db
        .select({
          id: tags.id,
          name: tags.name,
          slug: tags.slug,
          type: sql`'tag'`.as('type'),
          relevance: sql`CASE WHEN ${tags.name} LIKE ${searchTerm} THEN 100 ELSE 25 END`.as('relevance')
        })
        .from(tags)
        .where(like(tags.name, searchTerm))
        .orderBy(desc(sql`relevance`), asc(tags.name))
        .limit(limit)
        .offset(offset)
        .all()

      results.push(...tagsResults)
    }

    // Sort all results by relevance and date
    results.sort((a, b) => {
      if (a.relevance !== b.relevance) {
        return b.relevance - a.relevance
      }
      // For posts, sort by published date
      if (a.type === 'post' && b.type === 'post') {
        return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
      }
      // For categories and tags, sort alphabetically
      return (a.name || a.title).localeCompare(b.name || b.title)
    })

    // Get total count for pagination
    let totalCount = 0
    if (type === 'posts') {
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .where(
          and(
            eq(posts.status, 'published'),
            or(
              like(posts.title, searchTerm),
              like(posts.excerpt || '', searchTerm),
              like(posts.content || '', searchTerm)
            )
          )
        )
        .get()
      totalCount = countResult?.count || 0
    } else {
      totalCount = results.length
    }

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      results: results.slice(0, limit),
      total: totalCount,
      page,
      totalPages,
      query,
      type
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 