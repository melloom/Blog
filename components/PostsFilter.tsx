'use client'

import { useState } from 'react'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import SearchBar from './SearchBar'

export default function PostsFilter() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { trackSearch } = useAnalytics()

  const categories = [
    { id: 'all', name: 'All Posts', count: 5 },
    { id: 'digital-wellness', name: 'Digital Wellness', count: 2 },
    { id: 'productivity', name: 'Productivity', count: 1 },
    { id: 'lifestyle', name: 'Lifestyle', count: 1 },
    { id: 'technology', name: 'Technology', count: 1 }
  ]

  const handleSearch = (query: string) => {
    // Track search analytics
    if (query.trim()) {
      trackSearch(query.trim())
    }
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
          Search Posts
        </label>
        <SearchBar
          placeholder="Search posts..."
          onSearch={handleSearch}
          showResults={true}
        />
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Categories</h3>
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
                <span className="text-sm text-gray-500 dark:text-gray-400">({category.count})</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Recent Posts</h3>
        <div className="space-y-3">
          {[
            { title: 'Digital Detox: A Complete Guide', date: '2024-01-15' },
            { title: '10 Productivity Hacks That Actually Work', date: '2024-01-10' },
            { title: 'The Future of Remote Work', date: '2024-01-05' }
          ].map((post, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{post.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {['Technology', 'Productivity', 'Digital Wellness', 'Remote Work', 'AI', 'Mental Health'].map((tag) => (
            <button
              key={tag}
              className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-800 rounded-full text-sm transition-colors dark:bg-gray-800 dark:hover:bg-blue-900 dark:text-gray-300 dark:hover:text-blue-200"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 