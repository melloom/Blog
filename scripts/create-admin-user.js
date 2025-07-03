require('dotenv').config({ path: '.env.local' });
const { drizzle } = require('drizzle-orm/libsql');
const { createClient } = require('@libsql/client');
const { sql } = require('drizzle-orm');
const bcrypt = require('bcryptjs');

// Database connection
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

async function createAdminUser() {
  try {
    console.log('Checking database connection...');
    console.log('Database URL:', process.env.TURSO_DATABASE_URL);
    
    // Check if users table exists
    const tables = await db.all(sql`SELECT name FROM sqlite_master WHERE type='table' AND name='users'`);
    
    if (tables.length === 0) {
      console.log('Users table does not exist. Creating it...');
      
      // Create users table
      await db.run(sql`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT DEFAULT 'editor',
          created_at INTEGER DEFAULT (unixepoch()),
          updated_at INTEGER DEFAULT (unixepoch())
        )
      `);
      
      console.log('Users table created successfully.');
    } else {
      console.log('Users table already exists.');
    }
    
    // Check if admin user exists
    const existingUser = await db.get(sql`SELECT * FROM users WHERE email = 'admin@example.com'`);
    
    if (!existingUser) {
      console.log('Creating admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await db.run(sql`
        INSERT INTO users (email, password, name, role)
        VALUES (?, ?, ?, ?)
      `, ['admin@example.com', hashedPassword, 'Admin User', 'admin']);
      
      console.log('Admin user created successfully!');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser(); 