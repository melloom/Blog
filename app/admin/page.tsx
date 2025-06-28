'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'
import ThemeToggle from '@/components/ThemeToggle'

interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalComments: number
  totalCategories: number
  totalTags: number
  totalUsers: number
  pendingComments: number
  flaggedComments: number
  totalViews: number
  systemStatus: 'healthy' | 'warning' | 'error'
}

interface RecentActivity {
  id: string
  type: 'post' | 'comment' | 'user' | 'system'
  title: string
  description: string
  timestamp: string
  status?: string
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalComments: 0,
    totalCategories: 0,
    totalTags: 0,
    totalUsers: 0,
    pendingComments: 0,
    flaggedComments: 0,
    totalViews: 0,
    systemStatus: 'healthy'
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
    } else {
      fetchDashboardStats()
      fetchRecentActivity()
      setIsLoading(false)
    }
  }, [session, status, router])

  const fetchDashboardStats = async () => {
    try {
      // Fetch posts
      const postsResponse = await fetch('/api/posts')
      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        const posts = postsData.posts || []
        
        const totalPosts = posts.length
        const publishedPosts = posts.filter((post: any) => post.status === 'published').length
        const draftPosts = posts.filter((post: any) => post.status === 'draft').length
        
        setStats(prev => ({
          ...prev,
          totalPosts,
          publishedPosts,
          draftPosts
        }))
      }
      
      // Fetch comments from admin endpoint
      const commentsResponse = await fetch('/api/admin/comments')
      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json()
        const comments = commentsData.comments || []
        
        const pendingComments = comments.filter((comment: any) => comment.status === 'pending').length
        const flaggedComments = comments.filter((comment: any) => comment.status === 'spam').length
        
        setStats(prev => ({
          ...prev,
          totalComments: comments.length,
          pendingComments,
          flaggedComments
        }))
      }

      // Fetch categories
      const categoriesResponse = await fetch('/api/categories')
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setStats(prev => ({
          ...prev,
          totalCategories: categoriesData.categories?.length || 0
        }))
      }

      // Fetch tags
      const tagsResponse = await fetch('/api/admin/tags')
      if (tagsResponse.ok) {
        const tagsData = await tagsResponse.json()
        setStats(prev => ({
          ...prev,
          totalTags: tagsData.tags?.length || 0
        }))
      }

      // Mock data for additional stats
      setStats(prev => ({
        ...prev,
        totalUsers: 3, // Mock data
        totalViews: 1247, // Mock data
        systemStatus: 'healthy'
      }))

    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      setStats(prev => ({ ...prev, systemStatus: 'error' }))
    }
  }

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent posts
      const postsResponse = await fetch('/api/posts')
      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        const posts = postsData.posts || []
        
        const recentPosts = posts.slice(0, 3).map((post: any) => ({
          id: post.id.toString(),
          type: 'post' as const,
          title: post.title,
          description: `Post ${post.status === 'published' ? 'published' : 'updated'}`,
          timestamp: new Date(post.createdAt).toLocaleDateString(),
          status: post.status
        }))

        // Fetch recent comments
        const commentsResponse = await fetch('/api/admin/comments')
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json()
          const comments = commentsData.comments || []
          
          const recentComments = comments.slice(0, 2).map((comment: any) => ({
            id: comment.id.toString(),
            type: 'comment' as const,
            title: `Comment by ${comment.authorName}`,
            description: comment.content.substring(0, 50) + '...',
            timestamp: new Date(comment.createdAt).toLocaleDateString(),
            status: comment.status
          }))

          setRecentActivity([...recentPosts, ...recentComments])
        }
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin/login' })
  }

  const handleNewPostClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowNewPostModal(true)
  }

  const handleAIPost = () => {
    setShowNewPostModal(false)
    router.push('/admin/posts/ai-generate')
  }

  const handleManualPost = () => {
    setShowNewPostModal(false)
    router.push('/admin/posts/new')
  }

  const handleCloseModal = () => {
    setShowNewPostModal(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100'
      case 'draft': return 'text-yellow-600 bg-yellow-100'
      case 'pending': return 'text-blue-600 bg-blue-100'
      case 'spam': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSystemStatusColor = (status: DashboardStats['systemStatus']) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalPosts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center dark:bg-blue-900">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.publishedPosts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center dark:bg-green-900">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Draft</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.draftPosts}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center dark:bg-yellow-900">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalComments}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center dark:bg-purple-900">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleNewPostClick}
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors dark:bg-blue-900/20 dark:hover:bg-blue-900/30 w-full"
            >
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-medium text-blue-900 dark:text-blue-100">New Post</span>
            </button>
            <Link href="/admin/comments" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors dark:bg-green-900/20 dark:hover:bg-green-900/30">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-medium text-green-900 dark:text-green-100">Manage Comments</span>
            </Link>
            <Link href="/admin/settings" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors dark:bg-purple-900/20 dark:hover:bg-purple-900/30">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium text-purple-900 dark:text-purple-100">Settings</span>
            </Link>
          </div>
        </div>

        {/* Modal for New Post */}
        {showNewPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-sm relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100 text-center">Create New Post</h3>
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleAIPost}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors"
                >
                  AI Generate Post
                </button>
                <button
                  onClick={handleManualPost}
                  className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Manual Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Posts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">Recent Posts</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{activity.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.description}
                  </p>
                </div>
                <Link href={`/admin/${activity.type.toLowerCase()}s/${activity.id}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 