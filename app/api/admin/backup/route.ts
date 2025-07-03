import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getDb } from '@/lib/db'
import { posts, comments, categories, tags, users, settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get backup data
    const backupData = await getBackupData()
    
    return NextResponse.json({ backupData })
  } catch (error) {
    console.error('Error fetching backup data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, types } = await request.json()

    switch (action) {
      case 'export':
        return await exportBackup(types)
      case 'history':
        return await getBackupHistory()
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in backup operation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getBackupData() {
  try {
    const database = getDb()
    // Fetch all data from database
    const [postsData, commentsData, categoriesData, tagsData, usersData, settingsData] = await Promise.all([
      database.select().from(posts).all(),
      database.select().from(comments).all(),
      database.select().from(categories).all(),
      database.select().from(tags).all(),
      database.select().from(users).all(),
      database.select().from(settings).all()
    ])

    return {
      posts: postsData,
      comments: commentsData,
      categories: categoriesData,
      tags: tagsData,
      users: usersData,
      settings: settingsData
    }
  } catch (error) {
    console.error('Error fetching backup data:', error)
    throw error
  }
}

async function exportBackup(types: string[]) {
  try {
    const backupData = await getBackupData()
    
    // Filter data based on selected types
    const exportData: any = {}
    
    if (types.includes('posts')) exportData.posts = backupData.posts
    if (types.includes('comments')) exportData.comments = backupData.comments
    if (types.includes('categories')) exportData.categories = backupData.categories
    if (types.includes('tags')) exportData.tags = backupData.tags
    if (types.includes('users')) exportData.users = backupData.users
    if (types.includes('settings')) exportData.settings = backupData.settings

    // Add metadata
    exportData.metadata = {
      exportedAt: new Date().toISOString(),
      types: types,
      version: '1.0',
      totalRecords: Object.values(exportData).reduce((acc: number, val: any) => acc + (Array.isArray(val) ? val.length : 0), 0)
    }

    return NextResponse.json({ 
      success: true, 
      data: exportData,
      filename: `backup-${new Date().toISOString().split('T')[0]}-${types.join('-')}.json`
    })
  } catch (error) {
    console.error('Error exporting backup:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to export backup' 
    }, { status: 500 })
  }
}

async function getBackupHistory() {
  try {
    // In a real application, you would store backup history in the database
    // For now, we'll return mock data
    const mockHistory = [
      {
        id: '1',
        filename: 'backup-2024-01-15-full.json',
        size: '2.3 MB',
        type: 'full',
        createdAt: '2024-01-15T10:30:00Z',
        status: 'completed'
      },
      {
        id: '2',
        filename: 'backup-2024-01-14-posts.json',
        size: '1.1 MB',
        type: 'posts',
        createdAt: '2024-01-14T15:45:00Z',
        status: 'completed'
      },
      {
        id: '3',
        filename: 'backup-2024-01-13-comments.json',
        size: '456 KB',
        type: 'comments',
        createdAt: '2024-01-13T09:20:00Z',
        status: 'completed'
      }
    ]

    return NextResponse.json({ 
      success: true, 
      history: mockHistory 
    })
  } catch (error) {
    console.error('Error fetching backup history:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch backup history' 
    }, { status: 500 })
  }
} 