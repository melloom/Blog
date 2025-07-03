import { NextRequest, NextResponse } from 'next/server'
import { 
  getSecurityStats, 
  getRecentSecurityEvents, 
  checkIPReputation, 
  checkSSLCertificate, 
  checkDatabaseHealth,
  checkDataBreach,
  checkThreat,
  trackFailedLogin,
  trackSuspiciousIP
} from '@/lib/security'

// GET /api/admin/security - Get comprehensive security data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const ip = searchParams.get('ip')
    const domain = searchParams.get('domain')
    const email = searchParams.get('email')
    const url = searchParams.get('url')

    switch (action) {
      case 'stats':
        const securityStats = await getSecurityStats()
        return NextResponse.json({ stats: securityStats })

      case 'events':
        const securityEvents = await getRecentSecurityEvents(50)
        return NextResponse.json({ events: securityEvents })

      case 'ip-reputation':
        if (!ip) {
          return NextResponse.json({ error: 'IP address required' }, { status: 400 })
        }
        const ipReputation = await checkIPReputation(ip)
        return NextResponse.json({ reputation: ipReputation })

      case 'ssl-check':
        if (!domain) {
          return NextResponse.json({ error: 'Domain required' }, { status: 400 })
        }
        const sslCertificate = await checkSSLCertificate(domain)
        return NextResponse.json({ ssl: sslCertificate })

      case 'database-health':
        const databaseHealth = await checkDatabaseHealth()
        return NextResponse.json({ dbHealth: databaseHealth })

      case 'data-breach':
        if (!email) {
          return NextResponse.json({ error: 'Email required' }, { status: 400 })
        }
        const dataBreach = await checkDataBreach(email)
        return NextResponse.json({ breach: dataBreach })

      case 'threat-check':
        if (!url) {
          return NextResponse.json({ error: 'URL or IP required' }, { status: 400 })
        }
        const threatInfo = await checkThreat(url)
        return NextResponse.json({ threat: threatInfo })

      case 'comprehensive':
        // Get all security data at once
        const [comprehensiveStats, recentSecurityEvents, comprehensiveDbHealth] = await Promise.all([
          getSecurityStats(),
          getRecentSecurityEvents(20),
          checkDatabaseHealth()
        ])

        return NextResponse.json({
          stats: comprehensiveStats,
          recentEvents: recentSecurityEvents,
          databaseHealth: comprehensiveDbHealth,
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in security API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/security - Track security events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ip, userAgent, details, pattern } = body

    switch (action) {
      case 'track-failed-login':
        if (!ip) {
          return NextResponse.json({ error: 'IP address required' }, { status: 400 })
        }
        await trackFailedLogin(ip, userAgent, details)
        return NextResponse.json({ message: 'Failed login tracked' })

      case 'track-suspicious-ip':
        if (!ip || !pattern) {
          return NextResponse.json({ error: 'IP and pattern required' }, { status: 400 })
        }
        await trackSuspiciousIP(ip, pattern, userAgent)
        return NextResponse.json({ message: 'Suspicious IP tracked' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error tracking security event:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 