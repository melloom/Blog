const fs = require('fs');
const path = require('path');

console.log('🚀 Vercel Environment Variables Formatter');
console.log('==========================================\n');

const jsonFile = process.argv[2];

if (!jsonFile) {
  console.log('❌ Please provide the JSON file name');
  console.log('Example: node scripts/format-for-vercel.js credentials.json');
  process.exit(1);
}

try {
  const jsonPath = path.join(process.cwd(), jsonFile);
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  const credentials = JSON.parse(jsonContent);
  
  console.log('✅ JSON parsed successfully!\n');
  
  console.log('📋 Copy these to Vercel Environment Variables:\n');
  console.log('GA4_CREDENTIALS_JSON=' + JSON.stringify(credentials));
  console.log('\n📝 Also add:');
  console.log('GA4_PROPERTY_ID=YOUR_PROPERTY_ID_HERE');
  console.log('NEXTAUTH_URL=https://your-domain.vercel.app');
  
} catch (error) {
  console.error('❌ Error:', error.message);
} 