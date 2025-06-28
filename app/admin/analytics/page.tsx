'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  ChartBarIcon, 
  EyeIcon, 
  HeartIcon, 
  ChatBubbleLeftIcon,
  UserIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  totalPosts: number
  totalViews: number
  totalLikes: number
  totalComments: number
  totalUsers: number
  publishedPosts: number
  draftPosts: number
  featuredPosts: number
  recentViews: number
  recentLikes: number
  recentComments: number
  topPosts: Array<{
    id: number
    title: string
    views: number
    likes: number
    comments: number
    publishedAt: string
  }>
  viewsByDay: Array<{
    date: string
    views: number
  }>
  likesByDay: Array<{
    date: string
    likes: number
  }>
  commentsByDay: Array<{
    date: string
    comments: number
  }>
  topCategories: Array<{
    name: string
    postCount: number
    totalViews: number
  }>
  topTags: Array<{
    name: string
    postCount: number
  }>
  userEngagement: {
    averageTimeOnSite: string
    bounceRate: number
    returnVisitors: number
    newVisitors: number
  }
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
    } else {
      fetchAnalytics()
    }
  }, [session, status, router, timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        console.error('Failed to fetch analytics')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics data</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating some posts and getting traffic.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your blog's performance and engagement</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <EyeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatNumber(analytics.totalViews)}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400">+{analytics.recentViews} today</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <HeartIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatNumber(analytics.totalLikes)}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400">+{analytics.recentLikes} today</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <ChatBubbleLeftIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Comments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{formatNumber(analytics.totalComments)}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400">+{analytics.recentComments} today</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <UserIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{analytics.totalPosts}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {analytics.publishedPosts} published, {analytics.draftPosts} drafts
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Views Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Views Over Time</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.viewsByDay.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-blue-500 rounded-t"
                  style={{ 
                    height: `${Math.max((day.views / Math.max(...analytics.viewsByDay.map(d => d.views))) * 200, 4)}px` 
                  }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{formatDate(day.date)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Engagement Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Average Time on Site</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{analytics.userEngagement.averageTimeOnSite}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{analytics.userEngagement.bounceRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Return Visitors</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{analytics.userEngagement.returnVisitors}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">New Visitors</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{analytics.userEngagement.newVisitors}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Posts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.topPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{post.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.publishedAt)}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-blue-600 dark:text-blue-400">{post.views} views</span>
                    <span className="text-red-600 dark:text-red-400">{post.likes} likes</span>
                    <span className="text-green-600 dark:text-green-400">{post.comments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Categories</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{category.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{category.postCount} posts</p>
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    {formatNumber(category.totalViews)} views
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Tags */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Popular Tags</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {analytics.topTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full dark:bg-blue-900/20 dark:text-blue-400"
              >
                {tag.name} ({tag.postCount})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 