const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize OpenAI (if key exists)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

// Initialize Gemini (if key exists)
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

/**
 * Extract reviews from HTML using AI (Gemini or OpenAI)
 * @param {string} html - The HTML content to parse
 * @param {string} platform - Platform name (google, tripadvisor, airbnb)
 * @param {number} maxReviews - Maximum number of reviews to extract
 * @returns {Promise<Array>} - Array of review objects
 */
async function extractReviewsFromHTML(html, platform, maxReviews = 50) {
  // Truncate HTML if too large
  const maxHtmlLength = 50000; 
  const truncatedHtml = html.length > maxHtmlLength 
    ? html.substring(0, maxHtmlLength) + '...[truncated]'
    : html;

  // 1. Try Google Gemini (Free & Fast!)
  if (genAI) {
    try {
      console.log('[AI] Using Google Gemini 2.0 Flash...');
      // Use the model we saw in diagnostics
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
        You are a data extraction expert. Extract customer reviews from the provided HTML.
        
        Return ONLY a valid JSON array of objects with this exact structure:
        [
          {
            "author_name": "Reviewer Name",
            "rating": 5,
            "text": "Review text content",
            "date": "2024-01-15",
            "platform": "${platform}"
          }
        ]

        Rules:
        1. Extract up to ${maxReviews} reviews
        2. Rating must be a number (1-5)
        3. Date should be in YYYY-MM-DD format (estimate if needed)
        4. Remove HTML tags from text
        5. Return ONLY the JSON array, no markdown formatting, no code blocks.
        
        HTML Content:
        ${truncatedHtml}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean up markdown code blocks if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const reviews = JSON.parse(text);
      return validateReviews(reviews, platform, maxReviews);

    } catch (error) {
      console.error('[Gemini] Extraction failed:', error);
      // Throw the error directly so we can see it in the response
      throw new Error(`Gemini extraction failed: ${error.message}`);
    }
  }

  throw new Error('No valid API keys found! Please set GEMINI_API_KEY in .env file.');
}

/**
 * Helper to validate and normalize reviews
 */
function validateReviews(reviews, platform, maxReviews) {
  if (!Array.isArray(reviews)) return [];

  const validated = reviews
    .filter(review => review.author_name && review.text)
    .map(review => ({
      author_name: String(review.author_name).trim(),
      rating: parseFloat(review.rating) || 5,
      text: String(review.text).trim(),
      date: review.date || new Date().toISOString().split('T')[0],
      platform: platform
    }))
    .slice(0, maxReviews);

  console.log(`[AI] Extracted ${validated.length} reviews from ${platform}`);
  return validated;
}

module.exports = {
  extractReviewsFromHTML,
  // Keep other exports for backward compatibility if needed
  extractReviewsSimple: extractReviewsFromHTML,
  estimateCost: () => ({ totalCost: 0 }) // Gemini is free!
};
