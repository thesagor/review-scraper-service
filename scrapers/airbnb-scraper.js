const puppeteer = require('puppeteer');
const { extractReviewsFromHTML } = require('../utils/ai-extractor');

/**
 * Scrape Airbnb listing reviews
 */
async function scrape(listingUrl, maxReviews = 50) {
  let browser;
  
  try {
    console.log('[Airbnb] Launching browser...');
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
    
    console.log('[Airbnb] Navigating to:', listingUrl);
    await page.goto(listingUrl, { 
      waitUntil: 'networkidle2',
      timeout: parseInt(process.env.TIMEOUT_MS) || 30000
    });
    
    // Wait for page to load
    await page.waitForTimeout(4000);
    
    // Handle cookie consent
    try {
      const acceptButton = await page.$('button[data-testid*="accept"]');
      if (acceptButton) {
        await acceptButton.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {
      console.log('[Airbnb] No cookie consent found');
    }
    
    // Scroll to reviews section
    console.log('[Airbnb] Scrolling to reviews section...');
    try {
      await page.evaluate(() => {
        const reviewsSection = document.querySelector('[data-section-id="REVIEWS_DEFAULT"]') ||
                             document.querySelector('h2[id*="review"]') ||
                             document.querySelector('div[id*="review"]');
        if (reviewsSection) {
          reviewsSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log('[Airbnb] Could not find reviews section');
    }
    
    // Try to click "Show all reviews" button
    try {
      const showAllButton = await page.$('button[aria-label*="reviews"], button:has-text("Show all")');
      if (showAllButton) {
        console.log('[Airbnb] Clicking show all reviews...');
        await showAllButton.click();
        await page.waitForTimeout(3000);
      }
    } catch (e) {
      console.log('[Airbnb] Show all button not found');
    }
    
    // Scroll to load more reviews
    console.log('[Airbnb] Scrolling to load reviews...');
    await autoScroll(page, 5);
    
    // Try to expand "Show more" buttons in reviews
    try {
      await page.evaluate(() => {
        const showMoreButtons = document.querySelectorAll('button[aria-label*="more"], button:has-text("Show more")');
        showMoreButtons.forEach(button => {
          try {
            button.click();
          } catch (e) {}
        });
      });
      await page.waitForTimeout(1000);
    } catch (e) {
      console.log('[Airbnb] Could not expand reviews');
    }
    
    // Get the page HTML
    const html = await page.content();
    
    console.log('[Airbnb] Extracting reviews with AI...');
    const reviews = await extractReviewsFromHTML(html, 'airbnb', maxReviews);
    
    console.log(`[Airbnb] Successfully extracted ${reviews.length} reviews`);
    
    return reviews;
    
  } catch (error) {
    console.error('[Airbnb] Scraping error:', error);
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
