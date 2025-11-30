// Detailed API key diagnostic
require('dotenv').config();
const https = require('https');

async function diagnoseApiKey() {
  console.log('🔍 Gemini API Key Diagnostic\n');
  console.log('='.repeat(50));
  
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ No GEMINI_API_KEY found in .env file!');
    process.exit(1);
  }
  
  console.log('✅ API Key found in .env');
  console.log(`   Key: ${apiKey.substring(0, 15)}...${apiKey.substring(apiKey.length - 5)}`);
  console.log(`   Length: ${apiKey.length} characters`);
  console.log(`   Starts with: ${apiKey.substring(0, 4)}`);
  console.log('');
  
  // Check key format
  if (!apiKey.startsWith('AIza')) {
    console.warn('⚠️  Warning: Gemini API keys typically start with "AIza"');
  } else {
    console.log('✅ Key format looks correct (starts with AIza)');
  }
  console.log('');
  
  // Try a direct API call
  console.log('🔄 Testing direct API call...\n');
  
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
  
  https.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Status Code: ${res.statusCode}`);
      console.log('');
      
      if (res.statusCode === 200) {
        console.log('✅ API Key is VALID!\n');
        try {
          const parsed = JSON.parse(data);
          if (parsed.models && parsed.models.length > 0) {
            console.log('📋 Available Models:');
            parsed.models.forEach(model => {
              console.log(`   - ${model.name}`);
            });
            console.log('');
            console.log('🎉 SUCCESS! Your Gemini API key is working!');
            console.log('');
            console.log('✨ Recommended model to use:');
            const recommended = parsed.models.find(m => 
              m.name.includes('gemini-1.5-flash') || 
              m.name.includes('gemini-pro')
            );
            if (recommended) {
              const modelName = recommended.name.split('/').pop();
              console.log(`   ${modelName}`);
              console.log('');
              console.log(`Update ai-extractor.js to use: "${modelName}"`);
            }
          }
        } catch (e) {
          console.log('Response:', data);
        }
      } else if (res.statusCode === 400) {
        console.log('❌ API Key Error: Bad Request');
        console.log('   The API key might be invalid or has restrictions');
        console.log('');
        console.log('Response:', data);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('   1. Go to: https://aistudio.google.com/app/apikey');
        console.log('   2. Check if the API key is enabled');
        console.log('   3. Check for any API restrictions');
        console.log('   4. Try creating a new API key');
      } else if (res.statusCode === 403) {
        console.log('❌ API Key Error: Forbidden');
        console.log('   The API key might have restrictions or the API is not enabled');
        console.log('');
        console.log('Response:', data);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('   1. Enable the Generative Language API in Google Cloud Console');
        console.log('   2. Check API key restrictions');
        console.log('   3. Verify billing is enabled (if required)');
      } else {
        console.log(`❌ Unexpected response: ${res.statusCode}`);
        console.log('Response:', data);
      }
    });
    
  }).on('error', (err) => {
    console.error('❌ Network Error:', err.message);
    console.log('');
    console.log('Check your internet connection');
  });
}

diagnoseApiKey();
