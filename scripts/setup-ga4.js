const fs = require('fs');
const path = require('path');

console.log('🔧 Google Analytics 4 Setup Helper');
console.log('=====================================\n');

console.log('📋 Instructions:');
console.log('1. Download your service account JSON file from Google Cloud Console');
console.log('2. Place it in the root directory of your project');
console.log('3. Run this script with: node scripts/setup-ga4.js <filename.json>\n');

const jsonFile = process.argv[2];

if (!jsonFile) {
  console.log('❌ Please provide the JSON file name as an argument');
  console.log('Example: node scripts/setup-ga4.js my-credentials.json');
  process.exit(1);
}

try {
  // Read the JSON file
  const jsonPath = path.join(process.cwd(), jsonFile);
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  
  // Parse to validate JSON
  const credentials = JSON.parse(jsonContent);
  
  // Format for .env.local
  const formattedJson = JSON.stringify(credentials)
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
  
  console.log('✅ JSON file parsed successfully!\n');
  
  console.log('📝 Add these lines to your .env.local file:\n');
  console.log(`GA4_PROPERTY_ID=YOUR_PROPERTY_ID_HERE`);
  console.log(`GA4_CREDENTIALS_JSON="${formattedJson}"\n`);
  
  console.log('🔍 Your service account email is:', credentials.client_email);
  console.log('📊 Make sure to grant this email access to your GA4 property!\n');
  
  console.log('📖 Next steps:');
  console.log('1. Replace YOUR_PROPERTY_ID_HERE with your actual GA4 Property ID');
  console.log('2. Copy the GA4_CREDENTIALS_JSON line to your .env.local file');
  console.log('3. Restart your development server');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\n💡 Make sure the JSON file exists and is valid JSON format');
} 