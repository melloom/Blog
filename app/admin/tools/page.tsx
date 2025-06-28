'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SecurityDashboard from '@/components/admin/SecurityDashboard'

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
  const [activeTab, setActiveTab] = useState('security')
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
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
      case 'warning':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'error':
      case 'failed':
      case 'inactive':
        return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
      case 'passed':
        return 'text-green-600 dark:text-green-400'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'error':
      case 'failed':
      case 'inactive':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'active':
      case 'passed':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'error':
      case 'failed':
      case 'inactive':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">System Tools</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and maintain your blog system</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('security')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Security Dashboard
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'system'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            System Tools
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'security' && (
        <SecurityDashboard />
      )}

      {activeTab === 'system' && (
        <div className="space-y-8">
          {/* System Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">System Status</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${getStatusColor(systemStatus.database)}`}>
                    {getStatusIcon(systemStatus.database)}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Database</p>
                    <p className={`text-sm ${getStatusTextColor(systemStatus.database)}`}>
                      {systemStatus.database.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${getStatusColor(systemStatus.cache)}`}>
                    {getStatusIcon(systemStatus.cache)}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Cache</p>
                    <p className={`text-sm ${getStatusTextColor(systemStatus.cache)}`}>
                      {systemStatus.cache.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${getStatusColor(systemStatus.disk)}`}>
                    {getStatusIcon(systemStatus.disk)}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Disk Space</p>
                    <p className={`text-sm ${getStatusTextColor(systemStatus.disk)}`}>
                      {systemStatus.diskSpace}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${getStatusColor(systemStatus.memory)}`}>
                    {getStatusIcon(systemStatus.memory)}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Memory</p>
                    <p className={`text-sm ${getStatusTextColor(systemStatus.memory)}`}>
                      {systemStatus.memoryUsage}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{systemStatus.uptime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Backup</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {new Date(systemStatus.lastBackup).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* System Operations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">System Operations</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Progress Bar */}
              {isRunningOperation && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Operation in progress...</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{operationProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${operationProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Success/Error Message */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('Error') 
                    ? 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' 
                    : 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
                }`}>
                  {message}
                </div>
              )}

              {/* Operation Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={clearCache}
                  disabled={isRunningOperation}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear Cache
                </button>

                <button
                  onClick={optimizeDatabase}
                  disabled={isRunningOperation}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Optimize Database
                </button>

                <button
                  onClick={runMaintenance}
                  disabled={isRunningOperation}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Run Maintenance
                </button>
              </div>
            </div>
          </div>

          {/* Security Checks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Security Checks</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {securityChecks.map((check) => (
                  <div key={check.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{check.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{check.description}</p>
                      {check.recommendation && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{check.recommendation}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      check.status === 'passed' 
                        ? 'text-green-600 bg-green-50 border-green-200' 
                        : check.status === 'warning'
                        ? 'text-yellow-600 bg-yellow-50 border-yellow-200'
                        : 'text-red-600 bg-red-50 border-red-200'
                    }`}>
                      {check.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 