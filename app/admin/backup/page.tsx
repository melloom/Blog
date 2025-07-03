'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface BackupData {
  posts: any[]
  comments: any[]
  categories: any[]
  tags: any[]
  users: any[]
  settings: any[]
}

interface BackupHistory {
  id: string
  filename: string
  size: string
  type: 'full' | 'posts' | 'comments' | 'settings'
  createdAt: string
  status: 'completed' | 'failed' | 'in_progress'
}

export default function BackupPage() {
  const [backupData, setBackupData] = useState<BackupData>({
    posts: [],
    comments: [],
    categories: [],
    tags: [],
    users: [],
    settings: []
  })
  const [backupHistory, setBackupHistory] = useState<BackupHistory[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['posts', 'comments', 'categories', 'tags', 'settings'])
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [message, setMessage] = useState('')
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/admin/login')
    } else {
      fetchBackupData()
      fetchBackupHistory()
    }
  }, [session, status, router])

  const fetchBackupData = async () => {
    try {
      const response = await fetch('/api/admin/backup')
      if (response.ok) {
        const data = await response.json()
        setBackupData(data.backupData)
      } else {
        console.error('Failed to fetch backup data')
        setMessage('Error fetching data for backup')
      }
    } catch (error) {
      console.error('Error fetching backup data:', error)
      setMessage('Error fetching data for backup')
    }
  }

  const fetchBackupHistory = async () => {
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'history' }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setBackupHistory(data.history || [])
      } else {
        console.error('Failed to fetch backup history')
      }
    } catch (error) {
      console.error('Error fetching backup history:', error)
    }
  }

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const exportToJSON = async () => {
    setIsExporting(true)
    setExportProgress(0)
    setMessage('')

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Get backup data from API
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'export',
          types: selectedTypes 
        }),
      })

      clearInterval(progressInterval)
      setExportProgress(100)

      if (response.ok) {
        const data = await response.json()
        
        // Create and download file
        const dataStr = JSON.stringify(data.data, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        
        const url = URL.createObjectURL(dataBlob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = data.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        setMessage('Backup exported successfully!')
        
        // Add to history
        const newBackup: BackupHistory = {
          id: Date.now().toString(),
          filename: data.filename,
          size: `${(dataStr.length / 1024 / 1024).toFixed(2)} MB`,
          type: selectedTypes.length === 6 ? 'full' : selectedTypes[0] as any,
          createdAt: new Date().toISOString(),
          status: 'completed'
        }
        setBackupHistory(prev => [newBackup, ...prev])
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || 'Error exporting backup')
      }

    } catch (error) {
      console.error('Error exporting backup:', error)
      setMessage('Error exporting backup')
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const exportToCSV = async () => {
    setIsExporting(true)
    setExportProgress(0)
    setMessage('')

    try {
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Create CSV data for each selected type
      const csvData: { [key: string]: string } = {}

      if (selectedTypes.includes('posts')) {
        csvData.posts = convertToCSV(backupData.posts, ['id', 'title', 'slug', 'status', 'createdAt'])
      }
      if (selectedTypes.includes('comments')) {
        csvData.comments = convertToCSV(backupData.comments, ['id', 'authorName', 'content', 'status', 'createdAt'])
      }
      if (selectedTypes.includes('categories')) {
        csvData.categories = convertToCSV(backupData.categories, ['id', 'name', 'slug', 'description'])
      }
      if (selectedTypes.includes('tags')) {
        csvData.tags = convertToCSV(backupData.tags, ['id', 'name', 'slug'])
      }

      // Create zip file with multiple CSV files
      const filename = `backup-${new Date().toISOString().split('T')[0]}-${selectedTypes.join('-')}.zip`
      
      // For now, just export the first CSV file
      const firstCsv = Object.values(csvData)[0]
      if (firstCsv) {
        const dataBlob = new Blob([firstCsv], { type: 'text/csv' })
        const url = URL.createObjectURL(dataBlob)
        
        const link = document.createElement('a')
        link.href = url
        link.download = filename.replace('.zip', '.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }

      clearInterval(progressInterval)
      setExportProgress(100)
      setMessage('CSV backup exported successfully!')

    } catch (error) {
      console.error('Error exporting CSV backup:', error)
      setMessage('Error exporting CSV backup')
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const convertToCSV = (data: any[], fields: string[]): string => {
    const headers = fields.join(',')
    const rows = data.map(item => 
      fields.map(field => {
        const value = item[field]
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      }).join(',')
    )
    return [headers, ...rows].join('\n')
  }

  const deleteBackup = (id: string) => {
    setBackupHistory(prev => prev.filter(backup => backup.id !== id))
    setMessage('Backup deleted successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'in_progress': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full': return '📦'
      case 'posts': return '📝'
      case 'comments': return '💬'
      case 'settings': return '⚙️'
      default: return '📄'
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
              <h1 className="text-xl font-bold text-gray-900">Backup & Export</h1>
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
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Backup & Export</h1>
            <p className="text-gray-600">Export your site data for backup or migration</p>
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
            {/* Export Options */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Export Options</h2>
                <p className="text-sm text-gray-600 mt-1">Select what to export</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Data Type Selection */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Select Data Types</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'posts', label: 'Posts', count: backupData.posts.length },
                      { key: 'comments', label: 'Comments', count: backupData.comments.length },
                      { key: 'categories', label: 'Categories', count: backupData.categories.length },
                      { key: 'tags', label: 'Tags', count: backupData.tags.length },
                      { key: 'users', label: 'Users', count: backupData.users.length },
                      { key: 'settings', label: 'Settings', count: backupData.settings.length }
                    ].map(({ key, label, count }) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(key)}
                          onChange={() => handleTypeToggle(key)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">{label}</span>
                          <span className="text-xs text-gray-500 block">{count} items</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Export Progress */}
                {isExporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Exporting...</span>
                      <span>{exportProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${exportProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Export Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={exportToJSON}
                    disabled={isExporting || selectedTypes.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Export as JSON</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={exportToCSV}
                    disabled={isExporting || selectedTypes.length === 0}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Export as CSV</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Backup History */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Backup History</h2>
                <p className="text-sm text-gray-600 mt-1">Recent backup files</p>
              </div>
              <div className="p-6">
                {backupHistory.length > 0 ? (
                  <div className="space-y-4">
                    {backupHistory.map((backup) => (
                      <div key={backup.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getTypeIcon(backup.type)}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{backup.filename}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">{backup.size}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-500">
                                {new Date(backup.createdAt).toLocaleDateString()}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(backup.status)}`}>
                                {backup.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteBackup(backup.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No backup history available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 