import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative mx-auto w-64 h-64 lg:w-80 lg:h-80">
              {/* Background Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full dark:from-blue-900 dark:to-indigo-900"></div>
              
              {/* 404 Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-8xl lg:text-9xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                    404
                  </h1>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-8 left-8 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute top-16 right-12 w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute bottom-12 left-16 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          {/* Main Content */}
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 dark:text-gray-100">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto dark:text-gray-300">
            Oops! The page you're looking for seems to have wandered off into the digital wilderness. 
            Don't worry, let's help you find your way back.
          </p>

          {/* Search Section */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-gray-100">
              Search for what you're looking for
            </h3>
            <div className="max-w-md mx-auto">
              <SearchBar placeholder="Search posts, topics, or keywords..." showResults={true} />
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link 
              href="/"
              className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-500"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors dark:bg-blue-900 dark:group-hover:bg-blue-800">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">Home</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Back to the homepage</p>
            </Link>

            <Link 
              href="/posts"
              className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-500"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors dark:bg-green-900 dark:group-hover:bg-green-800">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">All Posts</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Browse all articles</p>
            </Link>

            <Link 
              href="/about"
              className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-500"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors dark:bg-purple-900 dark:group-hover:bg-purple-800">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">About</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Learn more about us</p>
            </Link>

            <Link 
              href="/contact"
              className="group p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-500"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors dark:bg-orange-900 dark:group-hover:bg-orange-800">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">Contact</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get in touch</p>
            </Link>
          </div>

          {/* Error Details */}
          <div className="bg-gray-100 rounded-xl p-6 max-w-2xl mx-auto dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 dark:text-gray-100">
              What might have happened?
            </h3>
            <ul className="text-left text-gray-600 space-y-2 dark:text-gray-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                The page may have been moved or deleted
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                You might have typed the wrong URL
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                The link you followed might be outdated
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 