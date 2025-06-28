'use client'

import { useEffect } from 'react'
import { useAnalytics } from '@/lib/hooks/useAnalytics'

interface PostViewTrackerProps {
  postTitle: string
  postSlug: string
}

export default function PostViewTracker({ postTitle, postSlug }: PostViewTrackerProps) {
  const { trackPostView } = useAnalytics()

  useEffect(() => {
    // Track post view when component mounts
    trackPostView(postTitle, postSlug)
  }, [postTitle, postSlug, trackPostView])

  return null // This component doesn't render anything
} 