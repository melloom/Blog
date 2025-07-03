import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { categories, posts } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

const database = getDb();

// GET /api/admin/categories - Get all categories with post counts
export async function GET() {
  try {
    const categoriesWithCounts = await database
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        createdAt: categories.createdAt,
        postCount: sql<number>`COUNT(${posts.id})`.as('postCount')
      })
      .from(categories)
      .leftJoin(posts, eq(categories.id, posts.categoryId))
      .groupBy(categories.id)
      .orderBy(categories.name)

    return NextResponse.json(categoriesWithCounts)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { message: 'Error fetching categories' },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const { name, slug, description } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        { message: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if category with same name or slug already exists
    const existingCategory = await database
      .select()
      .from(categories)
      .where(sql`${categories.name} = ${name} OR ${categories.slug} = ${slug}`)
      .limit(1)

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { message: 'Category with this name or slug already exists' },
        { status: 400 }
      )
    }

    const newCategory = await database
      .insert(categories)
      .values({
        name,
        slug,
        description: description || null,
      })
      .returning()

    return NextResponse.json(newCategory[0], { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { message: 'Error creating category' },
      { status: 500 }
    )
  }
} 