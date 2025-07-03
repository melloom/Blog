#!/usr/bin/env node

/**
 * Test script to verify Google Analytics integration
 * Run with: node scripts/test-analytics.js
 */

const https = require('https');
const http = require('http');

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
  endpoints: [
    '/api/admin/analytics?provider=google&range=7d',
    '/api/admin/analytics?provider=internal&range=7d'
  ]
};

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data,
            error: 'Failed to parse JSON'
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testAnalytics() {
  console.log('🔍 Testing Analytics API Endpoints...\n');
  console.log(`Base URL: ${TEST_CONFIG.baseUrl}\n`);
  
  for (const endpoint of TEST_CONFIG.endpoints) {
    const url = `${TEST_CONFIG.baseUrl}${endpoint}`;
    console.log(`📊 Testing: ${endpoint}`);
    
    try {
      const result = await makeRequest(url);
      
      if (result.status === 200) {
        console.log(`✅ Status: ${result.status} - Success`);
        
        // Check if we got analytics data
        if (result.data && typeof result.data === 'object') {
          const hasData = result.data.totalPosts !== undefined || 
                         result.data.totalViews !== undefined ||
                         result.data.gaData !== undefined;
          
          if (hasData) {
            console.log(`📈 Data received:`, {
              totalPosts: result.data.totalPosts,
              totalViews: result.data.totalViews,
              provider: result.data.provider,
              hasGoogleData: !!result.data.gaData
            });
          } else {
            console.log(`⚠️  No analytics data structure found`);
          }
        } else {
          console.log(`⚠️  Unexpected response format`);
        }
      } else {
        console.log(`❌ Status: ${result.status} - Error`);
        if (result.data && result.data.error) {
          console.log(`   Error: ${result.data.error}`);
        }
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
  
  console.log('🏁 Analytics test completed!');
}

// Check if environment variables are set
function checkEnvironmentVariables() {
  console.log('🔧 Checking Environment Variables...\n');
  
  const requiredVars = [
    'GA4_TYPE',
    'GA4_PROJECT_ID', 
    'GA4_PRIVATE_KEY_ID',
    'GA4_PRIVATE_KEY',
    'GA4_CLIENT_EMAIL',
    'GA4_CLIENT_ID',
    'GA4_AUTH_URI',
    'GA4_TOKEN_URI',
    'GA4_AUTH_PROVIDER_X509_CERT_URL',
    'GA4_CLIENT_X509_CERT_URL',
    'GA4_UNIVERSE_DOMAIN',
    'GA4_PROPERTY_ID'
  ];
  
  const missing = [];
  const present = [];
  
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  }
  
  console.log(`✅ Present (${present.length}): ${present.join(', ')}`);
  console.log(`❌ Missing (${missing.length}): ${missing.join(', ')}`);
  
  if (missing.length > 0) {
    console.log('\n⚠️  Some Google Analytics environment variables are missing!');
    console.log('   Make sure to set all required variables in your Vercel environment.');
  } else {
    console.log('\n✅ All Google Analytics environment variables are set!');
  }
  
  console.log('');
}

// Main execution
async function main() {
  checkEnvironmentVariables();
  await testAnalytics();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testAnalytics, checkEnvironmentVariables }; 