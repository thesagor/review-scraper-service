require('dotenv').config();

console.log('Current Environment Variables Check:');
console.log('-----------------------------------');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set (Length: ' + process.env.GEMINI_API_KEY.length + ')' : 'Not Set');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Not Set');
console.log('API_SECRET_KEY:', process.env.API_SECRET_KEY ? 'Set' : 'Not Set');
