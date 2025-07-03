import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { blockedIPs } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

const database = getDb();

// GET /api/admin/blocked-ips - Get all blocked IPs
export async function GET(request: NextRequest) {
  try {
    const allBlockedIPs = await database
      .select({
        id: blockedIPs.id,
        ipAddress: blockedIPs.ipAddress,
        reason: blockedIPs.reason,
        blockedBy: blockedIPs.blockedBy,
        blockedAt: blockedIPs.blockedAt,
      })
      .from(blockedIPs)
      .orderBy(desc(blockedIPs.blockedAt))
      .all();

    return NextResponse.json({ blockedIPs: allBlockedIPs });
  } catch (error) {
    console.error('Error fetching blocked IPs:', error);
    return NextResponse.json({ error: 'Failed to fetch blocked IPs' }, { status: 500 });
  }
}

// POST /api/admin/blocked-ips - Block a new IP address
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ipAddress, reason } = body;

    if (!ipAddress || !reason) {
      return NextResponse.json({ error: 'IP address and reason are required' }, { status: 400 });
    }

    // Check if IP is already blocked
    const existingBlock = await database
      .select()
      .from(blockedIPs)
      .where(eq(blockedIPs.ipAddress, ipAddress))
      .get();

    if (existingBlock) {
      return NextResponse.json({ error: 'IP address is already blocked' }, { status: 409 });
    }

    const newBlockedIP = await database
      .insert(blockedIPs)
      .values({
        ipAddress,
        reason,
        blockedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ blockedIP: newBlockedIP[0] }, { status: 201 });
  } catch (error) {
    console.error('Error blocking IP:', error);
    return NextResponse.json({ error: 'Failed to block IP' }, { status: 500 });
  }
} 