'use client'

import { useState } from 'react'

interface SocialShareCompactProps {
  url: string
  title: string
  description?: string
}

export default function SocialShareCompact({ url, title, description = '' }: SocialShareCompactProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleSocialShare = (href: string) => {
    window.open(href, '_blank', 'width=600,height=400')
  }

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      color: 'hover:bg-blue-500 hover:text-white',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'Copy Link',
      icon: copied ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: copied ? 'bg-green-500 text-white' : 'hover:bg-gray-500 hover:text-white',
      onClick: handleCopyLink,
    },
  ]

  return (
    <div className="flex items-center space-x-1">
      {socialPlatforms.map((platform) => (
        <button
          key={platform.name}
          onClick={() => {
            if (platform.onClick) {
              platform.onClick()
            } else {
              handleSocialShare(platform.href)
            }
          }}
          className={`p-1.5 text-gray-500 transition-colors rounded ${platform.color} dark:text-gray-400`}
          title={`Share on ${platform.name}`}
        >
          {platform.icon}
        </button>
      ))}
    </div>
  )
} 