const puppeteer = require('puppeteer');
const { extractReviewsFromHTML } = require('../utils/ai-extractor');

/**
 * Scrape TripAdvisor hotel reviews
 */
async function scrape(hotelUrl, maxReviews = 50) {
  let browser;
  
  try {
    console.log('[TripAdvisor] Launching browser...');
    browser = await puppeteer.launch({
      headless: process.env.HEADLESS_MODE !== 'false',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('[TripAdvisor] Navigating to:', hotelUrl);
    await page.goto(hotelUrl, { 
      waitUntil: 'networkidle2',
      timeout: parseInt(process.env.TIMEOUT_MS) || 30000
    });
    
    // Wait for page to load
    await page.waitForTimeout(3000);
    
    // Handle cookie consent if it appears
    try {
      const acceptButton = await page.$('button[id*="accept"]');
      if (acceptButton) {
        await acceptButton.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {
      console.log('[TripAdvisor] No cookie consent found');
    }
    
    // Try to click "Read all reviews" or similar button
    try {
      const reviewsButton = await page.$('a[href*="Reviews"]');
      if (reviewsButton) {
        await reviewsButton.click();
        await page.waitForTimeout(2000);
      }
    } catch (e) {
      console.log('[TripAdvisor] Already on reviews page');
    }
    
    // Scroll to load more reviews
    console.log('[TripAdvisor] Scrolling to load reviews...');
    await autoScroll(page, 5);
    
    // Try to expand "Read more" buttons
    try {
      await page.evaluate(() => {
        const readMoreButtons = document.querySelectorAll('span[class*="readMore"], div[class*="readMore"]');
        readMoreButtons.forEach(button => button.click());
      });
      await page.waitForTimeout(1000);
    } catch (e) {
      console.log('[TripAdvisor] Could not expand reviews');
    }
    
    // Get the page HTML
    const html = await page.content();
    
    console.log('[TripAdvisor] Extracting reviews with AI...');
    const reviews = await extractReviewsFromHTML(html, 'tripadvisor', maxReviews);
    
    console.log(`[TripAdvisor] Successfully extracted ${reviews.length} reviews`);
    
    return reviews;
    
  } catch (error) {
    console.error('[TripAdvisor] Scraping error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Auto-scroll function
 */
async function autoScroll(page, scrollCount = 5) {
  await page.evaluate(async (count) => {
    await new Promise((resolve) => {
      let scrolls = 0;
      const distance = 500;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        scrolls++;
        
        if (scrolls >= count) {
          clearInterval(timer);
          resolve();
        }
      }, 500);
    });
  }, scrollCount);
}

module.exports = { scrape };
