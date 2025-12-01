const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { extractReviewsFromHTML } = require('../utils/ai-extractor');

// Use stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

/**
 * Random delay to simulate human behavior
 */
function randomDelay(min = 1000, max = 3000) {
  return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
}

/**
 * Scrape TripAdvisor hotel reviews with anti-detection measures
 */
async function scrape(hotelUrl, maxReviews = 50) {
  let browser;
  
  try {
    console.log('[TripAdvisor] Launching browser with stealth mode...');
    
    browser = await puppeteer.launch({
      headless: process.env.HEADLESS_MODE !== 'false' ? 'new' : false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process',
        '--window-size=1920,1080',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ],
      ignoreHTTPSErrors: true,
      defaultViewport: null
    });
    
    const page = await browser.newPage();
    
    // Set realistic viewport with slight randomization
    const width = 1920 + Math.floor(Math.random() * 100);
    const height = 1080 + Math.floor(Math.random() * 100);
    await page.setViewport({ width, height });
    
    // Set extra headers to look more like a real browser
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0'
    });
    
    // Override navigator properties to avoid detection
    await page.evaluateOnNewDocument(() => {
      // Override the navigator.webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false
      });
      
      // Override the navigator.plugins to look more realistic
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5]
      });
      
      // Override navigator.languages
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en']
      });
      
      // Add chrome object
      window.chrome = {
        runtime: {}
      };
      
      // Override permissions
      const originalQuery = window.navigator.permissions.query;
      window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission }) :
          originalQuery(parameters)
      );
    });
    
    // Don't block resources - TripAdvisor might detect this
    // Instead, let everything load naturally
    
    console.log('[TripAdvisor] Navigating to:', hotelUrl);
    
    // Add random delay before navigation
    await randomDelay(500, 1500);
    
    await page.goto(hotelUrl, { 
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    console.log('[TripAdvisor] Page loaded, waiting for content...');
    
    // Random delay to simulate reading
    await randomDelay(2000, 4000);
    
    // Handle cookie consent if it appears
    try {
      const cookieSelectors = [
        'button[id*="accept"]',
        'button[id*="onetrust-accept"]',
        'button.onetrust-close-btn-handler',
        '#onetrust-accept-btn-handler'
      ];
      
      for (const selector of cookieSelectors) {
        const acceptButton = await page.$(selector);
        if (acceptButton) {
          console.log('[TripAdvisor] Accepting cookies...');
          await acceptButton.click();
          await randomDelay(1000, 2000);
          break;
        }
      }
    } catch (e) {
      console.log('[TripAdvisor] No cookie consent found or already accepted');
    }
    
    // Check if we're on the reviews page or need to navigate
    const currentUrl = page.url();
    if (!currentUrl.includes('Reviews')) {
      console.log('[TripAdvisor] Navigating to reviews section...');
      try {
        const reviewsButton = await page.$('a[href*="Reviews"]');
        if (reviewsButton) {
          await randomDelay(500, 1500);
          await reviewsButton.click();
          await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
          await randomDelay(2000, 3000);
        }
      } catch (e) {
        console.log('[TripAdvisor] Could not navigate to reviews, staying on current page');
      }
    }
    
    // Scroll naturally to load more reviews
    console.log('[TripAdvisor] Scrolling to load reviews...');
    await naturalScroll(page, 5);
    
    // Try to expand "Read more" buttons with human-like behavior
    try {
      console.log('[TripAdvisor] Expanding review text...');
      await page.evaluate(() => {
        const readMoreButtons = document.querySelectorAll(
          'span[class*="readMore"], div[class*="readMore"], span[class*="taLnk"], div[data-test-target*="expand"]'
        );
        readMoreButtons.forEach((button, index) => {
          setTimeout(() => button.click(), index * 100);
        });
      });
      await randomDelay(1500, 2500);
    } catch (e) {
      console.log('[TripAdvisor] Could not expand reviews');
    }
    
    // Get the page HTML
    console.log('[TripAdvisor] Extracting page content...');
    const html = await page.content();
    
    // Check for CAPTCHA or blocking
    if (html.includes('captcha') || html.includes('robot') || html.includes('blocked')) {
      console.warn('[TripAdvisor] ⚠️  Possible CAPTCHA or blocking detected!');
      console.warn('[TripAdvisor] Try running with HEADLESS_MODE=false to solve manually');
      
      // If not headless, wait for user to solve CAPTCHA
      if (process.env.HEADLESS_MODE === 'false') {
        console.log('[TripAdvisor] Waiting 60 seconds for manual CAPTCHA solving...');
        await new Promise(r => setTimeout(r, 60000));
        const newHtml = await page.content();
        if (newHtml.includes('captcha') || newHtml.includes('robot')) {
          throw new Error('CAPTCHA not solved - please try again');
        }
      } else {
        throw new Error('TripAdvisor blocking detected - try with HEADLESS_MODE=false');
      }
    }
    
    console.log('[TripAdvisor] Extracting reviews with AI...');
    const reviews = await extractReviewsFromHTML(html, 'tripadvisor', maxReviews);
    
    console.log(`[TripAdvisor] ✅ Successfully extracted ${reviews.length} reviews`);
    
    return reviews;
    
  } catch (error) {
    console.error('[TripAdvisor] ❌ Scraping error:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Natural scroll function with random delays
 */
async function naturalScroll(page, scrollCount = 5) {
  for (let i = 0; i < scrollCount; i++) {
    await page.evaluate(() => {
      window.scrollBy({
        top: 300 + Math.random() * 400,
        behavior: 'smooth'
      });
    });
    
    // Random delay between scrolls (500ms to 1500ms)
    await randomDelay(500, 1500);
  }
  
  // Scroll back up a bit (human behavior)
  await page.evaluate(() => {
    window.scrollBy({
      top: -200,
      behavior: 'smooth'
    });
  });
  
  await randomDelay(500, 1000);
}

module.exports = { scrape };
