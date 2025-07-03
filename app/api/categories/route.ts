import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { categories, posts } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

// GET /api/categories - Get all categories with post counts
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
      console.warn('Database not available during build time, returning empty categories')
      return NextResponse.json([])
    }

    // Handle case where searchParams might be undefined during static generation
    const status = searchParams?.get('status') || 'published'
    
    // Get categories with post counts
    let categoriesWithCounts
    if (status === 'all') {
      categoriesWithCounts = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          postCount: sql<number>`COALESCE(COUNT(${posts.id}), 0)`.as('postCount')
        })
        .from(categories)
        .leftJoin(posts, eq(categories.id, posts.categoryId))
        .groupBy(categories.id, categories.name, categories.slug, categories.description)
        .orderBy(categories.name)
    } else {
      categoriesWithCounts = await db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          postCount: sql<number>`COALESCE(COUNT(CASE WHEN ${posts.status} = ${status} THEN ${posts.id} END), 0)`.as('postCount')
        })
        .from(categories)
        .leftJoin(posts, eq(categories.id, posts.categoryId))
        .groupBy(categories.id, categories.name, categories.slug, categories.description)
        .orderBy(categories.name)
    }

    // Filter out categories with 0 posts when not showing all
    const filteredCategories = status === 'all' 
      ? categoriesWithCounts 
      : categoriesWithCounts.filter(cat => cat.postCount > 0)

    return NextResponse.json(filteredCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
} 