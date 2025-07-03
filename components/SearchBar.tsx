'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import ErrorBoundary from './ErrorBoundary'

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
}

interface SearchResponse {
  results: SearchResult[]
  total: number
  page: number
  totalPages: number
  query: string
}

function SearchBarContent({ 
  placeholder = "Search posts, categories, tags...",
  className = "",
  showResults = true,
  onSearch = null
}: {
  placeholder?: string
  className?: string
  showResults?: boolean
  onSearch?: ((query: string) => void) | null
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [totalResults, setTotalResults] = useState(0)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { trackSearch } = useAnalytics()

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([])
      setTotalResults(0)
      setShowDropdown(false)
      return
    }

    const performSearch = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=10`)
        if (response.ok) {
          const data: SearchResponse = await response.json()
          setResults(data.results)
          setTotalResults(data.total)
          setShowDropdown(true)
          setSelectedIndex(-1)
          
          // Track search analytics
          trackSearch(debouncedQuery)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery, trackSearch])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showDropdown || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => prev < results.length - 1 ? prev + 1 : prev)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex])
        } else if (query.trim()) {
          handleSearchSubmit()
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }, [showDropdown, results, selectedIndex, query])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResultClick = (result: SearchResult) => {
    setShowDropdown(false)
    setSelectedIndex(-1)
    setQuery('')
    
    // Navigate based on result type
    switch (result.type) {
      case 'post':
        router.push(`/posts/${result.slug}`)
        break
      case 'category':
        router.push(`/posts?category=${result.slug}`)
        break
      case 'tag':
        router.push(`/posts?tag=${result.slug}`)
        break
    }
  }

  const handleSearchSubmit = () => {
    if (query.trim()) {
      setShowDropdown(false)
      if (onSearch) {
        onSearch(query.trim())
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setShowDropdown(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
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

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit() }} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {showResults && showDropdown && (query.trim().length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto scrollbar-thin">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                </p>
              </div>
              <div className="py-2">
                {results.map((result, index) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg mt-0.5">{getResultIcon(result.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {result.title || result.name}
                          </h4>
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full capitalize">
                            {result.type}
                          </span>
                        </div>
                        {(result.excerpt || result.description) && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {result.excerpt || result.description}
                          </p>
                        )}
                        {result.categoryName && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            in {result.categoryName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {totalResults > results.length && (
                <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    onClick={() => setShowDropdown(false)}
                  >
                    View all {totalResults} results →
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try different keywords or check your spelling</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchBar(props: {
  placeholder?: string
  className?: string
  showResults?: boolean
  onSearch?: ((query: string) => void) | null
}) {
  return (
    <ErrorBoundary>
      <SearchBarContent {...props} />
    </ErrorBoundary>
  )
} 