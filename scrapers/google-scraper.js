const puppeteer = require('puppeteer');
const { extractReviewsFromHTML } = require('../utils/ai-extractor');

/**
 * Scrape Google Business reviews
 */
async function scrape(placeUrl, maxReviews = 50) {
  let browser;
  
  try {
    console.log('[Google] Launching browser...');
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
    
    // Set user agent to avoid detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Enable request interception to block images and fonts for speed
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log('[Google] Navigating to:', placeUrl);
    await page.goto(placeUrl, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    
    // Wait for reviews to load
    await new Promise(r => setTimeout(r, 3000));
    
    // Click on "Reviews" tab if it exists
    try {
      const reviewsButton = await page.$('button[aria-label*="Reviews"]');
      if (reviewsButton) {
        await reviewsButton.click();
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (e) {
      console.log('[Google] Reviews tab not found, continuing...');
    }
    
    // Scroll to load more reviews
    console.log('[Google] Scrolling to load reviews...');
    await autoScroll(page, 5); // Scroll 5 times
    
    // Get the page HTML
    const html = await page.content();
    
    console.log('[Google] Extracting reviews with AI...');
    const reviews = await extractReviewsFromHTML(html, 'google', maxReviews);
    
    console.log(`[Google] Successfully extracted ${reviews.length} reviews`);
    
    return reviews;
    
  } catch (error) {
    console.error('[Google] Scraping error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Auto-scroll function to load dynamic content
 */
async function autoScroll(page, scrollCount = 5) {
  await page.evaluate(async (count) => {
    await new Promise((resolve) => {
      let scrolls = 0;
      const distance = 500;
      const timer = setInterval(() => {
        const scrollableDiv = document.querySelector('div[role="main"]') || document.body;
        scrollableDiv.scrollBy(0, distance);
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
