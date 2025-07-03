import { getDb } from '@/lib/db'
import { settings } from '@/lib/db/schema'

export interface BlogSettings {
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

const defaultSettings: BlogSettings = {
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
  metaKeywords: 'technology, lifestyle, digital, blog, wired living',
  metaDescription: 'Exploring the intersection of technology, lifestyle, and modern living',
  socialLinks: {
    twitter: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    github: ''
  }
}

export async function getSettings(): Promise<BlogSettings> {
  try {
    const db = getDb()
    const allSettings = await db.select().from(settings).all()
    
    // Convert settings array to object
    const settingsObject: any = {}
    allSettings.forEach(setting => {
      try {
        settingsObject[setting.key] = JSON.parse(setting.value)
      } catch {
        settingsObject[setting.key] = setting.value
      }
    })
    
    // Merge with defaults
    const mergedSettings = { ...defaultSettings, ...settingsObject }
    
    return mergedSettings
  } catch (error) {
    console.error('Error fetching settings:', error)
    return defaultSettings
  }
} 