#!/usr/bin/env node

/**
 * Script to help set up environment variables in Vercel
 * Run this script to get the commands needed to set up your environment variables
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Vercel Environment Variables Setup\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('Please create a .env.local file with your environment variables first.');
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

console.log('📋 Environment variables found in .env.local:\n');

const requiredVars = [
  'TURSO_DATABASE_URL',
  'TURSO_AUTH_TOKEN',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'GA4_CREDENTIALS_JSON',
  'GA4_PROPERTY_ID'
];

const optionalVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'VERCEL_ANALYTICS_ID',
  'NEXT_PUBLIC_GOOGLE_ANALYTICS',
  'ANALYTICS_PROVIDER'
];

console.log('🔧 To set up these environment variables in Vercel, run the following commands:\n');

// Required variables
console.log('📝 Required Variables:');
requiredVars.forEach(varName => {
  if (envVars[varName]) {
    console.log(`vercel env add ${varName} production`);
    console.log(`vercel env add ${varName} preview`);
    console.log(`vercel env add ${varName} development`);
    console.log('');
  } else {
    console.log(`⚠️  ${varName} - NOT FOUND in .env.local`);
  }
});

// Optional variables
console.log('📝 Optional Variables:');
optionalVars.forEach(varName => {
  if (envVars[varName]) {
    console.log(`vercel env add ${varName} production`);
    console.log(`vercel env add ${varName} preview`);
    console.log(`vercel env add ${varName} development`);
    console.log('');
  }
});

console.log('💡 Alternative: You can also set these in the Vercel dashboard:');
console.log('1. Go to your project in Vercel dashboard');
console.log('2. Navigate to Settings > Environment Variables');
console.log('3. Add each variable manually');

console.log('\n🔍 For Google Analytics setup:');
console.log('1. Make sure GA4_CREDENTIALS_JSON contains your service account JSON');
console.log('2. Make sure GA4_PROPERTY_ID is your Google Analytics property ID');
console.log('3. Ensure the Google Analytics Data API is enabled in your Google Cloud project');

console.log('\n🔍 For Turso Database setup:');
console.log('1. Make sure TURSO_DATABASE_URL is your Turso database URL');
console.log('2. Make sure TURSO_AUTH_TOKEN is your Turso authentication token');

console.log('\n✅ After setting up the environment variables, redeploy your project:');
console.log('vercel --prod'); 