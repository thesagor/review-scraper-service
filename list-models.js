// List available Gemini models
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  console.log('🔍 Checking available Gemini models...\n');
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found!');
    process.exit(1);
  }
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try different model names
    const modelsToTry = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro',
      'gemini-1.0-pro',
      'gemini-pro-vision'
    ];
    
    console.log('Testing different model names...\n');
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say "Hello"');
        const response = await result.response;
        console.log(`✅ ${modelName} - WORKS!`);
        console.log(`   Response: ${response.text().substring(0, 50)}...\n`);
        
        // If we found a working model, use it
        console.log(`\n🎉 Found working model: ${modelName}`);
        console.log(`\nUpdate your code to use: "${modelName}"`);
        break;
        
      } catch (error) {
        console.log(`❌ ${modelName} - Not available`);
        console.log(`   Error: ${error.message.substring(0, 100)}...\n`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
