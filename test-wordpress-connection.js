const http = require('http');

console.log('🔍 WordPress Connection Diagnostic Tool\n');
console.log('This tool tests if WordPress can connect to the scraper service.\n');

const testUrls = [
  'http://localhost:3000/health',
  'http://127.0.0.1:3000/health'
];

let testIndex = 0;

function testConnection(url) {
  return new Promise((resolve, reject) => {
    console.log(`\n[Test ${testIndex + 1}] Testing: ${url}`);
    
    const startTime = Date.now();
    
    http.get(url, (res) => {
      const duration = Date.now() - startTime;
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`✅ SUCCESS (${duration}ms)`);
          console.log(`   Status Code: ${res.statusCode}`);
          console.log(`   Response: ${JSON.stringify(result, null, 2)}`);
          resolve({ success: true, url, duration, data: result });
        } catch (e) {
          console.log(`⚠️  Connected but invalid JSON response`);
          console.log(`   Status Code: ${res.statusCode}`);
          console.log(`   Raw Response: ${data}`);
          resolve({ success: false, url, error: 'Invalid JSON' });
        }
      });
    }).on('error', (err) => {
      const duration = Date.now() - startTime;
      console.log(`❌ FAILED (${duration}ms)`);
      console.log(`   Error: ${err.message}`);
      console.log(`   Code: ${err.code}`);
      resolve({ success: false, url, error: err.message, code: err.code });
    });
  });
}

async function runTests() {
  const results = [];
  
  for (const url of testUrls) {
    const result = await testConnection(url);
    results.push(result);
    testIndex++;
  }
  
  console.log('\n' + '═'.repeat(60));
  console.log('📊 SUMMARY');
  console.log('═'.repeat(60));
  
  const successful = results.filter(r => r.success);
  
  if (successful.length > 0) {
    console.log('\n✅ Service is accessible!');
    console.log('\nWorking URLs:');
    successful.forEach(r => {
      console.log(`   ✓ ${r.url} (${r.duration}ms)`);
    });
    
    console.log('\n📝 WordPress Configuration:');
    console.log('   In your WordPress plugin settings, use:');
    console.log(`   Scraper Service URL: ${successful[0].url.replace('/health', '')}`);
  } else {
    console.log('\n❌ Service is NOT accessible from any URL');
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('   1. Make sure the scraper service is running (npm start)');
    console.log('   2. Check if port 3000 is not blocked by firewall');
    console.log('   3. Restart the scraper service after making changes');
    console.log('   4. Check if another application is using port 3000');
  }
  
  console.log('\n' + '═'.repeat(60));
}

// Run the tests
runTests().catch(console.error);
