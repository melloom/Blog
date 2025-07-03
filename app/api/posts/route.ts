import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { posts, categories, tags, postTags, users, likes, settings } from '@/lib/db/schema'
import { eq, desc, count, inArray } from 'drizzle-orm'
import { getSettings } from '@/lib/settings'

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
  try {
    // Check if we're in build time
    if (process.env.NODE_ENV === 'production' && !process.env.TURSO_DATABASE_URL) {
      return NextResponse.json({
        posts: [],
        total: 0,
        page: 1,
        totalPages: 0,
        postsPerPage: 10,
      }, { status: 200 });
    }

    const database = getDb();

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')
    
    // Get settings for default posts per page
    const blogSettings = await getSettings()
    const defaultLimit = blogSettings.postsPerPage
    
    // Use provided limit or default from settings
    const postsLimit = limit ? parseInt(limit, 10) : defaultLimit
    const pageNum = page ? parseInt(page, 10) : 1
    const offset = (pageNum - 1) * postsLimit
    
    let allPosts
    if (status) {
      allPosts = await database
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          content: posts.content,
          featuredImage: posts.featuredImage,
          status: posts.status,
          publishedAt: posts.publishedAt,
          createdAt: posts.createdAt,
          featured: posts.featured,
          categoryName: categories.name,
          categorySlug: categories.slug,
          authorName: users.name,
        })
        .from(posts)
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(eq(posts.status, status as 'draft' | 'published' | 'archived'))
        .orderBy(desc(posts.publishedAt || posts.createdAt))
        .limit(postsLimit)
        .offset(offset)
        .all()
    } else {
      allPosts = await database
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          content: posts.content,
          featuredImage: posts.featuredImage,
          status: posts.status,
          publishedAt: posts.publishedAt,
          createdAt: posts.createdAt,
          featured: posts.featured,
          categoryName: categories.name,
          categorySlug: categories.slug,
          authorName: users.name,
        })
        .from(posts)
        .leftJoin(categories, eq(posts.categoryId, categories.id))
        .leftJoin(users, eq(posts.authorId, users.id))
        .orderBy(desc(posts.publishedAt || posts.createdAt))
        .limit(postsLimit)
        .offset(offset)
        .all()
    }
    
    // Get total count for pagination
    let totalCount
    if (status) {
      const countResult = await database
        .select({ count: count() })
        .from(posts)
        .where(eq(posts.status, status as 'draft' | 'published' | 'archived'))
        .get()
      totalCount = countResult?.count || 0
    } else {
      const countResult = await database
        .select({ count: count() })
        .from(posts)
        .get()
      totalCount = countResult?.count || 0
    }
    
    // Get tags for each post
    const postIds = allPosts.map(post => post.id)
    const postTagsData = await database
      .select({
        postId: postTags.postId,
        tagName: tags.name,
        tagSlug: tags.slug,
      })
      .from(postTags)
      .leftJoin(tags, eq(postTags.tagId, tags.id))
      .where(inArray(postTags.postId, postIds))
      .all()
    
    // Get like counts for each post
    const likeCounts = await database
      .select({
        postId: likes.postId,
        count: count(),
      })
      .from(likes)
      .where(inArray(likes.postId, postIds))
      .groupBy(likes.postId)
      .all()
    
    // Transform the data to match the expected format
    const transformedPosts = allPosts.map(post => {
      const postTags = postTagsData.filter(pt => pt.postId === post.id)
      const likeCount = likeCounts.find(lc => lc.postId === post.id)?.count || 0
      
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage,
        status: post.status,
        publishedAt: post.publishedAt,
        author: post.authorName,
        category: post.categoryName ? {
          name: post.categoryName,
          slug: post.categorySlug
        } : undefined,
        featured: post.featured,
        tags: postTags.map(pt => ({
          name: pt.tagName,
          slug: pt.tagSlug
        })),
        likeCount: likeCount,
      }
    })
    
    return NextResponse.json({
      posts: transformedPosts,
      total: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / postsLimit),
      postsPerPage: postsLimit,
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    // Check if we're in build time
    if (process.env.NODE_ENV === 'production' && !process.env.TURSO_DATABASE_URL) {
      return NextResponse.json({ error: 'Service unavailable during build' }, { status: 503 });
    }

    const database = getDb();

    const body = await request.json()
    const { 
      title, 
      content, 
      excerpt, 
      featuredImage, 
      status, 
      category, 
      tags: tagNames,
      template 
    } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // TODO: Get author ID from authenticated user
    const authorId = 1 // Temporary hardcoded value

    // For drafts, skip complex operations to make it faster
    const isDraft = status === 'draft'
    
    // Handle category (only for published posts or if category is provided)
    let categoryId = null
    if (category && !isDraft) {
      try {
        const existingCategory = await database.select().from(categories).where(eq(categories.name, category)).get()
        if (existingCategory) {
          categoryId = existingCategory.id
        } else {
          const newCategory = await database.insert(categories).values({
            name: category,
            slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: `${category} category`
          }).returning()
          categoryId = newCategory[0].id
        }
      } catch (catErr) {
        console.error('Category error:', catErr)
        // For drafts, don't fail on category errors
        if (!isDraft) {
        return NextResponse.json({ error: 'Category error', details: catErr instanceof Error ? catErr.message : catErr }, { status: 500 })
        }
      }
    }

    // Create the post
    let newPost
    try {
      newPost = await database.insert(posts).values({
        title,
        content,
        excerpt: excerpt || null,
        featuredImage: featuredImage || null,
        template: template || 'default',
        status: status || 'draft',
        authorId,
        categoryId,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        publishedAt: status === 'published' ? new Date() : null,
      }).returning()
    } catch (postErr) {
      console.error('Post insert error:', postErr)
      return NextResponse.json({ error: 'Post insert error', details: postErr instanceof Error ? postErr.message : postErr }, { status: 500 })
    }

    const postId = newPost[0].id

    // Handle tags (only for published posts to speed up drafts)
    if (tagNames && typeof tagNames === 'string' && !isDraft) {
      const tagArray = tagNames.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
      
      // Process tags in parallel for better performance
      const tagPromises = tagArray.map(async (tagName) => {
        try {
          let existingTag = await database.select().from(tags).where(eq(tags.name, tagName)).get()
          if (!existingTag) {
            const newTag = await database.insert(tags).values({
              name: tagName,
              slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            }).returning()
            existingTag = newTag[0]
          }
          return existingTag.id
        } catch (tagErr) {
          console.error('Tag error:', tagErr)
          return null
        }
      })

      const tagIds = await Promise.all(tagPromises)
      const validTagIds = tagIds.filter(id => id !== null)

      // Insert post-tag relationships in batch
      if (validTagIds.length > 0) {
        try {
          await database.insert(postTags).values(
            validTagIds.map(tagId => ({ postId, tagId }))
          )
        } catch (relErr) {
          console.error('Post-tag relationship error:', relErr)
        }
      }
    }

    // Set publishedAt if status is published and not already set
    if (status === 'published' && !newPost[0].publishedAt) {
      try {
        await database.update(posts)
          .set({ publishedAt: new Date() })
          .where(eq(posts.id, postId))
      } catch (pubErr) {
        console.error('PublishedAt error:', pubErr)
        return NextResponse.json({ error: 'PublishedAt error', details: pubErr instanceof Error ? pubErr.message : pubErr }, { status: 500 })
      }
    }

    return NextResponse.json({
      message: status === 'published' ? 'Post published successfully' : 'Draft saved successfully',
      post: newPost[0],
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post', details: error instanceof Error ? error.message : error },
      { status: 500 }
    )
  }
}

// PATCH /api/posts/:id - Update a post (including featured status)
export async function PATCH(request: NextRequest) {
  try {
    // Check if we're in build time
    if (process.env.NODE_ENV === 'production' && !process.env.TURSO_DATABASE_URL) {
      return NextResponse.json({ error: 'Service unavailable during build' }, { status: 503 });
    }

    const database = getDb();

    const { id, featured } = await request.json()
    if (typeof id !== 'number') {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
    }
    if (typeof featured !== 'boolean') {
      return NextResponse.json({ error: 'Featured must be a boolean' }, { status: 400 })
    }

    // If setting to featured, check how many are already featured
    if (featured) {
      const featuredCount = await database.select().from(posts).where(eq(posts.featured, true)).all()
      if (featuredCount.length >= 3) {
        return NextResponse.json({ error: 'Maximum 3 featured posts allowed' }, { status: 400 })
      }
    }

    // Update the post
    await database.update(posts).set({ featured }).where(eq(posts.id, id))
    return NextResponse.json({ message: 'Post updated' })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 