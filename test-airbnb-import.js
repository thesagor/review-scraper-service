const http = require('http');
require('dotenv').config();

const airbnbUrl = 'https://www.airbnb.com/rooms/1019987568843662078?source_impression_id=p3_1764482134_P3y10bTxM8RYL8eR';
const apiKey = process.env.API_SECRET_KEY;

console.log('🏠 Testing Airbnb Review Import\n');
console.log('Listing URL:', airbnbUrl);
console.log('API Key:', apiKey ? '✓ Configured' : '✗ Missing');
console.log('\nStarting import...\n');

const postData = JSON.stringify({
  listingUrl: airbnbUrl,
  maxReviews: 10
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/scrape/airbnb',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'X-API-Key': apiKey
  }
};

const startTime = Date.now();

const req = http.request(options, (res) => {
  let data = '';
  
  console.log(`Status Code: ${res.statusCode}\n`);
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const duration = Date.now() - startTime;
    
    try {
      const result = JSON.parse(data);
      
      if (result.success) {
        console.log('✅ SUCCESS!\n');
        console.log(`Duration: ${duration}ms`);
        console.log(`Platform: ${result.platform}`);
        console.log(`Reviews Found: ${result.count}\n`);
        
        if (result.reviews && result.reviews.length > 0) {
          console.log('═══════════════════════════════════════════════════════');
          console.log('📝 SAMPLE REVIEWS');
          console.log('═══════════════════════════════════════════════════════\n');
          
          result.reviews.slice(0, 3).forEach((review, index) => {
            console.log(`Review ${index + 1}:`);
            console.log(`  Author: ${review.author_name}`);
            console.log(`  Rating: ${review.rating}/5 ⭐`);
            console.log(`  Date: ${review.date}`);
            console.log(`  Text: ${review.text.substring(0, 150)}${review.text.length > 150 ? '...' : ''}`);
            console.log('');
          });
          
          console.log('═══════════════════════════════════════════════════════');
          console.log('\n✅ Ready to import to WordPress!');
          console.log('\nNext steps:');
          console.log('1. Go to WordPress → Reviews → Import Settings');
          console.log('2. Enter Airbnb URL:', airbnbUrl);
          console.log('3. Click "Import Reviews Now"');
        } else {
          console.log('⚠️  No reviews found in the response');
        }
      } else {
        console.log('❌ FAILED\n');
        console.log('Error:', result.error || 'Unknown error');
        console.log('\nFull Response:', JSON.stringify(result, null, 2));
      }
    } catch (e) {
      console.log('❌ Failed to parse response\n');
      console.log('Error:', e.message);
      console.log('Raw Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request failed\n');
  console.log('Error:', error.message);
  console.log('\nMake sure:');
  console.log('1. The scraper service is running (npm start)');
  console.log('2. Port 3000 is accessible');
  console.log('3. API_SECRET_KEY is set in .env');
});

req.write(postData);
req.end();
