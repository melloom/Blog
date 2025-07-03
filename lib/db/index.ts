import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Clean the auth token to remove any "Bearer " prefix
const cleanAuthToken = (token: string | undefined) => {
  if (!token) return token;
  return token.replace(/^Bearer\s+/i, '');
};

// Validate and clean the database URL
const getDatabaseUrl = () => {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error('TURSO_DATABASE_URL environment variable is not set');
  }
  
  // Remove any whitespace and ensure it starts with libsql://
  const cleanUrl = url.trim();
  if (!cleanUrl.startsWith('libsql://')) {
    throw new Error('TURSO_DATABASE_URL must start with libsql://');
  }
  
  return cleanUrl;
};

// Check if we're in a build environment
const isBuildTime = () => {
  return process.env.NODE_ENV === 'production' && !process.env.TURSO_DATABASE_URL;
};

// Only create the client if we have valid credentials and we're not in a problematic build context
const createDatabaseClient = () => {
  // If we're in build time and don't have database credentials, return null
  if (isBuildTime()) {
    console.warn('Database client not created: Missing environment variables during build');
    return null;
  }

  try {
    const url = getDatabaseUrl();
    const authToken = cleanAuthToken(process.env.TURSO_AUTH_TOKEN);
    
    return createClient({
      url,
      authToken,
    });
  } catch (error) {
    console.error('Database configuration error:', error);
    return null;
  }
};

const client = createDatabaseClient();

export const db = client ? drizzle(client, { schema }) : null;

// Safe database access function
export const getDb = () => {
  if (!db) {
    throw new Error('Database is not available. Check your environment variables.');
  }
  return db;
};

export type Database = typeof db; 