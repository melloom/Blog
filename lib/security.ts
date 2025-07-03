import { dbNonNull as db } from '@/lib/db'
import { securityEvents, blockedIPs } from '@/lib/db/schema'
import { eq, desc, count, and, gte } from 'drizzle-orm'

export interface SecurityEvent {
  id?: number
  type: 'failed_login' | 'suspicious_ip' | 'brute_force' | 'spam_comment' | 'file_access' | 'api_abuse'
  ip: string
  userAgent?: string
  details: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
  resolved?: boolean
}

export interface SecurityStats {
  totalEvents: number
  eventsLast24h: number
  eventsLast7d: number
  failedLogins: number
  suspiciousIPs: number
  blockedIPs: number
  securityScore: number
}

export interface IPReputation {
  ip: string
  reputation: number
  abuseConfidence: number
  country: string
  isp: string
  isBlocked: boolean
  lastSeen: Date
  threatTypes: string[]
}

export interface SSLCertificate {
  domain: string
  valid: boolean
  expiresAt: Date
  issuer: string
  grade: string
  daysUntilExpiry: number
}

export interface DatabaseHealth {
  status: 'healthy' | 'warning' | 'critical'
  connectionCount: number
  slowQueries: number
  errorRate: number
  lastBackup: Date
  backupSize: string
}

// Track failed login attempts
export async function trackFailedLogin(ip: string, userAgent?: string, details?: string) {
  try {
    await db.insert(securityEvents).values({
      type: 'failed_login',
      ip,
      userAgent,
      details: details || 'Failed login attempt',
      severity: 'medium',
      timestamp: new Date(),
      resolved: false
    })

    // Check if this IP has too many failed attempts
    const recentFailures = await db
      .select({ count: count() })
      .from(securityEvents)
      .where(
        and(
          eq(securityEvents.type, 'failed_login'),
          eq(securityEvents.ip, ip),
          gte(securityEvents.timestamp, new Date(Date.now() - 15 * 60 * 1000)) // Last 15 minutes
        )
      )
      .all()

    const failureCount = recentFailures[0]?.count || 0

    if (failureCount >= 5) {
      // Auto-block IP after 5 failed attempts in 15 minutes
      await db.insert(blockedIPs).values({
        ipAddress: ip,
        reason: 'Multiple failed login attempts',
        blockedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Block for 24 hours
      }).onConflictDoNothing()

      // Log as high severity event
      await db.insert(securityEvents).values({
        type: 'brute_force',
        ip,
        userAgent,
        details: `IP blocked due to ${failureCount} failed login attempts`,
        severity: 'high',
        timestamp: new Date(),
        resolved: false
      })
    }
  } catch (error) {
    console.error('Error tracking failed login:', error)
  }
}

// Track suspicious IP patterns
export async function trackSuspiciousIP(ip: string, pattern: string, userAgent?: string) {
  try {
    await db.insert(securityEvents).values({
      type: 'suspicious_ip',
      ip,
      userAgent,
      details: `Suspicious pattern detected: ${pattern}`,
      severity: 'medium',
      timestamp: new Date(),
      resolved: false
    })
  } catch (error) {
    console.error('Error tracking suspicious IP:', error)
  }
}

// Get security statistics
export async function getSecurityStats(): Promise<SecurityStats> {
  try {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [totalEvents, eventsLast24h, eventsLast7d, failedLogins, suspiciousIPs, blockedIPsCount] = await Promise.all([
      db.select({ count: count() }).from(securityEvents).all(),
      db.select({ count: count() }).from(securityEvents).where(gte(securityEvents.timestamp, last24h)).all(),
      db.select({ count: count() }).from(securityEvents).where(gte(securityEvents.timestamp, last7d)).all(),
      db.select({ count: count() }).from(securityEvents).where(eq(securityEvents.type, 'failed_login')).all(),
      db.select({ count: count() }).from(securityEvents).where(eq(securityEvents.type, 'suspicious_ip')).all(),
      db.select({ count: count() }).from(blockedIPs).all()
    ])

    // Calculate security score (0-100)
    const recentEvents = eventsLast24h[0]?.count || 0
    const securityScore = Math.max(0, 100 - (recentEvents * 5) - ((failedLogins[0]?.count || 0) * 2))

    return {
      totalEvents: totalEvents[0]?.count || 0,
      eventsLast24h: eventsLast24h[0]?.count || 0,
      eventsLast7d: eventsLast7d[0]?.count || 0,
      failedLogins: failedLogins[0]?.count || 0,
      suspiciousIPs: suspiciousIPs[0]?.count || 0,
      blockedIPs: blockedIPsCount[0]?.count || 0,
      securityScore: Math.round(securityScore)
    }
  } catch (error) {
    console.error('Error getting security stats:', error)
    return {
      totalEvents: 0,
      eventsLast24h: 0,
      eventsLast7d: 0,
      failedLogins: 0,
      suspiciousIPs: 0,
      blockedIPs: 0,
      securityScore: 100
    }
  }
}

