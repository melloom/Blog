#!/usr/bin/env node

/**
 * Script to format Google Analytics credentials for Vercel environment variables
 * Run with: node scripts/setup-ga4-env.js
 */

const fs = require('fs');
const path = require('path');

// Your Google Analytics service account credentials
const GA4_CREDENTIALS = {
  type: "service_account",
  project_id: "blog-35025",
  private_key_id: "6e360e35bf0e49f54f916c650d03fec01d2bc820",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD1+zqlg+pMHBqV\nNlw5jlFqRtLiHL+o+UJrWxGPncJBiaTHSRrdZ+SxNTy/COD3H7urJlGSVORwApPz\nYz38863DeHfqnAorVEOQdENeb8odLYdDNrlnMavYOEZY2kpQ8Vj58qjvsweik3TR\nj7QFG4wiOIkYvIOKmF3MxZZ68Wss1aceJa0qq+BUsemCmh3AL5HktZRITMEoPBmc\nP/kIT1kKsZqhimTaxfUH1o3GQWpaABCnp+0uCMNWFchQKcUjYWP0oHcO/oDghCyB\nIUWyTbnmaYRSQVqOZk2YyjRrxs+ITyDgkkNaZcToP0bQhqSzrzGZDZzc2bu3SF04\np8WdPTGTAgMBAAECggEAK2msB5M5EjaxkF0YOMY/4zhdtq9pOhrH2KepeUXYB3YS\nAWQLHEFeUNI7BuI7xhGxLvsj0WYvLP+fegitY4vkQofr7hmdB9mm1QNX8n5bVvv2\nj+vEHAzdrdr8u2jHTfLSh8aGf0uDEPPiXav1kyMx/8YnmBiJRLgwcdf7f3ZFOpOg\nBtOLsb39bf/iCUHKR5+gtWbwSwcVsGGDO21Wjg4deaI7naoHaQcm9Pupk58qP6N3\n+AbQTOY8Pv7xVILbDU381DrB2+4c8lkexuLlqw1ImQ1aSYdsHSne3+bvmIRkzGhE\nfP514+ohuRAB5jXbHh4TOh4eGNuS+Nkqx1fslzDTtQKBgQD9KQYd1fOHZNcWWMiy\n3sJ6ulbp+9SSGc87lPJfP2X9f3F0r00U42tHtzdl40aKyPRb6BA8wHP4b3MkQooT\nyHbtMygaNsxJsAN32OX+DYFaQtbssBEzEtHemK54dDXDPJ4gCikqlAO38H2HERI2\n5JrYAjJCZ2LKnKVfjPtrUgperwKBgQD4vZccNiDdvAYSXFcWluJ3AuR8xakouiOH\nCVwkdfQoY6whCPd+FwOP8+Hc7WYy0uLhK1FuoiKM7HlmagZEKLTgkXkc/Kv4p2NX\n+b49Kjo857ALLk6HSHQE5oE5gXzmbkLzJ1RZidwy8YsgOzowqAWRkfU1/AGyVj+f\nXLWu5Ob0XQKBgQCGbm9qDn/IKNsyaakBmtqo8yROEcUaZAwwdnKR84eEKlWkAaar\n7eu85GTNfPeroPRpjXx51jR++yeoXJEX2j6UzLKB4RFwG8BrtsjCtIc41/9rJj+r\n4FWDn44eNo+KAjlxiBO+IWUsGs99lqoWbiRvihMIQgAq2S3T5Hhpz+HjzwKBgQCH\ndG9a3JsvRNolm4WNdqNi3f9hdx50YFFCkzVLYbSRXh35a3Gjh5LYDJ6d+eXinXcR\n2c4hqkeYaJp/zBMXgPdnJ7FFuM9JvJXb7dPMaTeHvT/gBtqazzjnBkOu9jX3Impx\nEaTckbeJQoJaDgbVQlqt+EcJm++sl01UUl9aG6stvQKBgHl6o43n2M6fw0brHvTj\nnsJErKk7nrs6/GycJURTvym5U21TqBn82ULv2NrjnlCZnrfcoBALPNlGLQvnDal8\nPUsKZDp6Zi7yH/4EP0qBDQgCjfjLW5aM4PYysZhNf2+2KDKGgEtJhQDg5VBGqANv\n/F1e1s0EeA9Ojv9UWGelmy8m\n-----END PRIVATE KEY-----\n",
  client_email: "analytics-service-account@blog-35025.iam.gserviceaccount.com",
  client_id: "115194085311567209849",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/analytics-service-account%40blog-35025.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// You need to set this to your actual GA4 property ID
const GA4_PROPERTY_ID = "YOUR_GA4_PROPERTY_ID"; // Replace with your actual property ID

function generateEnvironmentVariables() {
  console.log('🔧 Generating Google Analytics Environment Variables for Vercel...\n');
  
  // Format the credentials JSON as a single line with escaped quotes
  const credentialsJson = JSON.stringify(GA4_CREDENTIALS).replace(/"/g, '\\"');
  
  const envVars = {
    // Individual credential fields (alternative approach)
    GA4_TYPE: GA4_CREDENTIALS.type,
    GA4_PROJECT_ID: GA4_CREDENTIALS.project_id,
    GA4_PRIVATE_KEY_ID: GA4_CREDENTIALS.private_key_id,
    GA4_PRIVATE_KEY: GA4_CREDENTIALS.private_key,
    GA4_CLIENT_EMAIL: GA4_CREDENTIALS.client_email,
    GA4_CLIENT_ID: GA4_CREDENTIALS.client_id,
    GA4_AUTH_URI: GA4_CREDENTIALS.auth_uri,
    GA4_TOKEN_URI: GA4_CREDENTIALS.token_uri,
    GA4_AUTH_PROVIDER_X509_CERT_URL: GA4_CREDENTIALS.auth_provider_x509_cert_url,
    GA4_CLIENT_X509_CERT_URL: GA4_CREDENTIALS.client_x509_cert_url,
    GA4_UNIVERSE_DOMAIN: GA4_CREDENTIALS.universe_domain,
    
    // Property ID
    GA4_PROPERTY_ID: GA4_PROPERTY_ID,
    
    // Alternative: Single JSON string (if your API expects this format)
    GA4_CREDENTIALS_JSON: credentialsJson
  };
  
  console.log('📋 Copy these environment variables to your Vercel dashboard:\n');
  console.log('='.repeat(80));
  
  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });
  
  console.log('='.repeat(80));
  
  // Also generate a .env.local file for local development
  const envLocalContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  const envLocalPath = path.join(process.cwd(), '.env.local');
  
  try {
    fs.writeFileSync(envLocalPath, envLocalContent);
    console.log(`\n✅ Created .env.local file at: ${envLocalPath}`);
  } catch (error) {
    console.log(`\n⚠️  Could not create .env.local file: ${error.message}`);
  }
  
  console.log('\n📝 Instructions:');
  console.log('1. Replace YOUR_GA4_PROPERTY_ID with your actual GA4 property ID');
  console.log('2. Copy the environment variables above to your Vercel dashboard');
  console.log('3. Go to your Vercel project → Settings → Environment Variables');
  console.log('4. Add each variable with the exact name and value shown above');
  console.log('5. Redeploy your application');
  
  console.log('\n🔍 To find your GA4 Property ID:');
  console.log('1. Go to Google Analytics (analytics.google.com)');
  console.log('2. Select your property');
  console.log('3. Go to Admin → Property Settings');
  console.log('4. Copy the Property ID (format: 123456789)');
}

