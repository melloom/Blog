'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SearchBar from './SearchBar'

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  postCount: number
}

interface Tag {
  id: number
  name: string
  slug: string
  postCount: number
}

interface RecentPost {
  id: number
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  publishedAt?: string
}

export default function Sidebar() {
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all')
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTagsLoading, setIsTagsLoading] = useState(true)

  // Fetch categories with post counts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?status=published')
        if (response.ok) {
          const data = await response.json()
          setCategories(data || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Fetch tags with post counts
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags?status=published&limit=8')
        if (response.ok) {
          const data = await response.json()
          setTags(data || [])
        }
      } catch (error) {
        console.error('Error fetching tags:', error)
      } finally {
        setIsTagsLoading(false)
      }
    }

    fetchTags()
  }, [])

  // Fetch recent posts
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await fetch('/api/posts?status=published&limit=3')
        if (response.ok) {
          const data = await response.json()
          setRecentPosts(data.posts || [])
        }
      } catch (error) {
        console.error('Error fetching recent posts:', error)
      }
    }

    fetchRecentPosts()
  }, [])

  const socialLinks = [
    { name: 'Twitter', url: 'https://twitter.com/wiredliving', icon: '🐦' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/wiredliving', icon: '💼' },
    { name: 'GitHub', url: 'https://github.com/wiredliving', icon: '💻' },
    { name: 'YouTube', url: 'https://youtube.com/@wiredliving', icon: '📺' }
  ]

  return (
    <div className="space-y-8">
      {/* About the Author */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 dark:bg-gray-900 dark:border-gray-700">
        <div className="text-center">
          {/* Author Photo */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">W</span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-100">About the Author</h3>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed dark:text-gray-300">
            Hi, I'm the creator behind WiredLiving. I write about the intersection of technology and modern living, 
            sharing insights on digital wellness, productivity, and building a better relationship with technology.
          </p>
          
          {/* Social Media Links */}
          <div className="flex justify-center space-x-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center text-sm transition-colors dark:bg-gray-800 dark:hover:bg-blue-900"
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 dark:bg-gray-900 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Search Posts</h3>
        <SearchBar placeholder="Search posts..." showResults={true} />
      </div>

      {/* Categories */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 dark:bg-gray-900 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Categories</h3>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-800 font-medium dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">({category.postCount})</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recent Posts */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 dark:bg-gray-900 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Recent Posts</h3>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <article key={post.id} className="group">
              <Link href={`/posts/${post.slug}`} className="block">
                <div className="flex items-start space-x-3">
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 dark:text-gray-100 dark:group-hover:text-blue-400">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 dark:text-gray-400">
                        {post.excerpt}
                      </p>
                    )}
                    {post.publishedAt && (
                      <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 dark:bg-gray-900 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Popular Tags</h3>
        {isTagsLoading ? (
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-16 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
            ))}
          </div>
        ) : tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-800 rounded-full text-sm transition-colors dark:bg-gray-800 dark:hover:bg-blue-900 dark:text-gray-300 dark:hover:text-blue-200"
              >
                {tag.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No tags available</p>
        )}
      </div>
    </div>
  )
} 