// Get recent security events
export async function getRecentSecurityEvents(limit: number = 50): Promise<SecurityEvent[]> {
  try {
    const events = await db
      .select()
      .from(securityEvents)
      .orderBy(desc(securityEvents.timestamp))
      .limit(limit)
      .all()

    return events.map(event => ({
      id: event.id,
      type: event.type as SecurityEvent['type'],
      ip: event.ip,
      userAgent: event.userAgent || undefined,
      details: event.details,
      severity: event.severity as SecurityEvent['severity'],
      timestamp: event.timestamp || new Date(),
      resolved: event.resolved || false
    }))
  } catch (error) {
    console.error('Error getting recent security events:', error)
    return []
  }
}

// Check IP reputation using AbuseIPDB (mock implementation)
export async function checkIPReputation(ip: string): Promise<IPReputation> {
  try {
    // In a real implementation, you would call the AbuseIPDB API
    // For now, we'll simulate the response
    const isBlocked = await db
      .select()
      .from(blockedIPs)
      .where(eq(blockedIPs.ipAddress, ip))
      .all()

    // Simulate reputation check
    const reputation = Math.random() * 100
    const abuseConfidence = Math.random() * 100

    return {
      ip,
      reputation: Math.round(reputation),
      abuseConfidence: Math.round(abuseConfidence),
      country: 'Unknown',
      isp: 'Unknown',
      isBlocked: isBlocked.length > 0,
      lastSeen: new Date(),
      threatTypes: abuseConfidence > 50 ? ['Suspicious Activity'] : []
    }
  } catch (error) {
    console.error('Error checking IP reputation:', error)
    return {
      ip,
      reputation: 0,
      abuseConfidence: 100,
      country: 'Unknown',
      isp: 'Unknown',
      isBlocked: false,
      lastSeen: new Date(),
      threatTypes: ['Error checking reputation']
    }
  }
}

// Check SSL certificate health (mock implementation)
export async function checkSSLCertificate(domain: string): Promise<SSLCertificate> {
  try {
    // In a real implementation, you would check the actual SSL certificate
    // For now, we'll simulate the response
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    const daysUntilExpiry = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

    return {
      domain,
      valid: daysUntilExpiry > 0,
      expiresAt,
      issuer: 'Let\'s Encrypt',
      grade: daysUntilExpiry > 7 ? 'A' : daysUntilExpiry > 1 ? 'B' : 'C',
      daysUntilExpiry
    }
  } catch (error) {
    console.error('Error checking SSL certificate:', error)
    return {
      domain,
      valid: false,
      expiresAt: new Date(),
      issuer: 'Unknown',
      grade: 'F',
      daysUntilExpiry: 0
    }
  }
}

// Check database health
export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  try {
    // Test database connection
    await db.select().from(securityEvents).limit(1).all()

    // Get recent backup info (mock)
    const lastBackup = new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago

    return {
      status: 'healthy',
      connectionCount: 1,
      slowQueries: 0,
      errorRate: 0,
      lastBackup,
      backupSize: '2.5 MB'
    }
  } catch (error) {
    console.error('Error checking database health:', error)
    return {
      status: 'critical',
      connectionCount: 0,
      slowQueries: 0,
      errorRate: 100,
      lastBackup: new Date(),
      backupSize: '0 MB'
    }
  }
}

// Check for data breaches using HaveIBeenPwned (mock implementation)
export async function checkDataBreach(email: string): Promise<{ breached: boolean; breaches: string[] }> {
  try {
    // In a real implementation, you would call the HaveIBeenPwned API
    // For now, we'll simulate the response
    const breaches = Math.random() > 0.8 ? ['Adobe', 'LinkedIn'] : []
    
    return {
      breached: breaches.length > 0,
      breaches
    }
  } catch (error) {
    console.error('Error checking data breach:', error)
    return {
      breached: false,
      breaches: []
    }
  }
}

// Check URL/IP for threats using VirusTotal (mock implementation)
export async function checkThreat(urlOrIP: string): Promise<{ malicious: boolean; threatTypes: string[] }> {
  try {
    // In a real implementation, you would call the VirusTotal API
    // For now, we'll simulate the response
    const malicious = Math.random() > 0.95 // 5% chance of being malicious
    const threatTypes = malicious ? ['Malware', 'Phishing'] : []
    
    return {
      malicious,
      threatTypes
    }
  } catch (error) {
    console.error('Error checking threat:', error)
    return {
      malicious: false,
      threatTypes: ['Error checking threat']
    }
  }
} 