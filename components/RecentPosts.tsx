import Link from 'next/link'
import Image from 'next/image'
import { getDb } from '@/lib/db'
import { posts, categories, users } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { formatDistanceToNow } from 'date-fns'
import SocialShareCompact from './SocialShareCompact'

async function getRecentPosts() {
  try {
    // Try to get the database, but handle the case where it's not available
    let db
    try {
      db = getDb()
    } catch (dbError) {
      console.warn('Database not available during build time, returning empty recent posts')
      return []
    }
    
    const recentPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        featuredImage: posts.featuredImage,
        publishedAt: posts.publishedAt,
        createdAt: posts.createdAt,
        categoryName: categories.name,
        authorName: users.name,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.status, 'published'))
      .orderBy(desc(posts.publishedAt || posts.createdAt))
      .limit(3)
      .all();

    return recentPosts;
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return [];
  }
}

export default async function RecentPosts() {
  const recentPosts = await getRecentPosts();

  if (recentPosts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-gray-700">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-gray-100">No recent posts available</h3>
        <p className="text-gray-600 dark:text-gray-400">Check back soon for new content!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recentPosts.map((post) => {
        const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/posts/${post.slug}`;
        
        return (
          <article key={post.slug} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
            <Link href={`/posts/${post.slug}`} className="block focus:outline-none">
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-none"
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">{post.title.charAt(0)}</span>
                  </div>
                )}
                
                {/* Category Badge */}
                {post.categoryName && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-200">
                      {post.categoryName}
                    </span>
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <time 
                    dateTime={new Date(post.publishedAt || Date.now()).toISOString()}
                    className="text-sm text-gray-500 dark:text-gray-400 flex items-center font-medium"
                  >
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDistanceToNow(new Date(post.publishedAt || Date.now()), { addSuffix: true })}
                  </time>
                  
                  {post.authorName && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-bold">{post.authorName.charAt(0)}</span>
                      </div>
                      <span className="font-medium">{post.authorName}</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-tight dark:text-gray-100 dark:group-hover:text-blue-400">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed dark:text-gray-300">
                  {post.excerpt || 'No excerpt available...'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors dark:text-blue-400 dark:hover:text-blue-300">
                    Read more
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>

                  {/* Social Share */}
                  <div className="pointer-events-auto">
                    <SocialShareCompact 
                      url={postUrl}
                      title={post.title}
                      description={post.excerpt || `Check out this recent post: ${post.title}`}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </article>
        )
      })}
    </div>
  )
} 