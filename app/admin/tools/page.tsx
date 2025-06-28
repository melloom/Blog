'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface SystemStatus {
  database: 'healthy' | 'warning' | 'error'
  cache: 'active' | 'inactive' | 'error'
  disk: 'healthy' | 'warning' | 'error'
  memory: 'healthy' | 'warning' | 'error'
  uptime: string
  memoryUsage: string
  diskSpace: string
  lastBackup: string
}

interface SecurityCheck {
  id: string
  name: string
  status: 'passed' | 'failed' | 'warning'
  description: string
  recommendation?: string
}

export default function ToolsPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: 'healthy',
    cache: 'active',
    disk: 'healthy',
    memory: 'healthy',
    uptime: '99.9%',
    memoryUsage: '50%',
    diskSpace: '50%',
    lastBackup: '2024-01-15T10:30:00Z'
  })
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([])
  const [isRunningOperation, setIsRunningOperation] = useState(false)
  const [operationProgress, setOperationProgress] = useState(0)
  const [message, setMessage] = useState('')
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
    } else {
      fetchSystemStatus()
      runSecurityChecks()
    }
  }, [session, status, router])

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/admin/tools')
      if (response.ok) {
        const data = await response.json()
        setSystemStatus(data.systemStatus)
      } else {
        console.error('Failed to fetch system status')
      }
    } catch (error) {
      console.error('Error fetching system status:', error)
    }
  }

  const runSecurityChecks = async () => {
    try {
      const response = await fetch('/api/admin/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'security-checks' }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setSecurityChecks(data.securityChecks || [])
      } else {
        console.error('Failed to run security checks')
      }
    } catch (error) {
      console.error('Error running security checks:', error)
    }
  }

  const clearCache = async () => {
    setIsRunningOperation(true)
    setOperationProgress(0)
    setMessage('')

    try {
      const progressInterval = setInterval(() => {
        setOperationProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 20
        })
      }, 300)

      const response = await fetch('/api/admin/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'clear-cache' }),
      })

      clearInterval(progressInterval)
      setOperationProgress(100)

      if (response.ok) {
        const data = await response.json()
        setMessage(data.message || 'Cache cleared successfully!')
        // Refresh system status
        fetchSystemStatus()
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || 'Error clearing cache')
      }

    } catch (error) {
      console.error('Error clearing cache:', error)
      setMessage('Error clearing cache')
    } finally {
      setIsRunningOperation(false)
      setOperationProgress(0)
    }
  }

  const optimizeDatabase = async () => {
    setIsRunningOperation(true)
    setOperationProgress(0)
    setMessage('')

    try {
      const progressInterval = setInterval(() => {
        setOperationProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch('/api/admin/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'optimize-database' }),
      })

      clearInterval(progressInterval)
      setOperationProgress(100)

      if (response.ok) {
        const data = await response.json()
        setMessage(data.message || 'Database optimized successfully!')
        // Refresh system status
        fetchSystemStatus()
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || 'Error optimizing database')
      }

    } catch (error) {
      console.error('Error optimizing database:', error)
      setMessage('Error optimizing database')
    } finally {
      setIsRunningOperation(false)
      setOperationProgress(0)
    }
  }

  const runMaintenance = async () => {
    setIsRunningOperation(true)
    setOperationProgress(0)
    setMessage('')

    try {
      const response = await fetch('/api/admin/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'run-maintenance' }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Show progress for each step
        const steps = data.results || []
        for (let i = 0; i < steps.length; i++) {
          setMessage(steps[i])
          setOperationProgress((i + 1) * (100 / steps.length))
          await new Promise(resolve => setTimeout(resolve, 800))
        }

        setMessage(data.message || 'Maintenance completed successfully!')
        
        // Update security checks if provided
        if (data.securityChecks) {
          setSecurityChecks(data.securityChecks)
        }
        
        // Refresh system status
        fetchSystemStatus()
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || 'Error running maintenance')
      }

    } catch (error) {
      console.error('Error running maintenance:', error)
      setMessage('Error running maintenance')
    } finally {
      setIsRunningOperation(false)
      setOperationProgress(0)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
      case 'passed':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      case 'error':
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
      case 'passed':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'error':
      case 'failed':
        return '❌'
      default:
        return 'ℹ️'
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">System Tools</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/admin"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <AdminSidebar />
        
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">System Tools</h1>
            <p className="text-gray-600">Manage system utilities and maintenance</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('Error') 
                ? 'bg-red-50 border border-red-200 text-red-800' 
                : 'bg-green-50 border border-green-200 text-green-800'
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">System Status</h2>
                    <p className="text-sm text-gray-600 mt-1">Current system health</p>
                  </div>
                  <button
                    onClick={() => {
                      fetchSystemStatus()
                      runSecurityChecks()
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Refresh system status"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Database</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(systemStatus.database)}`}>
                      {systemStatus.database}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Cache</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(systemStatus.cache)}`}>
                      {systemStatus.cache}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Disk Space</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(systemStatus.disk)}`}>
                      {systemStatus.disk}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Memory</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(systemStatus.memory)}`}>
                      {systemStatus.memory}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Uptime</span>
                    <span className="text-xs text-gray-600">{systemStatus.uptime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                    <span className="text-xs text-gray-600">{systemStatus.memoryUsage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Disk Space</span>
                    <span className="text-xs text-gray-600">{systemStatus.diskSpace}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Last Backup</span>
                    <span className="text-xs text-gray-600">
                      {new Date(systemStatus.lastBackup).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                <p className="text-sm text-gray-600 mt-1">Common system operations</p>
              </div>
              <div className="p-6 space-y-4">
                {/* Progress Bar */}
                {isRunningOperation && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Running operation...</span>
                      <span>{operationProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${operationProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <button
                  onClick={clearCache}
                  disabled={isRunningOperation}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Clear Cache</span>
                  </div>
                </button>

                <button
                  onClick={optimizeDatabase}
                  disabled={isRunningOperation}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Optimize Database</span>
                  </div>
                </button>

                <button
                  onClick={runMaintenance}
                  disabled={isRunningOperation}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Run Maintenance</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Security Checks */}
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Security Checks</h2>
              <p className="text-sm text-gray-600 mt-1">System security status</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityChecks.map((check) => (
                  <div key={check.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <span className="text-xl">{getStatusIcon(check.status)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{check.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(check.status)}`}>
                          {check.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{check.description}</p>
                      {check.recommendation && (
                        <p className="text-xs text-yellow-600 mt-1">
                          <strong>Recommendation:</strong> {check.recommendation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 