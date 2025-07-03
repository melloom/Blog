'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { filterComment } from '@/lib/content-filter'

interface Comment {
  id: number
  content: string
  authorName: string
  authorEmail: string
  postId: number
  userId: number | null
  anonymousUserId: number | null
  status: 'pending' | 'approved' | 'spam'
  createdAt: string
  post?: {
    title: string
    slug: string
  }
  anonymousUser?: {
    userIp: string
    displayName: string | null
  }
}

interface BlockedIP {
  id: number
  ipAddress: string
  reason: string
  blockedAt: string
}

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'spam'>('all')
  const [selectedComments, setSelectedComments] = useState<number[]>([])
  const [showBlockIPModal, setShowBlockIPModal] = useState(false)
  const [blockIPData, setBlockIPData] = useState({ ip: '', reason: '' })

  useEffect(() => {
    fetchComments()
    fetchBlockedIPs()
  }, [])

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/admin/comments')
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBlockedIPs = async () => {
    try {
      const response = await fetch('/api/admin/blocked-ips')
      if (response.ok) {
        const data = await response.json()
        setBlockedIPs(data.blockedIPs)
      }
    } catch (error) {
      console.error('Error fetching blocked IPs:', error)
    }
  }

  const updateCommentStatus = async (commentId: number, status: 'approved' | 'spam') => {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        setComments(prev => prev.map(comment => 
          comment.id === commentId ? { ...comment, status } : comment
        ))
      }
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  const deleteComment = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment.id !== commentId))
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const blockIP = async () => {
    try {
      const response = await fetch('/api/admin/blocked-ips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blockIPData)
      })

      if (response.ok) {
        await fetchBlockedIPs()
        setShowBlockIPModal(false)
        setBlockIPData({ ip: '', reason: '' })
      }
    } catch (error) {
      console.error('Error blocking IP:', error)
    }
  }

  const unblockIP = async (ipId: number) => {
    try {
      const response = await fetch(`/api/admin/blocked-ips/${ipId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setBlockedIPs(prev => prev.filter(ip => ip.id !== ipId))
      }
    } catch (error) {
      console.error('Error unblocking IP:', error)
    }
  }

  const bulkAction = async (action: 'approve' | 'spam' | 'delete') => {
    if (selectedComments.length === 0) return

    try {
      const response = await fetch('/api/admin/comments/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          commentIds: selectedComments, 
          action 
        })
      })

      if (response.ok) {
        if (action === 'delete') {
          setComments(prev => prev.filter(comment => !selectedComments.includes(comment.id)))
        } else {
          const newStatus = action === 'approve' ? 'approved' : 'spam'
          setComments(prev => prev.map(comment => 
            selectedComments.includes(comment.id) ? { ...comment, status: newStatus } : comment
          ))
        }
        setSelectedComments([])
      }
    } catch (error) {
      console.error('Error performing bulk action:', error)
    }
  }

  const filteredComments = comments.filter(comment => 
    filter === 'all' ? true : comment.status === filter
  )

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      spam: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getModerationInfo = (comment: Comment) => {
    const filterResult = filterComment(comment.content, comment.authorName)
    return filterResult
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-red-100 text-red-800'
    if (confidence >= 60) return 'bg-orange-100 text-orange-800'
    if (confidence >= 40) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'High Risk'
    if (confidence >= 60) return 'Medium Risk'
    if (confidence >= 40) return 'Low Risk'
    return 'Safe'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="flex-1 p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Comments Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>View Site</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Comments Management</h1>
            <p className="text-gray-600">Manage and moderate comments from your blog posts</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Comments</p>
                  <p className="text-2xl font-bold text-gray-900">{comments.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{comments.filter(c => c.status === 'pending').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{comments.filter(c => c.status === 'approved').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Blocked IPs</p>
                  <p className="text-2xl font-bold text-gray-900">{blockedIPs.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Comments</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="spam">Spam</option>
                  </select>
                  
                  {selectedComments.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => bulkAction('approve')}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Approve Selected
                      </button>
                      <button
                        onClick={() => bulkAction('spam')}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Mark as Spam
                      </button>
                      <button
                        onClick={() => bulkAction('delete')}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                      >
                        Delete Selected
                      </button>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setShowBlockIPModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Block IP Address
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {filteredComments.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No comments found</h3>
                <p className="text-gray-600">No comments match the current filter.</p>
              </div>
            ) : (
              filteredComments.map((comment) => {
                const moderationInfo = getModerationInfo(comment)
                const isFlagged = !moderationInfo.isApproved
                
                return (
                  <div key={comment.id} className={`bg-white rounded-lg shadow ${
                    isFlagged 
                      ? moderationInfo.confidence >= 80 
                        ? 'border-l-4 border-red-400' 
                        : moderationInfo.confidence >= 60 
                        ? 'border-l-4 border-orange-400'
                        : 'border-l-4 border-yellow-400'
                      : ''
                  }`}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedComments.includes(comment.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedComments(prev => [...prev, comment.id])
                              } else {
                                setSelectedComments(prev => prev.filter(id => id !== comment.id))
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{comment.authorName}</h4>
                            <p className="text-sm text-gray-500">{comment.authorEmail}</p>
                            {comment.anonymousUser && (
                              <p className="text-xs text-gray-400">IP: {comment.anonymousUser.userIp}</p>
                            )}
                          </div>
                          {getStatusBadge(comment.status)}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {comment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateCommentStatus(comment.id, 'approved')}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateCommentStatus(comment.id, 'spam')}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                              >
                                Spam
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteComment(comment.id)}
                            className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      {/* Moderation Warning */}
                      {isFlagged && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <span className="text-sm font-medium text-yellow-800">
                                Auto-flagged for moderation: {moderationInfo.reason}
                              </span>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(moderationInfo.confidence)}`}>
                              {getConfidenceLabel(moderationInfo.confidence)} ({moderationInfo.confidence}%)
                            </span>
                          </div>
                          {moderationInfo.flaggedWords && (
                            <div className="mt-2">
                              <span className="text-xs text-yellow-700">Flagged terms: </span>
                              <span className="text-xs font-medium text-yellow-800">
                                {moderationInfo.flaggedWords.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Comment Content */}
                      <div className="mb-4">
                        <p className="text-gray-900 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                      
                      {/* Comment Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                          {comment.post && (
                            <span>on "{comment.post.title}"</span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {comment.status === 'pending' && (
                            <span className="text-yellow-600 font-medium">Needs Review</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Block IP Modal */}
          {showBlockIPModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Block IP Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                    <input
                      type="text"
                      value={blockIPData.ip}
                      onChange={(e) => setBlockIPData(prev => ({ ...prev, ip: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="192.168.1.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <textarea
                      value={blockIPData.reason}
                      onChange={(e) => setBlockIPData(prev => ({ ...prev, reason: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Reason for blocking this IP address"
                    />
                  </div>
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => setShowBlockIPModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={blockIP}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Block IP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 