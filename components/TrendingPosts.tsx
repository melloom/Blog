import Link from 'next/link'
import Image from 'next/image'
import { dbNonNull as db } from '@/lib/db'
import { posts, categories, users, likes, comments } from '@/lib/db/schema'
import { eq, and, desc, sql, count } from 'drizzle-orm'
import { formatDistanceToNow } from 'date-fns'
import SocialShareCompact from './SocialShareCompact'
import LikeButton from './LikeButton'

async function getTrendingPosts() {
  try {
    const trendingPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        featuredImage: posts.featuredImage,
        publishedAt: posts.publishedAt,
        categoryName: categories.name,
        authorName: users.name,
        likeCount: count(likes.id),
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(likes, eq(posts.id, likes.postId))
      .where(eq(posts.status, 'published'))
      .groupBy(posts.id)
      .orderBy(desc(count(likes.id)), desc(posts.publishedAt))
      .limit(3)
      .all()

    return trendingPosts
  } catch (error) {
    console.error('Error fetching trending posts:', error)
    return []
  }
}

export default async function TrendingPosts() {
  const trendingPosts = await getTrendingPosts()

  if (!trendingPosts || trendingPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4 dark:text-gray-400">
          No trending posts available at the moment.
        </div>
        <p className="text-gray-400 dark:text-gray-500">
          Check back soon for popular content!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {trendingPosts.map((post) => {
        const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/posts/${post.slug}`
        const imageUrl = post.featuredImage || 'https://placehold.co/600x400?text=No+Image'
        
        return (
          <article key={post.slug} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <Link href={`/posts/${post.slug}`} className="block focus:outline-none">
              {/* Image Container */}
              <div className="relative h-48 lg:h-56 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-none"
                  priority={false}
                />
                
                {/* Category Badge */}
                {post.categoryName && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-200">
                      {post.categoryName}
                    </span>
                  </div>
                )}
                
                {/* Trending Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/90 text-white backdrop-blur-sm">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    Trending
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
                  <div className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm dark:text-blue-400 dark:hover:text-blue-300">
                    Read more
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>

                  <div className="flex items-center space-x-2">
                    <LikeButton 
                      postId={post.id} 
                      initialLikes={post.likeCount || 0}
                      className="text-sm"
                    />
                    
                    <div className="pointer-events-auto">
                      <SocialShareCompact 
                        url={postUrl}
                        title={post.title}
                        description={post.excerpt || `Check out this trending post: ${post.title}`}
                      />
                    </div>
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