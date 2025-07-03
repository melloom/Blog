'use client'

import { useState, useEffect } from 'react'
import { dbNonNull as db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { formatDistanceToNow } from 'date-fns'

interface Settings {
  siteDescription: string
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

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    siteDescription: 'Exploring the intersection of technology, lifestyle, and modern living',
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
    metaKeywords: '',
    metaDescription: '',
    socialLinks: {
      twitter: '',
      facebook: '',
      instagram: '',
      linkedin: '',
      github: ''
    }
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setMessage('Settings saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Error saving settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSocialLinkChange = (platform: keyof Settings['socialLinks'], value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }))
  }

  if (loading) {
    return (
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
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Settings</h1>
        <p className="text-gray-600">Configure your blog settings and preferences</p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('Error') 
            ? 'bg-red-50 border border-red-200 text-red-800' 
            : 'bg-green-50 border border-green-200 text-green-800'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-8">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">General Settings</h2>
            <p className="text-sm text-gray-600 mt-1">Basic site configuration</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="A brief description of your blog"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Posts Per Page</label>
                <input
                  type="number"
                  value={settings.postsPerPage}
                  onChange={(e) => handleInputChange('postsPerPage', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Comments Settings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Comments Settings</h2>
            <p className="text-sm text-gray-600 mt-1">Configure comment behavior</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Allow Comments</h3>
                <p className="text-sm text-gray-600">Enable or disable comments on posts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowComments}
                  onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Moderate Comments</h3>
                <p className="text-sm text-gray-600">Review comments before they appear</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.moderateComments}
                  onChange={(e) => handleInputChange('moderateComments', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Auto-approve Comments</h3>
                <p className="text-sm text-gray-600">Automatically approve comments from registered users</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoApproveComments}
                  onChange={(e) => handleInputChange('autoApproveComments', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
} 