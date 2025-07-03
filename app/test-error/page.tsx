'use client'

import { useState } from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'

function TestErrorComponent() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error('This is a test error to verify error boundary functionality')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Error Boundary Test
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This page tests the error boundary functionality. Click the button below to trigger an error and see how it's handled.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => setShouldError(true)}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Trigger Test Error
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            Go Home
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            What this tests:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
            <li>• Error boundary catches JavaScript errors</li>
            <li>• Graceful error display instead of red screen</li>
            <li>• Error recovery with "Try Again" button</li>
            <li>• Proper error logging in development</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function TestErrorPage() {
  return (
    <ErrorBoundary>
      <TestErrorComponent />
    </ErrorBoundary>
  )
} 