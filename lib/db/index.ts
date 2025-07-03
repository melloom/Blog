import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Clean the auth token to remove any "Bearer " prefix
const cleanAuthToken = (token: string | undefined) => {
  if (!token) return token;
  return token.replace(/^Bearer\s+/i, '');
};

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: cleanAuthToken(process.env.TURSO_AUTH_TOKEN),
});

export const db = drizzle(client, { schema });

export type Database = typeof db; 