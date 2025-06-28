import Link from 'next/link'
import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FeaturedPosts from '@/components/FeaturedPosts'
import RecentPosts from '@/components/RecentPosts'
import TrendingPosts from '@/components/TrendingPosts'
import RandomPost from '@/components/RandomPost'
import NewsletterSignup from '@/components/NewsletterSignup'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 lg:py-32 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob dark:bg-blue-800 dark:opacity-10"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 dark:bg-purple-800 dark:opacity-10"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 dark:bg-indigo-800 dark:opacity-10"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-8 dark:bg-blue-900 dark:text-blue-200">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse dark:bg-blue-400"></span>
              Exploring the future of digital living
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight dark:text-gray-100">
              Wired
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Living</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed dark:text-gray-300">
              Where technology meets lifestyle. Discover insights, tutorials, and thoughtful perspectives on building a better digital life in our connected world.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center space-x-8 mb-12 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Fresh insights weekly</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Practical advice</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Community driven</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/posts" 
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
              >
                <span className="flex items-center space-x-2">
                  <span>Explore Posts</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link 
                href="/about" 
                className="group border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-lg hover:bg-blue-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-400 dark:hover:bg-gray-800"
              >
                <span className="flex items-center space-x-2">
                  <span>About Me</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </Link>
            </div>
            
            {/* Scroll indicator */}
            <div className="mt-16 animate-bounce">
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center dark:border-gray-500">
                <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse dark:bg-gray-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">Featured Posts</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Latest insights and thoughts</p>
          </div>
          
          <Suspense fallback={
            <div className="text-center py-12">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto dark:bg-gray-700"></div>
              </div>
            </div>
          }>
            <FeaturedPosts />
          </Suspense>
        </div>
      </section>

      {/* Trending Posts */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">Trending Posts</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Latest insights and thoughts</p>
          </div>
          
          <Suspense fallback={
            <div className="text-center py-12">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto dark:bg-gray-700"></div>
              </div>
            </div>
          }>
            <TrendingPosts />
          </Suspense>
        </div>
      </section>

      {/* Random Post */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">Random Post</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Latest insights and thoughts</p>
          </div>
          
          <Suspense fallback={
            <div className="text-center py-12">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto dark:bg-gray-700"></div>
              </div>
            </div>
          }>
            <RandomPost />
          </Suspense>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 dark:text-gray-100">Recent Blog Posts</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Latest insights and thoughts on technology and modern living</p>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse dark:bg-gray-800 dark:border-gray-700">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3 dark:bg-gray-700"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 dark:bg-gray-700"></div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <RecentPosts />
          </Suspense>
          
          <div className="text-center mt-12">
            <Link 
              href="/posts" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              View All Posts
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>

      <Footer />
    </div>
  )
} 