#!/usr/bin/env node

/**
 * Script to split GA4_CREDENTIALS_JSON into multiple environment variables
 * This helps with Vercel's environment variable length limits
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Splitting GA4_CREDENTIALS_JSON for Vercel\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  process.exit(1);
}

// Read .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key] = valueParts.join('=');
    }
  }
});

const credentialsJson = envVars.GA4_CREDENTIALS_JSON;
if (!credentialsJson) {
  console.log('❌ GA4_CREDENTIALS_JSON not found in .env.local');
  process.exit(1);
}

// Parse the credentials
let credentials;
try {
  credentials = JSON.parse(credentialsJson);
} catch (error) {
  console.log('❌ Failed to parse GA4_CREDENTIALS_JSON:', error.message);
  process.exit(1);
}

console.log('📋 Original credentials length:', credentialsJson.length);
console.log('✅ Credentials parsed successfully\n');

// Split into multiple environment variables
const splitCredentials = {
  GA4_TYPE: credentials.type,
  GA4_PROJECT_ID: credentials.project_id,
  GA4_PRIVATE_KEY_ID: credentials.private_key_id,
  GA4_PRIVATE_KEY: credentials.private_key,
  GA4_CLIENT_EMAIL: credentials.client_email,
  GA4_CLIENT_ID: credentials.client_id,
  GA4_AUTH_URI: credentials.auth_uri,
  GA4_TOKEN_URI: credentials.token_uri,
  GA4_AUTH_PROVIDER_X509_CERT_URL: credentials.auth_provider_x509_cert_url,
  GA4_CLIENT_X509_CERT_URL: credentials.client_x509_cert_url,
  GA4_UNIVERSE_DOMAIN: credentials.universe_domain
};

console.log('🔧 Split Environment Variables:\n');

Object.entries(splitCredentials).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
  console.log(`Length: ${value.length} characters\n`);
});

// Create a new .env.local with split variables
const newEnvContent = envContent.replace(
  /GA4_CREDENTIALS_JSON=.*/,
  Object.entries(splitCredentials)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
);

// Write the new .env.local
fs.writeFileSync(envPath + '.split', newEnvContent);

console.log('✅ Split credentials saved to .env.local.split');
console.log('📝 You can now use these individual variables in Vercel:');
console.log('');

Object.keys(splitCredentials).forEach(key => {
  console.log(`vercel env add ${key} production`);
});

console.log('\n💡 Then update your analytics API to reconstruct the credentials from these variables.');
console.log('📁 Check .env.local.split for the updated environment file.'); 