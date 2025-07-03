'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'
import SearchBar from './SearchBar'
import { useSettings } from '@/lib/hooks/useSettings'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const { settings } = useSettings()

  // Keyboard shortcut for admin access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + A to go to admin
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        if (session) {
          router.push('/admin')
        } else {
          router.push('/admin/login')
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [session, router])

  // Extract site name from title
  const siteName = 'Wired Living'

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-900/90 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{siteName.charAt(0)}</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{siteName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/posts" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group dark:text-gray-300 dark:hover:text-blue-400">
              Posts
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full dark:bg-blue-400"></span>
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group dark:text-gray-300 dark:hover:text-blue-400">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full dark:bg-blue-400"></span>
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium relative group dark:text-gray-300 dark:hover:text-blue-400">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full dark:bg-blue-400"></span>
            </Link>
            <ThemeToggle />
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <SearchBar placeholder="Search posts..." />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
            {/* Mobile Search */}
            <div className="mb-4">
              <SearchBar placeholder="Search posts..." />
            </div>

            {/* Mobile Navigation Links */}
            <nav className="space-y-2">
              <Link
                href="/posts"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Posts
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 