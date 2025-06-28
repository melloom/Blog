'use client'

import { useCallback } from 'react'

declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}

export const useAnalytics = () => {
  const trackEvent = useCallback((
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }, [])

  const trackPageView = useCallback((url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
        page_path: url,
      })
    }
  }, [])

  const trackPostView = useCallback((postTitle: string, postSlug: string) => {
    trackEvent('post_view', 'engagement', postTitle)
  }, [trackEvent])

  const trackComment = useCallback((action: 'comment_added' | 'comment_approved' | 'comment_deleted') => {
    trackEvent(action, 'engagement')
  }, [trackEvent])

  const trackLike = useCallback((action: 'post_liked' | 'post_unliked') => {
    trackEvent(action, 'engagement')
  }, [trackEvent])

  const trackSearch = useCallback((searchTerm: string) => {
    trackEvent('search', 'engagement', searchTerm)
  }, [trackEvent])

  return {
    trackEvent,
    trackPageView,
    trackPostView,
    trackComment,
    trackLike,
    trackSearch,
  }
} 