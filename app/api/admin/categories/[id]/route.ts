import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { categories, posts } from '@/lib/db/schema'
import { eq, sql, and, ne } from 'drizzle-orm'

// PUT /api/admin/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if we're in build time
    if (process.env.NODE_ENV === 'production' && !process.env.TURSO_DATABASE_URL) {
      return NextResponse.json({ error: 'Service unavailable during build' }, { status: 503 });
    }

    const database = getDb();

    const { name, slug, description } = await request.json()
    const categoryId = parseInt(params.id)

    if (!name || !slug) {
      return NextResponse.json(
        { message: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if category with same name or slug already exists (excluding current category)
    const existingCategory = await database
      .select()
      .from(categories)
      .where(
        and(
          sql`(${categories.name} = ${name} OR ${categories.slug} = ${slug})`,
          ne(categories.id, categoryId)
        )
      )
      .limit(1)

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { message: 'Category with this name or slug already exists' },
        { status: 400 }
      )
    }

    const updatedCategory = await database
      .update(categories)
      .set({
        name,
        slug,
        description: description || null,
      })
      .where(eq(categories.id, categoryId))
      .returning()

    if (updatedCategory.length === 0) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedCategory[0])
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { message: 'Error updating category' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/categories/[id] - Delete a category
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

    const categoryId = parseInt(params.id)

    // Check if category has any posts
    const postsInCategory = await database
      .select({ count: sql<number>`COUNT(*)` })
      .from(posts)
      .where(eq(posts.categoryId, categoryId))

    if (postsInCategory[0].count > 0) {
      return NextResponse.json(
        { message: 'Cannot delete category that has posts. Please reassign or delete the posts first.' },
        { status: 400 }
      )
    }

    const deletedCategory = await database
      .delete(categories)
      .where(eq(categories.id, categoryId))
      .returning()

    if (deletedCategory.length === 0) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { message: 'Error deleting category' },
      { status: 500 }
    )
  }
} 