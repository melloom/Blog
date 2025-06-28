import { Suspense } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { redirect } from 'next/navigation'
import Providers from '@/components/Providers'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Add authentication check here
  // const isAuthenticated = await checkAuth()
  // if (!isAuthenticated) {
  //   redirect('/admin/login')
  // }

  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </Providers>
  )
} 