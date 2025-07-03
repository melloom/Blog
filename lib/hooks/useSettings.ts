import { useState, useEffect } from 'react'

export interface BlogSettings {
  siteTitle: string
  siteDescription: string
  siteUrl: string
  adminEmail: string
  postsPerPage: number
  allowComments: boolean
  moderateComments: boolean
  autoApproveComments: boolean
  enableAnalytics: boolean
  googleAnalyticsId: string
  enableNewsletter: boolean
  newsletterProvider: string
  enableSocialSharing: boolean
  enableRSS: boolean
  maintenanceMode: boolean
  maintenanceMessage: string
  defaultPostStatus: 'draft' | 'published'
  defaultUserRole: 'admin' | 'editor'
  timezone: string
  dateFormat: string
  customCss: string
  customJs: string
  disqusShortname: string
  showAuthor: boolean
  showReadingTime: boolean
  enableDarkMode: boolean
  primaryColor: string
  secondaryColor: string
  logoUrl: string
  faviconUrl: string
  metaKeywords: string
  metaDescription: string
  socialLinks: {
    twitter: string
    facebook: string
    instagram: string
    linkedin: string
    github: string
  }
}

const defaultSettings: BlogSettings = {
  siteTitle: 'WiredLiving - Technology & Life',
  siteDescription: 'Exploring the intersection of technology and modern living. Insights, tutorials, and thoughts on building a better digital life.',
  siteUrl: 'http://localhost:3000',
  adminEmail: 'admin@example.com',
  postsPerPage: 10,
  allowComments: true,
  moderateComments: true,
  autoApproveComments: true,
  enableAnalytics: false,
  googleAnalyticsId: '',
  enableNewsletter: false,
  newsletterProvider: 'mailchimp',
  enableSocialSharing: true,
  enableRSS: true,
  maintenanceMode: false,
  maintenanceMessage: 'Site is under maintenance. Please check back soon.',
  defaultPostStatus: 'draft',
  defaultUserRole: 'editor',
  timezone: 'UTC',
  dateFormat: 'YYYY-MM-DD',
  customCss: '',
  customJs: '',
  disqusShortname: '',
  showAuthor: true,
  showReadingTime: true,
  enableDarkMode: false,
  primaryColor: '#3b82f6',
  secondaryColor: '#1e40af',
  logoUrl: '',
  faviconUrl: '',
  metaKeywords: 'technology, lifestyle, digital, blog, wiredliving',
  metaDescription: 'Exploring the intersection of technology and modern living. Insights, tutorials, and thoughts on building a better digital life.',
  socialLinks: {
    twitter: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    github: ''
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<BlogSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      } else {
        setError('Failed to fetch settings')
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
      setError('Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings
  }
} 