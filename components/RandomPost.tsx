'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { dbNonNull as db } from '@/lib/db'
import { posts, categories, users } from '@/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { formatDistanceToNow } from 'date-fns'
import SocialShareCompact from './SocialShareCompact'
import LikeButton from './LikeButton'

interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  publishedAt?: string
  author?: string
  category?: {
    name: string
    slug: string
  }
  tags?: Array<{
    name: string
    slug: string
  }>
  likeCount?: number
}

interface RandomPostProps {
  initialPost?: Post
}

export default function RandomPost({ initialPost }: RandomPostProps) {
  const [post, setPost] = useState<Post | null>(initialPost || null)
  const [isLoading, setIsLoading] = useState(false)

  const getRandomPost = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/posts?status=published')
      if (response.ok) {
        const data = await response.json()
        const posts = data.posts || []
        if (posts.length > 0) {
          const randomIndex = Math.floor(Math.random() * posts.length)
          setPost(posts[randomIndex])
        }
      }
    } catch (error) {
      console.error('Error fetching random post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-gray-100">Discover Something New</h3>
        <p className="text-gray-600 mb-6 dark:text-gray-400">Click the button below to find a random post</p>
        <button
          onClick={getRandomPost}
          disabled={isLoading}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Finding...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Surprise Me!
            </>
          )}
        </button>
      </div>
    )
  }

  const postUrl = `${window.location.origin}/posts/${post.slug}`
  const imageUrl = post.featuredImage || 'https://placehold.co/600x400?text=No+Image'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <Link href={`/posts/${post.slug}`} className="block focus:outline-none">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
          />
          
          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-200">
                {post.category.name}
              </span>
            </div>
          )}
          
          {/* Random Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/90 text-white backdrop-blur-sm">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Random Pick
            </span>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
        
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
            
            {post.author && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-bold">{post.author.charAt(0)}</span>
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors dark:text-gray-100 dark:hover:text-blue-400">
            {post.title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-2 dark:text-gray-300">
            {post.excerpt || 'No excerpt available...'}
          </p>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.slug}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                >
                  #{tag.name}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-md dark:bg-gray-700 dark:text-gray-400">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors dark:text-blue-400 dark:hover:text-blue-300">
                Read more
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              
              <LikeButton 
                postId={post.id} 
                initialLikes={post.likeCount || 0}
                className="text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="pointer-events-auto">
                <SocialShareCompact 
                  url={postUrl}
                  title={post.title}
                  description={post.excerpt || `Check out this random post: ${post.title}`}
                />
              </div>
              
              <button
                onClick={getRandomPost}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
} 