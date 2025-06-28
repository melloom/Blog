import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PostsList from '@/components/PostsList'
import Sidebar from '@/components/Sidebar'

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-20 lg:py-32 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:bg-white/5"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:bg-purple-400/10"></div>
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 dark:bg-pink-400/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-8 dark:bg-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Explore our latest insights
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Blog
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300"> Posts</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed dark:text-blue-200">
              Discover insights, tutorials, and thoughtful perspectives on technology and modern living. 
              From practical advice to deep dives into emerging trends.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center space-x-8 mb-12 text-sm text-blue-200 dark:text-blue-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Fresh content weekly</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Expert insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Community driven</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        {/* Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden dark:bg-gray-800/80 dark:border-gray-700/20">
          {/* Filter and Posts */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
            {/* Sidebar */}
            <div className="lg:col-span-1 bg-gradient-to-b from-gray-50 to-gray-100 p-8 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700">
              <div className="sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center dark:text-gray-100">
                  <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Browse & Filter
                </h3>
                <Sidebar />
              </div>
            </div>

            {/* Posts List */}
            <div className="lg:col-span-3 p-8 lg:p-12 bg-white dark:bg-gray-800">
              {/* Header Section */}
              <div className="mb-12">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">All Posts</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Latest articles and insights</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                  Discover our latest articles and insights on technology, digital wellness, and modern living. 
                  From practical tips to deep dives into emerging trends.
                </p>
                
                {/* Quick Stats */}
                <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fresh content weekly</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Expert insights</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Community driven</span>
                  </div>
                </div>
              </div>
              
              <Suspense fallback={
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
              }>
                <PostsList />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16 lg:py-24 dark:from-blue-800 dark:to-indigo-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-blue-100 mb-8 dark:text-blue-200">
            Get the latest posts and insights delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            />
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 