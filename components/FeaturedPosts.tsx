import Link from 'next/link'
import Image from 'next/image'
import { getDb } from '@/lib/db'
import { posts, categories, users } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { formatDistanceToNow } from 'date-fns'
import SocialShareCompact from './SocialShareCompact'

async function getFeaturedPosts() {
  try {
    // Try to get the database, but handle the case where it's not available
    let db
    try {
      db = getDb()
    } catch (dbError) {
      console.warn('Database not available during build time, returning empty featured posts')
      return []
    }
    
    const featuredPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        featuredImage: posts.featuredImage,
        publishedAt: posts.publishedAt,
        categoryName: categories.name,
        authorName: users.name,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(and(eq(posts.featured, true), eq(posts.status, 'published')))
      .orderBy(desc(posts.publishedAt))
      .limit(3)
      .all()
    return featuredPosts
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

export default async function FeaturedPosts() {
  const featuredPosts = await getFeaturedPosts()

  if (!featuredPosts || featuredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4 dark:text-gray-400">
          No featured posts available at the moment.
        </div>
        <p className="text-gray-400 dark:text-gray-500">
          Check back soon for new content!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {featuredPosts.map((post) => {
        const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/posts/${post.slug}`;
        
        return (
          <article key={post.slug} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative h-48 lg:h-56 overflow-hidden">
              {post.featuredImage ? (
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-none"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">{post.title.charAt(0)}</span>
                </div>
              )}
              
              {/* Category Badge */}
              {post.categoryName && (
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-200">
                    {post.categoryName}
                  </span>
                </div>
              )}
              
              {/* Featured Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/90 text-white backdrop-blur-sm">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </span>
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Content */}
            <div className="p-5 bg-white dark:bg-gray-800">
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
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">{post.authorName.charAt(0)}</span>
                    </div>
                    <span className="font-medium">{post.authorName}</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-tight dark:text-gray-100 dark:group-hover:text-blue-400">
                {post.title}
              </h3>
              
              <p className="text-gray-600 mb-3 line-clamp-2 leading-relaxed text-sm dark:text-gray-300">
                {post.excerpt || 'No excerpt available...'}
              </p>
              
              <div className="flex items-center justify-between">
                <Link 
                  href={`/posts/${post.slug}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Read more
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>

                {/* Social Share */}
                <div className="pointer-events-auto">
                  <SocialShareCompact 
                    url={postUrl}
                    title={post.title}
                    description={post.excerpt || `Check out this featured post: ${post.title}`}
                  />
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
} 