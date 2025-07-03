'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  postCount: number
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?status=published')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Categories</h3>
        <div className="space-y-2">
          <div className="animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-xl mb-2 dark:bg-gray-700"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-gray-700">
          <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-gray-100">No categories yet</h3>
        <p className="text-gray-600 dark:text-gray-300">Categories will appear here once created</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Categories</h3>
      <div className="space-y-2">
        <Link
          href="/posts"
          className={`block w-full text-left px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
            pathname === '/posts'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          All Categories
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/posts?category=${category.slug}`}
            className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
              pathname.includes(`category=${category.slug}`)
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{category.name}</span>
              <span className="text-sm opacity-75">({category.postCount})</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 