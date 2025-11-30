// Quick test to verify Gemini API is working
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('🧪 Testing Gemini API Configuration...\n');
  
  // Check if API key exists
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in .env file!');
    console.log('   Run: .\\configure-gemini.ps1');
    process.exit(1);
  }
  
  console.log('✅ Gemini API Key found');
  console.log(`   Key: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
  console.log('');
  
  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    console.log('🔄 Testing Gemini API with a simple request...');
    
    // Simple test prompt
    const prompt = `Extract reviews from this HTML and return as JSON array:
    <div class="review">
      <span class="author">John Doe</span>
      <span class="rating">5 stars</span>
      <p class="text">Great service!</p>
      <span class="date">2024-01-15</span>
    </div>
    
    Return format: [{"author_name": "...", "rating": 5, "text": "...", "date": "2024-01-15", "platform": "test"}]`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up markdown
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    console.log('✅ Gemini API Response received!');
    console.log('');
    console.log('📝 Raw Response:');
    console.log(text);
    console.log('');
    
    // Try to parse JSON
    try {
      const reviews = JSON.parse(text);
      console.log('✅ JSON parsing successful!');
      console.log(`   Extracted ${reviews.length} review(s)`);
      console.log('');
      console.log('📊 Parsed Data:');
      console.log(JSON.stringify(reviews, null, 2));
      console.log('');
      console.log('🎉 SUCCESS! Gemini API is working correctly!');
      console.log('');
      console.log('Next steps:');
      console.log('  1. Service is running on http://localhost:3000');
      console.log('  2. Test with real scraping: node test-scrape.js');
      console.log('  3. Check health: curl http://localhost:3000/health');
      
    } catch (parseError) {
      console.warn('⚠️  JSON parsing failed, but API is responding');
      console.log('   This is normal - the AI might need better prompting');
      console.log('   The actual scraper has better prompts and error handling');
    }
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('  1. Check your API key at: https://aistudio.google.com/app/apikey');
    console.log('  2. Ensure the key is active and has no restrictions');
    console.log('  3. Check your internet connection');
    console.log('  4. Verify you haven\'t exceeded rate limits (15 req/min)');
    process.exit(1);
  }
}

testGemini();
