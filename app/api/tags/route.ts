import { NextRequest, NextResponse } from 'next/server'
import { getTagsWithCounts } from '@/lib/db/tags'

// GET /api/tags - Get all tags with post counts
export async function GET(
  request: NextRequest,
  { searchParams }: { searchParams: URLSearchParams }
) {
  try {
    // Handle case where searchParams might be undefined during static generation
    const status = searchParams?.get('status') || 'published'
    const limit = parseInt(searchParams?.get('limit') || '10')
    
    const filteredTags = await getTagsWithCounts({ status, limit })
    return NextResponse.json(filteredTags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
} 