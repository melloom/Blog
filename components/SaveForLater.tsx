'use client'

import { useState, useEffect } from 'react'
import { BookmarkIcon } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'

interface SaveForLaterProps {
  postId: number
  postTitle: string
  postSlug: string
  className?: string
}

export default function SaveForLater({ postId, postTitle, postSlug, className = '' }: SaveForLaterProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if post is already saved
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]')
    setIsSaved(savedPosts.some((post: any) => post.id === postId))
  }, [postId])

  const toggleSave = () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]')
      
      if (isSaved) {
        // Remove from saved posts
        const updatedPosts = savedPosts.filter((post: any) => post.id !== postId)
        localStorage.setItem('savedPosts', JSON.stringify(updatedPosts))
        setIsSaved(false)
      } else {
        // Add to saved posts
        const newSavedPost = {
          id: postId,
          title: postTitle,
          slug: postSlug,
          savedAt: new Date().toISOString()
        }
        const updatedPosts = [...savedPosts, newSavedPost]
        localStorage.setItem('savedPosts', JSON.stringify(updatedPosts))
        setIsSaved(true)
      }
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggleSave}
      disabled={isLoading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        isSaved 
          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${className}`}
      title={isSaved ? 'Remove from saved' : 'Save for later'}
    >
      {isSaved ? (
        <BookmarkSolidIcon className="w-4 h-4" />
      ) : (
        <BookmarkIcon className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">
        {isSaved ? 'Saved' : 'Save'}
      </span>
      {isLoading && <span className="text-sm">...</span>}
    </button>
  )
} 