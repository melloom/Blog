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
import AdminSidebar from '@/components/admin/AdminSidebar'
import AnalyticsToggle from '@/components/AnalyticsToggle'

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
    path?: string
    users?: number
    avgDuration?: number
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
  gaData?: {
    totalSessions: number
    totalEvents: number
    avgSessionDuration: number
    avgBounceRate: number
    sessionsPerUser: number
    deviceBreakdown: Array<{
      device: string
      views: number
      users: number
      percentage: number
    }>
    topLocations: Array<{
      country: string
      views: number
      users: number
      percentage: number
    }>
    detailedViewsByDay: Array<{
      date: string
      views: number
      users: number
      sessions: number
      events: number
      avgDuration: number
      bounceRate: number
    }>
    topPages: Array<{
      id: number
      title: string
      path: string
      views: number
      users: number
      avgDuration: number
      publishedAt: string
    }>
  }
  provider?: 'google' | 'vercel' | 'internal'
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analyticsProvider, setAnalyticsProvider] = useState<'google' | 'vercel'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('analyticsProvider') as 'google' | 'vercel') || 'google';
    }
    return 'google';
  });

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
    } else {
      fetchAnalytics()
    }
  }, [session, status, router, timeRange, analyticsProvider])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('analyticsProvider') as 'google' | 'vercel';
      if (stored) setAnalyticsProvider(stored);
    }
  }, []);

  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/analytics?range=${timeRange}&provider=${analyticsProvider}`)
      const data = await response.json()
      
      if (response.ok) {
        setAnalytics(data)
      } else {
        console.error('Failed to fetch analytics:', data)
        if (data.error === 'Google Analytics not configured') {
          setError('Google Analytics is not configured. Please set up GA4_CREDENTIALS_JSON and GA4_PROPERTY_ID environment variables.')
        } else if (data.error === 'Invalid Google Analytics credentials') {
          setError('Invalid Google Analytics credentials format. Please check your .env.local file.')
        } else {
          setError(data.message || 'Failed to fetch analytics data')
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('Network error while fetching analytics data')
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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Analytics Error</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">{error}</p>
        {error.includes('Google Analytics') && !error.includes('Invalid') && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Setup Instructions:</h4>
            <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
              <li>Create a Google Analytics 4 property</li>
              <li>Set up service account credentials</li>
              <li>Add GA4_CREDENTIALS_JSON to your environment variables</li>
              <li>Add GA4_PROPERTY_ID to your environment variables</li>
              <li>Restart your application</li>
            </ol>
          </div>
        )}
        
        {error.includes('Invalid Google Analytics credentials') && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-md mx-auto">
            <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">Credential Format Fix:</h4>
            <div className="text-xs text-yellow-800 dark:text-yellow-200 space-y-2">
              <p><strong>Your .env.local should look like this:</strong></p>
              <pre className="bg-white dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
{`GA4_CREDENTIALS_JSON={"type":"service_account","project_id":"your-project","private_key_id":"key-id","private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\\n-----END PRIVATE KEY-----\\n","client_email":"service@project.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/service%40project.iam.gserviceaccount.com"}`}
              </pre>
              <p className="mt-2"><strong>Key points:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Must be on a single line</li>
                <li>All quotes must be escaped with backslashes</li>
                <li>Newlines in private_key must be \\n</li>
                <li>No line breaks in the JSON</li>
              </ul>
            </div>
          </div>
        )}
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
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
          <AnalyticsToggle provider={analyticsProvider} setProvider={setAnalyticsProvider} isLoading={loading} />
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
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Posts</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {analytics.topPosts.map((post, index) => (
                <div key={post.id} className={`group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-200 ${index === 0 ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {index < 3 && (
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              'bg-orange-500'
                            }`}>
                              {index + 1}
                            </div>
                          )}
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                          {formatDate(post.publishedAt)}
                        </p>
                        
                        {/* Engagement Metrics */}
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{post.views}</span>
                            <span className="text-xs text-gray-500">views</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{post.likes}</span>
                            <span className="text-xs text-gray-500">likes</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{post.comments}</span>
                            <span className="text-xs text-gray-500">comments</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Engagement Score */}
                      <div className="ml-4 flex flex-col items-end">
                        <div className="text-xs text-gray-500 mb-1">Engagement</div>
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {post.views + post.likes + post.comments}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Categories</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {analytics.topCategories.map((category, index) => (
                <div key={index} className={`group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-200 ${index === 0 ? 'ring-2 ring-green-400 ring-opacity-50' : ''}`}>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold text-white ${
                          index === 0 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 
                          index === 1 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 
                          index === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-600' :
                          'bg-gradient-to-br from-gray-500 to-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                            {category.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {formatNumber(category.totalViews)}
                        </div>
                        <div className="text-xs text-gray-500">total views</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Performance</span>
                        <span>{Math.round((category.totalViews / Math.max(...analytics.topCategories.map(c => c.totalViews))) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            index === 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            index === 1 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                            index === 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                            'bg-gradient-to-r from-gray-500 to-gray-600'
                          }`}
                          style={{ 
                            width: `${(category.totalViews / Math.max(...analytics.topCategories.map(c => c.totalViews))) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Google Analytics Enhanced Data */}
      {analytics.provider === 'google' && analytics.gaData && (
        <>
          {/* Enhanced Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-100">Total Sessions</p>
                  <p className="text-2xl font-bold">{formatNumber(analytics.gaData.totalSessions)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-100">Total Events</p>
                  <p className="text-2xl font-bold">{formatNumber(analytics.gaData.totalEvents)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-100">Avg Session Duration</p>
                  <p className="text-2xl font-bold">{Math.floor(analytics.gaData.avgSessionDuration / 60)}m {Math.floor(analytics.gaData.avgSessionDuration % 60)}s</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
              <div className="flex items-center">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-orange-100">Sessions/User</p>
                  <p className="text-2xl font-bold">{analytics.gaData.sessionsPerUser.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Device and Location Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Device Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Device Breakdown</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.gaData.deviceBreakdown.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          device.device === 'desktop' ? 'bg-blue-500' :
                          device.device === 'mobile' ? 'bg-green-500' :
                          device.device === 'tablet' ? 'bg-purple-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{device.device}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{formatNumber(device.views)} views</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{device.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Locations */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Locations</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {analytics.gaData.topLocations.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{location.country}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{formatNumber(location.views)} views</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{location.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Top Pages */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Pages (Google Analytics)</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.gaData.topPages.map((page) => (
                  <div key={page.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{page.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{page.path}</p>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">{formatNumber(page.views)}</span>
                        <p className="text-xs text-gray-500">views</p>
                      </div>
                      <div className="text-center">
                        <span className="text-green-600 dark:text-green-400 font-semibold">{formatNumber(page.users)}</span>
                        <p className="text-xs text-gray-500">users</p>
                      </div>
                      <div className="text-center">
                        <span className="text-purple-600 dark:text-purple-400 font-semibold">{Math.floor(page.avgDuration / 60)}m {Math.floor(page.avgDuration % 60)}s</span>
                        <p className="text-xs text-gray-500">avg time</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

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