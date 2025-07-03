import { NextRequest, NextResponse } from 'next/server'
import { getTagsWithCounts } from '@/lib/db/tags'

// GET /api/tags - Get all tags with post counts
export async function GET(
  request: NextRequest,
  { searchParams }: { searchParams: URLSearchParams }
) {
  try {
    // During static generation, searchParams might be undefined or empty
    // Provide safe defaults to avoid dynamic server usage
    let status = 'published'
    let limit = 10
    
    // Only try to read searchParams if they exist and we're not in static generation
    if (searchParams && typeof searchParams.get === 'function') {
      const statusParam = searchParams.get('status')
      const limitParam = searchParams.get('limit')
      
      if (statusParam) status = statusParam
      if (limitParam) {
        const parsedLimit = parseInt(limitParam)
        if (!isNaN(parsedLimit)) limit = parsedLimit
      }
    }
    
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