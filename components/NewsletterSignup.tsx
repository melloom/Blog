'use client'

import { useState } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('https://buttondown.com/api/emails/embed-subscribe/WiredLiving', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setMessage('Thanks for subscribing! Check your email to confirm.')
        setEmail('')
      } else {
        const error = await response.json()
        setMessage(error.message || 'Something went wrong. Please try again.')
        setIsSuccess(false)
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
      setIsSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 lg:p-8 dark:from-gray-800 dark:to-gray-700">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 dark:bg-blue-900">
          <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 dark:text-gray-100">
          Stay Updated
        </h3>
        <p className="text-sm lg:text-base text-gray-600 mb-6 max-w-md mx-auto leading-relaxed dark:text-gray-300">
          Get the latest insights delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-sm"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200 text-sm whitespace-nowrap flex-shrink-0"
            >
              {isSubmitting ? '...' : 'Join'}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            isSuccess 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {message}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-4 dark:text-gray-400 break-words">
          Powered by{' '}
          <a 
            href="https://buttondown.com/refer/WiredLiving" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 break-all"
          >
            Buttondown
          </a>
        </p>
      </div>
    </div>
  )
} 