import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import { GoogleAnalytics } from '@next/third-parties/google'
import ReadingProgressBar from '@/components/ReadingProgressBar'
import { getSettings } from '@/lib/settings'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next'
import Script from 'next/script'
import ErrorBoundary from '@/components/ErrorBoundary'
import GlobalErrorHandler from '@/components/GlobalErrorHandler'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  
  return {
    title: 'Wired Living',
    description: settings.siteDescription,
    keywords: settings.metaKeywords ? settings.metaKeywords.split(',').map(k => k.trim()) : ['technology', 'lifestyle', 'digital', 'blog'],
    authors: [{ name: 'Wired Living' }],
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
      title: 'Wired Living',
      description: settings.siteDescription,
      siteName: 'Wired Living',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Wired Living',
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
        {/* Manual Google Analytics tracking code */}
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className + " bg-white dark:bg-gray-950"}>
        <GlobalErrorHandler />
        <ErrorBoundary>
          <Providers>
            <ReadingProgressBar />
            <div className="min-h-screen bg-white dark:bg-gray-950">
              {children}
            </div>
          </Providers>
        </ErrorBoundary>
        {/* Global Analytics Provider (build-time selection) */}
        {process.env.ANALYTICS_PROVIDER === "google" && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        )}
        {process.env.ANALYTICS_PROVIDER === "vercel" && <VercelAnalytics />}
      </body>
    </html>
  )
} 