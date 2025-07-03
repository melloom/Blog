'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import Providers from '@/components/Providers'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  // TODO: Add authentication check here
  // const isAuthenticated = await checkAuth()
  // if (!isAuthenticated) {
  //   redirect('/admin/login')
  // }

  return (
    <Providers>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {isLoginPage ? (
            // Login page - no sidebar
            <main className="min-h-screen flex items-center justify-center">
              {children}
            </main>
          ) : (
            // Admin pages - with sidebar
            <div className="flex min-h-screen">
              <AdminSidebar />
              <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                }>
                  {children}
                </Suspense>
              </main>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </Providers>
  )
} 