function validateCredentials() {
  console.log('🔍 Validating Google Analytics Credentials...\n');
  
  const requiredFields = [
    'type', 'project_id', 'private_key_id', 'private_key', 
    'client_email', 'client_id', 'auth_uri', 'token_uri',
    'auth_provider_x509_cert_url', 'client_x509_cert_url', 'universe_domain'
  ];
  
  const missing = [];
  
  for (const field of requiredFields) {
    if (!GA4_CREDENTIALS[field]) {
      missing.push(field);
    }
  }
  
  if (missing.length > 0) {
    console.log(`❌ Missing required fields: ${missing.join(', ')}`);
    return false;
  }
  
  console.log('✅ All required credential fields are present');
  console.log(`✅ Project ID: ${GA4_CREDENTIALS.project_id}`);
  console.log(`✅ Client Email: ${GA4_CREDENTIALS.client_email}`);
  
  if (GA4_PROPERTY_ID === "YOUR_GA4_PROPERTY_ID") {
    console.log('⚠️  Please set your actual GA4 Property ID');
  } else {
    console.log(`✅ Property ID: ${GA4_PROPERTY_ID}`);
  }
  
  return true;
}

// Main execution
function main() {
  console.log('🚀 Google Analytics 4 Setup Script\n');
  
  if (validateCredentials()) {
    generateEnvironmentVariables();
  } else {
    console.log('\n❌ Please fix the missing credential fields before proceeding.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateEnvironmentVariables, validateCredentials }; 