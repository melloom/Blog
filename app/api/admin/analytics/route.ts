import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, categories, tags, comments, likes, postTags, users } from '@/lib/db/schema'
import { eq, desc, count, and, gte, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'

    // Calculate date range
    const now = new Date()
    let startDate: Date
    
    switch (range) {
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default: // 7d
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    // Get basic counts
    const [totalPosts, publishedPosts, draftPosts, featuredPosts, totalComments, totalLikes, totalUsers] = await Promise.all([
      db.select({ count: count() }).from(posts).all(),
      db.select({ count: count() }).from(posts).where(eq(posts.status, 'published')).all(),
      db.select({ count: count() }).from(posts).where(eq(posts.status, 'draft')).all(),
      db.select({ count: count() }).from(posts).where(eq(posts.featured, true)).all(),
      db.select({ count: count() }).from(comments).all(),
      db.select({ count: count() }).from(likes).all(),
      db.select({ count: count() }).from(users).all()
    ])

    // Get recent activity (last 24 hours)
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const [recentComments, recentLikes] = await Promise.all([
      db.select({ count: count() }).from(comments).where(gte(comments.createdAt, last24h)).all(),
      db.select({ count: count() }).from(likes).where(gte(likes.createdAt, last24h)).all()
    ])

    // Get top posts with engagement data
    const topPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        publishedAt: posts.publishedAt,
        viewCount: sql<number>`COALESCE(COUNT(DISTINCT ${comments.id}), 0) + COALESCE(COUNT(DISTINCT ${likes.id}), 0) * 2`.as('viewCount'),
        likeCount: sql<number>`COALESCE(COUNT(DISTINCT ${likes.id}), 0)`.as('likeCount'),
        commentCount: sql<number>`COALESCE(COUNT(DISTINCT ${comments.id}), 0)`.as('commentCount')
      })
      .from(posts)
      .leftJoin(comments, eq(posts.id, comments.postId))
      .leftJoin(likes, eq(posts.id, likes.postId))
      .where(eq(posts.status, 'published'))
      .groupBy(posts.id, posts.title, posts.publishedAt)
      .orderBy(desc(sql`viewCount`))
      .limit(10)
      .all()

    // Get top categories
    const topCategories = await db
      .select({
        name: categories.name,
        postCount: sql<number>`COUNT(DISTINCT ${posts.id})`.as('postCount'),
        totalViews: sql<number>`COALESCE(COUNT(DISTINCT ${comments.id}), 0) + COALESCE(COUNT(DISTINCT ${likes.id}), 0) * 2`.as('totalViews')
      })
      .from(categories)
      .leftJoin(posts, eq(categories.id, posts.categoryId))
      .leftJoin(comments, eq(posts.id, comments.postId))
      .leftJoin(likes, eq(posts.id, likes.postId))
      .groupBy(categories.id, categories.name)
      .orderBy(desc(sql`totalViews`))
      .limit(5)
      .all()

    // Get top tags
    const topTags = await db
      .select({
        name: tags.name,
        postCount: sql<number>`COUNT(DISTINCT ${posts.id})`.as('postCount')
      })
      .from(tags)
      .leftJoin(postTags, eq(tags.id, postTags.tagId))
      .leftJoin(posts, eq(postTags.postId, posts.id))
      .groupBy(tags.id, tags.name)
      .orderBy(desc(sql`postCount`))
      .limit(10)
      .all()

    // Generate mock time series data
    const generateTimeSeriesData = (baseValue: number, days: number) => {
      const data = []
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const randomFactor = 0.5 + Math.random() * 1.5 // Random factor between 0.5 and 2.0
        data.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(baseValue * randomFactor / days)
        })
      }
      return data
    }

    const daysInRange = Math.ceil((now.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
    const viewsByDay = generateTimeSeriesData(totalComments[0]?.count || 0, daysInRange)
    const likesByDay = generateTimeSeriesData(totalLikes[0]?.count || 0, daysInRange)
    const commentsByDay = generateTimeSeriesData(totalComments[0]?.count || 0, daysInRange)

    // Mock user engagement data
    const userEngagement = {
      averageTimeOnSite: '2m 34s',
      bounceRate: 45,
      returnVisitors: 35,
      newVisitors: 65
    }

    const analyticsData = {
      totalPosts: totalPosts[0]?.count || 0,
      totalViews: (totalComments[0]?.count || 0) + (totalLikes[0]?.count || 0) * 2, // Mock view calculation
      totalLikes: totalLikes[0]?.count || 0,
      totalComments: totalComments[0]?.count || 0,
      totalUsers: totalUsers[0]?.count || 0,
      publishedPosts: publishedPosts[0]?.count || 0,
      draftPosts: draftPosts[0]?.count || 0,
      featuredPosts: featuredPosts[0]?.count || 0,
      recentViews: recentComments[0]?.count || 0,
      recentLikes: recentLikes[0]?.count || 0,
      recentComments: recentComments[0]?.count || 0,
      topPosts: topPosts.map(post => ({
        id: post.id,
        title: post.title,
        views: post.viewCount,
        likes: post.likeCount,
        comments: post.commentCount,
        publishedAt: post.publishedAt?.toISOString() || new Date().toISOString()
      })),
      viewsByDay: viewsByDay.map(day => ({ date: day.date, views: day.value })),
      likesByDay: likesByDay.map(day => ({ date: day.date, likes: day.value })),
      commentsByDay: commentsByDay.map(day => ({ date: day.date, comments: day.value })),
      topCategories: topCategories.map(cat => ({
        name: cat.name,
        postCount: cat.postCount,
        totalViews: cat.totalViews
      })),
      topTags: topTags.map(tag => ({
        name: tag.name,
        postCount: tag.postCount
      })),
      userEngagement
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 