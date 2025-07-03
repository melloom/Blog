import Link from 'next/link'
import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FeaturedPosts from '@/components/FeaturedPosts'
import RecentPosts from '@/components/RecentPosts'
import TrendingPosts from '@/components/TrendingPosts'
import RandomPost from '@/components/RandomPost'
import NewsletterSignup from '@/components/NewsletterSignup'
import Sidebar from '@/components/Sidebar'
import PostsFilter from '@/components/PostsFilter'
import PostsList from '@/components/PostsList'
import PostsViewToggle from '@/components/PostsViewToggle'
import CategoryList from '@/components/CategoryList'
import { getSettings } from '@/lib/settings'

export default async function HomePage() {
  const settings = await getSettings()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating Icons */}
        <div className="absolute top-20 left-10 text-blue-400/20 text-4xl animate-float">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div className="absolute top-40 right-20 text-purple-400/20 text-4xl animate-float animation-delay-2000">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div className="absolute bottom-40 left-20 text-indigo-400/20 text-4xl animate-float animation-delay-4000">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/4 text-pink-400/20 text-4xl animate-float animation-delay-1000">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/3 right-1/4 w-32 h-32 border-2 border-blue-200/30 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 border-2 border-purple-200/30 rotate-45 animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-16 h-16 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full animate-bounce-slow"></div>
      </div>

      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Gradient Mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-20 animate-pulse animation-delay-4000"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          {/* Sparkle Effects */}
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-twinkle"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-twinkle animation-delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-twinkle animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-white/20 text-blue-800 text-sm font-semibold rounded-full mb-8 shadow-lg dark:bg-gray-800/80 dark:border-gray-700/20 dark:text-blue-200 animate-fade-in-up hover:scale-105 transition-transform cursor-pointer">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span>🚀 Exploring the future of digital living</span>
                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>
            
            {/* Main Heading with Enhanced Typography */}
            <h1 className="text-6xl lg:text-8xl font-black text-gray-900 mb-8 leading-none dark:text-gray-100 animate-fade-in-up animation-delay-200">
              <span className="block flex items-center justify-center">
                <svg className="w-16 h-16 lg:w-20 lg:h-20 text-blue-600 mr-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                Wired
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 animate-gradient flex items-center justify-center">
                Living
                <svg className="w-16 h-16 lg:w-20 lg:h-20 text-purple-600 ml-4 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </span>
            </h1>
            
            {/* Enhanced Subtitle */}
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed dark:text-gray-300 animate-fade-in-up animation-delay-400">
              {settings.siteDescription || "Discover the intersection of technology and modern lifestyle. Your guide to digital transformation, productivity hacks, and the future of connected living."}
            </p>
            
            {/* Enhanced Stats with Icons */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-16 text-sm text-gray-600 dark:text-gray-400 animate-fade-in-up animation-delay-600">
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 dark:bg-gray-800/60 dark:border-gray-700/20 hover:scale-105 transition-transform cursor-pointer">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="font-medium">Fresh insights weekly</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 dark:bg-gray-800/60 dark:border-gray-700/20 hover:scale-105 transition-transform cursor-pointer">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="font-medium">Practical advice</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 dark:bg-gray-800/60 dark:border-gray-700/20 hover:scale-105 transition-transform cursor-pointer">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <span className="font-medium">Community driven</span>
              </div>
            </div>
            
            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up animation-delay-800">
              <Link 
                href="/posts" 
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-5 px-10 rounded-2xl transition-all duration-300 text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative flex items-center space-x-3">
                  <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                  <span>Explore Posts</span>
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link 
                href="/about" 
                className="group bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-bold py-5 px-10 rounded-2xl transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 dark:bg-gray-800/80 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
              >
                <span className="flex items-center space-x-3">
                  <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>About Me</span>
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
            
            {/* Enhanced Scroll Indicator */}
            <div className="mt-20 animate-bounce">
              <div className="w-8 h-14 border-2 border-gray-400 rounded-full flex justify-center dark:border-gray-500">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mt-3 animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-500 mt-2 animate-pulse">Scroll to explore</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts with Enhanced Design */}
      <section className="py-20 lg:py-32 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 relative">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-blue-400/20 text-3xl animate-float">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div className="absolute bottom-10 right-10 text-purple-400/20 text-3xl animate-float animation-delay-2000">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4 dark:bg-blue-900 dark:text-blue-200 hover:scale-105 transition-transform cursor-pointer">
              <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              ✨ Featured Content
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 dark:text-gray-100">
              Must-Read
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"> Articles</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Curated insights and thought-provoking content that will transform your digital lifestyle
            </p>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl overflow-hidden animate-pulse dark:bg-gray-800/80 dark:border-gray-700">
                  <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600"></div>
                  <div className="p-8">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 dark:bg-gray-700"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2 dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 dark:bg-gray-700"></div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <FeaturedPosts />
          </Suspense>
        </div>
      </section>

      {/* Trending Posts with Enhanced Design */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 relative">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 text-purple-400/20 text-3xl animate-float">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
        <div className="absolute bottom-20 left-20 text-pink-400/20 text-3xl animate-float animation-delay-3000">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 text-sm font-medium rounded-full mb-4 dark:bg-purple-900 dark:text-purple-200 hover:scale-105 transition-transform cursor-pointer">
              <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              🔥 Trending Now
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 dark:text-gray-100">
              What's
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400"> Hot</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The most popular and engaging content our community is talking about
            </p>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl overflow-hidden animate-pulse dark:bg-gray-800/80 dark:border-gray-700">
                  <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-gray-600"></div>
                  <div className="p-6">
                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-3 dark:bg-gray-700"></div>
                    <div className="h-6 bg-gray-200 rounded w-4/5 mb-3 dark:bg-gray-700"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2 dark:bg-gray-700"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 dark:bg-gray-700"></div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <TrendingPosts />
          </Suspense>
        </div>
      </section>

      {/* Random Post with Enhanced Design */}
      <section className="py-20 lg:py-32 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 relative">
        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-10 text-indigo-400/20 text-3xl animate-float">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div className="absolute bottom-1/2 right-10 text-blue-400/20 text-3xl animate-float animation-delay-2000">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full mb-4 dark:bg-indigo-900 dark:text-indigo-200 hover:scale-105 transition-transform cursor-pointer">
              <svg className="w-4 h-4 mr-2 animate-spin-slow" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              🎲 Surprise Me
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 dark:text-gray-100">
              Discover
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400"> Something New</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Let us surprise you with a random gem from our collection
            </p>
          </div>
          
          <Suspense fallback={
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl overflow-hidden animate-pulse dark:bg-gray-800/80 dark:border-gray-700">
              <div className="h-64 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-gray-700 dark:to-gray-600"></div>
              <div className="p-8">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 dark:bg-gray-700"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 dark:bg-gray-700"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 dark:bg-gray-700"></div>
              </div>
            </div>
          }>
            <RandomPost />
          </Suspense>
        </div>
      </section>

      {/* Recent Blog Posts with Enhanced Design */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 relative">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 text-blue-400/20 text-3xl animate-float">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
        </div>
        <div className="absolute bottom-10 left-10 text-indigo-400/20 text-3xl animate-float animation-delay-3000">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4 dark:bg-blue-900 dark:text-blue-200 hover:scale-105 transition-transform cursor-pointer">
              <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              📝 Latest Posts
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 dark:text-gray-100">
              Fresh
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"> Content</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The latest insights and thoughts on technology and modern living
            </p>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl overflow-hidden animate-pulse dark:bg-gray-800/80 dark:border-gray-700">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600"></div>
                  <div className="p-6">
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-3 dark:bg-gray-700"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 dark:bg-gray-700"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2 dark:bg-gray-700"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 dark:bg-gray-700"></div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <RecentPosts />
          </Suspense>
          
          <div className="text-center mt-16">
            <Link 
              href="/posts" 
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              <span className="mr-3">View All Posts</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup with Enhanced Design */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
        {/* Decorative Elements */}
        <div className="absolute top-1/3 left-1/4 text-purple-400/20 text-3xl animate-float">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        <div className="absolute bottom-1/3 right-1/4 text-pink-400/20 text-3xl animate-float animation-delay-2000">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>

      <Footer />
    </div>
  )
} 