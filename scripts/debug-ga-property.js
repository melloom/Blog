#!/usr/bin/env node

/**
 * Debug script to verify Google Analytics property ID and test API connection
 */

const { BetaAnalyticsDataClient } = require('@google-analytics/data');

async function debugGAProperty() {
  console.log('🔍 Google Analytics Property Debug\n');

  // Check environment variables
  const credentialsJson = process.env.GA4_CREDENTIALS_JSON;
  const propertyId = process.env.GA4_PROPERTY_ID;

  if (!credentialsJson) {
    console.log('❌ GA4_CREDENTIALS_JSON not found in environment');
    return;
  }

  if (!propertyId) {
    console.log('❌ GA4_PROPERTY_ID not found in environment');
    return;
  }

  console.log('📋 Environment Variables:');
  console.log(`GA4_PROPERTY_ID: ${propertyId}`);
  console.log(`GA4_CREDENTIALS_JSON length: ${credentialsJson.length}`);
  console.log('');

  // Parse credentials
  let credentials;
  try {
    credentials = JSON.parse(credentialsJson);
    console.log('✅ Credentials parsed successfully');
    console.log(`Project ID: ${credentials.project_id}`);
    console.log(`Client Email: ${credentials.client_email}`);
    console.log('');
  } catch (error) {
    console.log('❌ Failed to parse credentials:', error.message);
    return;
  }

  // Test different property ID formats
  const propertyFormats = [
    propertyId, // Just the ID
    `properties/${propertyId}`, // With properties/ prefix
    `properties/${propertyId}`, // Double check
  ];

  console.log('🧪 Testing Property ID Formats:');
  propertyFormats.forEach((format, index) => {
    console.log(`${index + 1}. ${format}`);
  });
  console.log('');

  // Initialize client
  let analyticsDataClient;
  try {
    analyticsDataClient = new BetaAnalyticsDataClient({ credentials });
    console.log('✅ Analytics client initialized');
  } catch (error) {
    console.log('❌ Failed to initialize client:', error.message);
    return;
  }

  // Test API calls with different formats
  for (let i = 0; i < propertyFormats.length; i++) {
    const propertyFormat = propertyFormats[i];
    console.log(`\n🔬 Testing format ${i + 1}: ${propertyFormat}`);
    
    try {
      const response = await analyticsDataClient.runReport({
        property: propertyFormat,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [{ name: 'activeUsers' }]
      });
      
      console.log(`✅ SUCCESS! Found ${response[0].rows?.length || 0} rows`);
      console.log(`📊 Data:`, response[0].rows?.[0]?.metricValues?.[0]?.value || 'No data');
      
      // If this works, this is the correct format
      console.log(`\n🎉 CORRECT FORMAT FOUND: ${propertyFormat}`);
      console.log(`Use this format in your environment variables.`);
      
      return;
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      
      if (error.message.includes('404')) {
        console.log('   → Property not found. Check if the property ID is correct.');
      } else if (error.message.includes('403')) {
        console.log('   → Access denied. Check service account permissions.');
      } else if (error.message.includes('INVALID_ARGUMENT')) {
        console.log('   → Invalid argument. Check property ID format.');
      }
    }
  }

  console.log('\n❌ All formats failed. Please check:');
  console.log('1. Property ID is correct');
  console.log('2. Service account has access to the property');
  console.log('3. Google Analytics Data API is enabled');
  console.log('4. Property is a GA4 property (not Universal Analytics)');
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

debugGAProperty().catch(console.error); 