const http = require('http');

console.log('🧪 Testing Real Scrape...\n');

// Replace with your actual Google Business URL
const testData = {
  placeUrl: 'https://www.google.com/maps/place/West+Layton+Manor/@54.4840731,-1.7844206,17z/data=!3m1!4b1!4m6!3m5!1s0x487c216b3961cdb3:0xa7573524c60b56ee!8m2!3d54.48407!4d-1.7818457!16s%2Fg%2F11b747rbjz?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D',
  maxReviews: 5
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/scrape/google',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'X-API-Key': 'social-review-scraper-secret-2024-xyz789'
  }
};

console.log('📍 Testing URL:', testData.placeUrl);
console.log('📊 Max Reviews:', testData.maxReviews);
console.log('\n⏳ Scraping... (this may take 10-30 seconds)\n');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.success) {
        console.log('✅ Scraping successful!\n');
        console.log('═══════════════════════════════════════');
        console.log(`📊 Results: ${result.count} reviews found`);
        console.log('═══════════════════════════════════════\n');
        
        if (result.reviews && result.reviews.length > 0) {
          console.log('Sample Review:');
          const sample = result.reviews[0];
          console.log(`  👤 Name: ${sample.author_name}`);
          console.log(`  ⭐ Rating: ${sample.rating}/5`);
          console.log(`  📅 Date: ${sample.date}`);
          console.log(`  💬 Text: ${sample.text.substring(0, 100)}...`);
        }
        
        console.log('\n✅ Your scraper is working perfectly!');
      } else {
        console.log('❌ Scraping failed');
        console.log('Error:', result.error || 'Unknown error');
      }
    } catch (e) {
      console.log('❌ Failed to parse response');
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (err) => {
  console.log('❌ Request failed');
  console.log('Error:', err.message);
  console.log('\n💡 Make sure the service is running: npm start');
});

req.write(postData);
req.end();
