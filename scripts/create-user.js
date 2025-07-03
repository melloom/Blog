require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');

// Database connection
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function createUser() {
  try {
    console.log('Creating user account...');
    
    const email = 'melvin.a.p.cruz@gmail.com';
    const password = 'Mel1747-';
    const name = 'Melvin Cruz';
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Insert the user
    await client.execute({
      sql: 'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      args: [email, hashedPassword, name, 'admin']
    });
    
    console.log('✅ User created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role: admin');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

createUser(); 