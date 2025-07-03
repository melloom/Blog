'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { redirect } from 'next/navigation'
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
        <div className="min-h-screen bg-gray-50">
          {isLoginPage ? (
            // Login page - no sidebar
            <main>
              {children}
            </main>
          ) : (
            // Admin pages - with sidebar
            <div className="flex">
              <AdminSidebar />
              <main className="flex-1 p-6">
                {children}
              </main>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </Providers>
  )
} 