import { getDb } from '@/lib/db';
import { anonymousUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

// Generate a secure random token for anonymous users
export function generateAnonymousToken(): string {
  return randomBytes(32).toString('hex');
}

// Get or create an anonymous user
export async function getOrCreateAnonymousUser(token?: string, userIp?: string) {
  if (token) {
    // Try to find existing anonymous user
    const existingUser = await getDb().select().from(anonymousUsers).where(eq(anonymousUsers.token, token)).get();
    if (existingUser) {
      // Update last seen
      await getDb().update(anonymousUsers)
        .set({ lastSeen: new Date() })
        .where(eq(anonymousUsers.id, existingUser.id));
      return existingUser;
    }
  }

  // Create new anonymous user
  const newToken = generateAnonymousToken();
  const newUser = await getDb().insert(anonymousUsers).values({
    token: newToken,
    userIp: userIp || null,
    lastSeen: new Date(),
  }).returning();

  return newUser[0];
}

// Validate anonymous user token
export async function validateAnonymousToken(token: string) {
  const user = await getDb().select().from(anonymousUsers).where(eq(anonymousUsers.token, token)).get();
  return user || null;
}

// Update anonymous user display name
export async function updateAnonymousUserDisplayName(token: string, displayName: string) {
  const user = await getDb().update(anonymousUsers)
    .set({ displayName, lastSeen: new Date() })
    .where(eq(anonymousUsers.token, token))
    .returning();
  
  return user[0] || null;
} 