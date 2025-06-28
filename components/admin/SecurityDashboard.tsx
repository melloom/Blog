'use client'

import { useState, useEffect } from 'react'
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  EyeIcon, 
  ServerIcon,
  GlobeAltIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface SecurityStats {
  totalEvents: number
  eventsLast24h: number
  eventsLast7d: number
  failedLogins: number
  suspiciousIPs: number
  blockedIPs: number
  securityScore: number
}

interface SecurityEvent {
  id?: number
  type: 'failed_login' | 'suspicious_ip' | 'brute_force' | 'spam_comment' | 'file_access' | 'api_abuse'
  ip: string
  userAgent?: string
  details: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
  resolved?: boolean
}

interface DatabaseHealth {
  status: 'healthy' | 'warning' | 'critical'
  connectionCount: number
  slowQueries: number
  errorRate: number
  lastBackup: Date
  backupSize: string
}

export default function SecurityDashboard() {
  const [stats, setStats] = useState<SecurityStats | null>(null)
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [dbHealth, setDbHealth] = useState<DatabaseHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchSecurityData()
    const interval = setInterval(fetchSecurityData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSecurityData = async () => {
    try {
      const response = await fetch('/api/admin/security?action=comprehensive')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setEvents(data.recentEvents)
        setDbHealth(data.databaseHealth)
      }
    } catch (error) {
      console.error('Error fetching security data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDbHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Security Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time security monitoring and threat detection</p>
        </div>
        <button
          onClick={fetchSecurityData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Security Score */}
      {stats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Security Score</h3>
              <p className="text-gray-600 dark:text-gray-400">Overall system security rating</p>
            </div>
            <div className={`text-4xl font-bold ${getSecurityScoreColor(stats.securityScore)}`}>
              {stats.securityScore}/100
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                stats.securityScore >= 80 ? 'bg-green-500' : 
                stats.securityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${stats.securityScore}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Events (24h)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.eventsLast24h}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <EyeIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed Logins</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.failedLogins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <GlobeAltIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Suspicious IPs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.suspiciousIPs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <ShieldCheckIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Blocked IPs</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.blockedIPs}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Database Health */}
      {dbHealth && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Database Health</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDbHealthColor(dbHealth.status)}`}>
              {dbHealth.status.toUpperCase()}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connections</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{dbHealth.connectionCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Slow Queries</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{dbHealth.slowQueries}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Error Rate</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{dbHealth.errorRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Last Backup</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {new Date(dbHealth.lastBackup).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Security Events */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Security Events</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {event.type.replace('_', ' ').toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {event.details}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {event.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(event.severity)}`}>
                      {event.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.resolved 
                        ? 'text-green-600 bg-green-50 border-green-200' 
                        : 'text-yellow-600 bg-yellow-50 border-yellow-200'
                    }`}>
                      {event.resolved ? 'RESOLVED' : 'ACTIVE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 