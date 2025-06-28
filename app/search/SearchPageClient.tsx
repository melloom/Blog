'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import SearchBar from '@/components/SearchBar'

interface SearchResult {
  id: number
  title?: string
  name?: string
  slug: string
  excerpt?: string
  description?: string
  featuredImage?: string
  categoryName?: string
  type: 'post' | 'category' | 'tag'
  relevance: number
  publishedAt?: string
  createdAt?: string
}

interface SearchResponse {
  results: SearchResult[]
  total: number
  page: number
  totalPages: number
  query: string
  type: string
}

export default function SearchPageClient() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [searchType, setSearchType] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Perform search when query or filters change
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setTotalResults(0)
      return
    }

    const performSearch = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          q: query,
          type: searchType,
          page: currentPage.toString(),
          limit: '20'
        })

        const response = await fetch(`/api/search?${params}`)
        if (response.ok) {
          const data: SearchResponse = await response.json()
          setResults(data.results)
          setTotalResults(data.total)
          setTotalPages(data.totalPages)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [query, searchType, currentPage])

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'post':
        return '📄'
      case 'category':
        return '📁'
      case 'tag':
        return '🏷️'
      default:
        return '🔍'
    }
  }

  const getResultUrl = (result: SearchResult) => {
    switch (result.type) {
      case 'post':
        return `/posts/${result.slug}`
      case 'category':
        return `/posts?category=${result.slug}`
      case 'tag':
        return `/posts?tag=${result.slug}`
      default:
        return '#'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const highlightQuery = (text: string, query: string) => {
    if (!query.trim()) return text
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Search Results
            </h1>
            <div className="max-w-2xl mx-auto">
              <SearchBar
                placeholder="Search posts, categories, tags..."
                onSearch={handleSearch}
                showResults={false}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {query.trim().length < 2 ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No search query</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter a search term to find posts, categories, and tags.
            </p>
          </div>
        ) : (
          <>
            {/* Filters and Results Summary */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    <FunnelIcon className="h-4 w-4" />
                    <span>Filters</span>
                  </button>
                  {showFilters && (
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    >
                      <option value="all">All Types</option>
                      <option value="posts">Posts Only</option>
                      <option value="categories">Categories Only</option>
                      <option value="tags">Tags Only</option>
                    </select>
                  )}
                </div>
                {totalResults > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                  </p>
                )}
              </div>
            </div>
            {/* Results */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {results.map((result) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <span className="text-2xl mt-1">{getResultIcon(result.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <Link
                            href={getResultUrl(result)}
                            className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <span dangerouslySetInnerHTML={{ 
                              __html: highlightQuery(result.title || result.name || '', query) 
                            }} />
                          </Link>
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full capitalize">
                            {result.type}
                          </span>
                        </div>
                        {(result.excerpt || result.description) && (
                          <p 
                            className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-3"
                            dangerouslySetInnerHTML={{ 
                              __html: highlightQuery(result.excerpt || result.description || '', query) 
                            }}
                          />
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
                          {result.categoryName && (
                            <span>in {result.categoryName}</span>
                          )}
                          {result.publishedAt && (
                            <span>{formatDate(result.publishedAt)}</span>
                          )}
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {result.relevance}% match
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No results found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  No results found for "{query}". Try different keywords or check your spelling.
                </p>
              </div>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
} 