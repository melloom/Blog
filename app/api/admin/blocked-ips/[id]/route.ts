import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blockedIPs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// DELETE /api/admin/blocked-ips/[id] - Unblock an IP address
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const deletedBlock = await db
      .delete(blockedIPs)
      .where(eq(blockedIPs.id, Number(id)))
      .returning();

    if (deletedBlock.length === 0) {
      return NextResponse.json({ error: 'Blocked IP not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'IP address unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking IP:', error);
    return NextResponse.json({ error: 'Failed to unblock IP' }, { status: 500 });
  }
} 