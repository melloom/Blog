import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import { GoogleAnalytics } from '@next/third-parties/google'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import { getSettings } from '@/lib/settings'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  
  return {
    title: settings.siteTitle,
    description: settings.siteDescription,
    keywords: settings.metaKeywords ? settings.metaKeywords.split(',').map(k => k.trim()) : ['technology', 'lifestyle', 'digital', 'blog'],
    authors: [{ name: settings.siteTitle }],
    icons: {
      icon: [
        { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      shortcut: '/favicon_io/favicon.ico',
      apple: '/favicon_io/apple-touch-icon.png',
      other: [
        { rel: 'android-chrome-192x192', url: '/favicon_io/android-chrome-192x192.png' },
        { rel: 'android-chrome-512x512', url: '/favicon_io/android-chrome-512x512.png' },
      ],
    },
    manifest: '/favicon_io/site.webmanifest',
    openGraph: {
      title: settings.siteTitle,
      description: settings.siteDescription,
      url: settings.siteUrl,
      siteName: settings.siteTitle,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.siteTitle,
      description: settings.siteDescription,
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon_io/favicon.ico" />
      </head>
      <body className={inter.className + " bg-white dark:bg-gray-950"}>
        <Providers>
          <ReadingProgressBar />
          <div className="min-h-screen bg-white dark:bg-gray-950">
            {children}
          </div>
        </Providers>
        {/* Google Analytics - Replace G-XXXXXXXXXX with your actual GA4 Measurement ID */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
} 