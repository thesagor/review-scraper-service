// Test OpenAI API Key
require('dotenv').config();

async function testOpenAI() {
  console.log('🔍 OpenAI API Key Test\n');
  console.log('='.repeat(50));
  
  const apiKey = process.env.OPENAI_API_KEY;
  
  // Check if API key exists
  if (!apiKey) {
    console.error('❌ No OPENAI_API_KEY found in .env file!');
    console.log('\n📝 To add OpenAI API key:');
    console.log('   1. Get your API key from: https://platform.openai.com/api-keys');
    console.log('   2. Add to .env file: OPENAI_API_KEY=sk-...');
    console.log('   3. Run this test again');
    process.exit(1);
  }
  
  console.log('✅ API Key found in .env');
  console.log(`   Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}`);
  console.log(`   Length: ${apiKey.length} characters`);
  console.log(`   Starts with: ${apiKey.substring(0, 3)}`);
  console.log('');
  
  // Check key format
  if (!apiKey.startsWith('sk-')) {
    console.warn('⚠️  Warning: OpenAI API keys typically start with "sk-"');
    console.log('   Your key might be invalid or in old format');
  } else {
    console.log('✅ Key format looks correct (starts with sk-)');
  }
  console.log('');
  
  // Test API call
  console.log('🔄 Testing API connection...\n');
  
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Status Code: ${response.status}`);
    console.log('');
    
    if (response.status === 200) {
      const data = await response.json();
      
      console.log('✅ API Key is VALID!\n');
      console.log('📋 Available Models:');
      
      // Filter and show relevant models
      const relevantModels = data.data.filter(model => 
        model.id.includes('gpt-4') || 
        model.id.includes('gpt-3.5') ||
        model.id === 'gpt-4o-mini'
      );
      
      if (relevantModels.length > 0) {
        relevantModels.slice(0, 10).forEach(model => {
          console.log(`   - ${model.id}`);
        });
      } else {
        // Show first 10 models
        data.data.slice(0, 10).forEach(model => {
          console.log(`   - ${model.id}`);
        });
      }
      
      console.log('');
      console.log('🎉 SUCCESS! Your OpenAI API key is working!');
      console.log('');
      console.log('✨ Recommended models for this project:');
      console.log('   - gpt-4o-mini (Fastest, cheapest)');
      console.log('   - gpt-4o (Most capable)');
      console.log('   - gpt-3.5-turbo (Good balance)');
      console.log('');
      console.log('💰 Cost Estimate:');
      console.log('   - gpt-4o-mini: ~$0.0001 per review');
      console.log('   - gpt-4o: ~$0.001 per review');
      console.log('   - gpt-3.5-turbo: ~$0.0005 per review');
      
    } else if (response.status === 401) {
      console.log('❌ API Key Error: Unauthorized');
      console.log('   The API key is invalid or has been revoked');
      console.log('');
      const errorData = await response.json();
      console.log('Response:', JSON.stringify(errorData, null, 2));
      console.log('');
      console.log('🔧 Troubleshooting:');
      console.log('   1. Go to: https://platform.openai.com/api-keys');
      console.log('   2. Check if the API key is still active');
      console.log('   3. Create a new API key if needed');
      console.log('   4. Update your .env file with the new key');
      
    } else if (response.status === 429) {
      console.log('❌ Rate Limit Error');
      console.log('   You have exceeded your rate limit');
      console.log('');
      console.log('🔧 Solutions:');
      console.log('   1. Wait a few minutes and try again');
      console.log('   2. Check your usage at: https://platform.openai.com/usage');
      console.log('   3. Upgrade your plan if needed');
      
    } else {
      console.log(`❌ Unexpected response: ${response.status}`);
      const errorData = await response.text();
      console.log('Response:', errorData);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('');
    console.log('🔧 Possible issues:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify the API key is correct');
    console.log('   3. Check if OpenAI services are operational');
    console.log('   4. Visit: https://status.openai.com/');
  }
}

// Run the test
testOpenAI();
