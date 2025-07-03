require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');

// Database connection
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function checkUser() {
  try {
    console.log('Checking user credentials...');
    
    const email = 'melvin.a.p.cruz@gmail.com';
    const password = 'Mel1747-';
    
    // Check if user exists using raw client
    const result = await client.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });
    
    if (result.rows.length === 0) {
      console.log('❌ User not found in database');
      return;
    }
    
    const user = result.rows[0];
    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
    
    // Test password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (isValidPassword) {
      console.log('✅ Password is correct');
    } else {
      console.log('❌ Password is incorrect');
      console.log('Current password hash:', user.password);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkUser(); 