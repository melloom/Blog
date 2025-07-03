import { defineConfig } from 'drizzle-kit';

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

// Only create config if we have the required environment variables
const createConfig = () => {
  try {
    return {
      schema: './lib/db/schema.ts',
      out: './lib/db/migrations',
      driver: 'turso' as const,
      dbCredentials: {
        url: getDatabaseUrl(),
        authToken: cleanAuthToken(process.env.TURSO_AUTH_TOKEN),
      },
    };
  } catch (error) {
    console.error('Drizzle config error:', error);
    // Return a minimal config for build time
    return {
      schema: './lib/db/schema.ts',
      out: './lib/db/migrations',
      driver: 'turso' as const,
      dbCredentials: {
        url: 'libsql://placeholder.turso.io',
        authToken: 'placeholder',
      },
    };
  }
};

export default defineConfig(createConfig()); 