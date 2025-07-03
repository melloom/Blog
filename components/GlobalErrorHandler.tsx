'use client'

import { useEffect } from 'react'

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.warn('Unhandled promise rejection:', event.reason)
      event.preventDefault()
    }

    // Handle global errors
    const handleGlobalError = (event: ErrorEvent) => {
      console.warn('Global error:', event.error || event.message)
      event.preventDefault()
    }

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleGlobalError)

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleGlobalError)
    }
  }, [])

  // This component doesn't render anything
  return null
} 