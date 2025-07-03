'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SocialShareCompact from './SocialShareCompact'
import PostsViewToggle, { PostViewType } from './PostsViewToggle'
import LikeButton from './LikeButton'
import ReadingTime from './ReadingTime'
import SaveForLater from './SaveForLater'

interface Post {
  id: number
  title: string
  slug: string
  excerpt?: string
  content: string
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
  featured?: boolean
  likeCount?: number
}

interface PostsResponse {
  posts: Post[]
  total: number
  page: number
  totalPages: number
  postsPerPage: number
}

const FALLBACK_IMAGE = 'https://placehold.co/600x400?text=No+Image';

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewType, setViewType] = useState<PostViewType>('list')
  const [baseUrl, setBaseUrl] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [postsPerPage, setPostsPerPage] = useState(10)

  useEffect(() => {
    // Set base URL for social sharing
    setBaseUrl(window.location.origin)
    
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/posts?status=published&page=${currentPage}`)
        if (response.ok) {
          const data: PostsResponse = await response.json()
          setPosts(data.posts || [])
          setTotalPages(data.totalPages)
          setTotalPosts(data.total)
          setPostsPerPage(data.postsPerPage)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-8 animate-pulse dark:bg-gray-800 dark:border-gray-700">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 dark:bg-gray-700"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>
    )
  }

  const renderPostCard = (post: Post) => {
    const postUrl = `${baseUrl}/posts/${post.slug}`
    const imageUrl = post.featuredImage || FALLBACK_IMAGE;
    
    return (
      <article key={post.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-gray-900/20">
        <Link href={`/posts/${post.slug}`} className="block focus:outline-none">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-3">
              {post.category && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full dark:bg-blue-900 dark:text-blue-200">
                  {post.category.name}
                </span>
              )}
              {post.featured && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                  Featured
                </span>
              )}
            </div>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
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
            
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors dark:text-gray-100 dark:group-hover:text-blue-400">
              {post.title}
            </h3>
            
            {post.excerpt && (
              <p className="text-gray-600 mb-4 line-clamp-3 dark:text-gray-300">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="pointer-events-auto">
                  <SocialShareCompact 
                    url={postUrl}
                    title={post.title}
                    description={post.excerpt || `Check out this post: ${post.title}`}
                  />
                </div>

                <LikeButton 
                  postId={post.id} 
                  initialLikes={post.likeCount || 0}
                  className="text-sm"
                />

                <SaveForLater 
                  postId={post.id}
                  postTitle={post.title}
                  postSlug={post.slug}
                  className="text-sm"
                />

                <div className="flex items-center space-x-2 text-blue-600 font-semibold group-hover:text-blue-700 transition-colors dark:text-blue-400 dark:group-hover:text-blue-300">
                  <span>Read more</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {post.publishedAt && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
              )}
              
              <ReadingTime content={post.content} />
            </div>
          </div>
        </Link>
      </article>
    )
  }

  const renderPostList = (post: Post) => {
    const postUrl = `${baseUrl}/posts/${post.slug}`
    const imageUrl = post.featuredImage || FALLBACK_IMAGE;
    
    return (
      <article key={post.id} className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-gray-900/20">
        <Link href={`/posts/${post.slug}`} className="block focus:outline-none">
          <div className="flex items-start space-x-6">
            <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-3">
                {post.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full dark:bg-blue-900 dark:text-blue-200">
                    {post.category.name}
                  </span>
                )}
                {post.featured && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                    Featured
                  </span>
                )}
              </div>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
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
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors dark:text-gray-100 dark:group-hover:text-blue-400">
                {post.title}
              </h3>
              
              {post.excerpt && (
                <p className="text-gray-600 mb-4 line-clamp-2 dark:text-gray-300">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="pointer-events-auto">
                    <SocialShareCompact 
                      url={postUrl}
                      title={post.title}
                      description={post.excerpt || `Check out this post: ${post.title}`}
                    />
                  </div>

                  <LikeButton 
                    postId={post.id} 
                    initialLikes={post.likeCount || 0}
                    className="text-sm"
                  />

                  <SaveForLater 
                    postId={post.id}
                    postTitle={post.title}
                    postSlug={post.slug}
                    className="text-sm"
                  />

                  <div className="flex items-center space-x-2 text-blue-600 font-semibold group-hover:text-blue-700 transition-colors dark:text-blue-400 dark:group-hover:text-blue-300">
                    <span>Read more</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                {post.publishedAt && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  const renderPostGrid = (post: Post) => {
    const postUrl = `${baseUrl}/posts/${post.slug}`
    const imageUrl = post.featuredImage || FALLBACK_IMAGE;
    
    return (
      <article key={post.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:shadow-gray-900/20">
        <Link href={`/posts/${post.slug}`} className="block focus:outline-none">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-3">
              {post.category && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full dark:bg-blue-900 dark:text-blue-200">
                  {post.category.name}
                </span>
              )}
              {post.featured && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                  Featured
                </span>
              )}
            </div>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
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
            
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 dark:text-gray-100 dark:group-hover:text-blue-400">
              {post.title}
            </h3>
            
            {post.excerpt && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-3 dark:text-gray-300">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-blue-600 font-semibold group-hover:text-blue-700 transition-colors dark:text-blue-400 dark:group-hover:text-blue-300">
                <span className="text-sm">Read more</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              <div className="flex items-center space-x-2">
                <ReadingTime content={post.content} className="text-xs" />
                
                <LikeButton 
                  postId={post.id} 
                  initialLikes={post.likeCount || 0}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </Link>
      </article>
    )
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Previous
        </button>
      )
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      )
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Next
        </button>
      )
    }

    return (
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((currentPage - 1) * postsPerPage) + 1} to {Math.min(currentPage * postsPerPage, totalPosts)} of {totalPosts} posts
          </div>
          <div className="flex items-center space-x-2">
            {pages}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {totalPosts} posts found
        </div>
        <PostsViewToggle currentView={viewType} onViewChange={setViewType} />
      </div>

      {/* Posts */}
      <div className={viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-8'}>
        {viewType === 'grid' 
          ? posts.map(renderPostGrid)
          : posts.map(renderPostList)
        }
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  )
} 