import { defineConfig } from 'drizzle-kit';

// Clean the auth token to remove any "Bearer " prefix
const cleanAuthToken = (token: string | undefined) => {
  if (!token) return token;
  return token.replace(/^Bearer\s+/i, '');
};

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: cleanAuthToken(process.env.TURSO_AUTH_TOKEN),
  },
}); 