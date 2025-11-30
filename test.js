const http = require('http');

console.log('🧪 Testing Review Scraper Service...\n');

// Test 1: Health Check
console.log('[Test 1] Health Check');
http.get('http://localhost:3000/health', (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.status === 'ok') {
        console.log('✅ Service is running');
        console.log(`   Version: ${result.version}`);
      } else {
        console.log('❌ Service returned unexpected response');
      }
    } catch (e) {
      console.log('❌ Failed to parse response');
    }
    console.log('');
    
    // Test 2: API Authentication
    testAuthentication();
  });
}).on('error', (err) => {
  console.log('❌ Service is not running');
  console.log(`   Error: ${err.message}`);
  console.log('\n💡 Start the service with: npm start');
  process.exit(1);
});

function testAuthentication() {
  console.log('[Test 2] API Authentication');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/scrape/google',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'wrong-key'
    }
  };
  
  const req = http.request(options, (res) => {
    if (res.statusCode === 401) {
      console.log('✅ Authentication is working');
      console.log('   (Correctly rejected invalid API key)');
    } else {
      console.log('⚠️  Authentication might not be configured');
    }
    console.log('');
    
    // Test 3: Environment Check
    testEnvironment();
  });
  
  req.on('error', (err) => {
    console.log('❌ Request failed');
    console.log(`   Error: ${err.message}`);
  });
  
  req.write(JSON.stringify({ placeUrl: 'test' }));
  req.end();
}

function testEnvironment() {
  console.log('[Test 3] Environment Configuration');
  
  const fs = require('fs');
  const path = require('path');
  
  const envPath = path.join(__dirname, '.env');
  
  if (fs.existsSync(envPath)) {
    console.log('✅ .env file exists');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const checks = [
      { key: 'OPENAI_API_KEY', name: 'OpenAI API Key' },
      { key: 'API_SECRET_KEY', name: 'API Secret Key' },
      { key: 'PORT', name: 'Port' }
    ];
    
    checks.forEach(check => {
      const regex = new RegExp(`${check.key}=(.+)`);
      const match = envContent.match(regex);
      
      if (match && match[1] && match[1].trim() && !match[1].includes('your-')) {
        console.log(`   ✅ ${check.name} is configured`);
      } else {
        console.log(`   ⚠️  ${check.name} needs to be set`);
      }
    });
  } else {
    console.log('❌ .env file not found');
    console.log('   Run: cp .env.example .env');
  }
  
  console.log('');
  printSummary();
}

function printSummary() {
  console.log('═══════════════════════════════════════');
  console.log('📋 Test Summary');
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log('If all tests passed:');
  console.log('  ✅ Your service is ready to use!');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Configure WordPress plugin settings');
  console.log('  2. Add your business URLs');
  console.log('  3. Click "Import Reviews Now"');
  console.log('');
  console.log('If any tests failed:');
  console.log('  1. Check the error messages above');
  console.log('  2. Review AI-SCRAPER-SETUP.md');
  console.log('  3. Verify your .env configuration');
  console.log('');
  console.log('═══════════════════════════════════════');
}
