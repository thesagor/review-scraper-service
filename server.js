const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const googleScraper = require('./scrapers/google-scraper');
const tripadvisorScraper = require('./scrapers/tripadvisor-scraper');
const airbnbScraper = require('./scrapers/airbnb-scraper');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// API Key authentication middleware
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return res.status(401).json({ 
      success: false, 
      error: 'Unauthorized: Invalid API key' 
    });
  }
  
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Review Scraper Service',
    version: '1.0.0'
  });
});

// Google Reviews endpoint
app.post('/api/scrape/google', authenticateApiKey, async (req, res) => {
  try {
    const { placeUrl, maxReviews = 50 } = req.body;
    
    if (!placeUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'placeUrl is required' 
      });
    }
    
    console.log(`[Google] Scraping reviews from: ${placeUrl}`);
    const reviews = await googleScraper.scrape(placeUrl, maxReviews);
    
    res.json({ 
      success: true, 
      platform: 'google',
      count: reviews.length,
      reviews 
    });
    
  } catch (error) {
    console.error('[Google] Scraping error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// TripAdvisor Reviews endpoint
app.post('/api/scrape/tripadvisor', authenticateApiKey, async (req, res) => {
  try {
    const { hotelUrl, maxReviews = 50 } = req.body;
    
    if (!hotelUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'hotelUrl is required' 
      });
    }
    
    console.log(`[TripAdvisor] Scraping reviews from: ${hotelUrl}`);
    const reviews = await tripadvisorScraper.scrape(hotelUrl, maxReviews);
    
    res.json({ 
      success: true, 
      platform: 'tripadvisor',
      count: reviews.length,
      reviews 
    });
    
  } catch (error) {
    console.error('[TripAdvisor] Scraping error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Airbnb Reviews endpoint
app.post('/api/scrape/airbnb', authenticateApiKey, async (req, res) => {
  try {
    const { listingUrl, maxReviews = 50 } = req.body;
    
    if (!listingUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'listingUrl is required' 
      });
    }
    
    console.log(`[Airbnb] Scraping reviews from: ${listingUrl}`);
    const reviews = await airbnbScraper.scrape(listingUrl, maxReviews);
    
    res.json({ 
      success: true, 
      platform: 'airbnb',
      count: reviews.length,
      reviews 
    });
    
  } catch (error) {
    console.error('[Airbnb] Scraping error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Batch scraping endpoint (all platforms at once)
app.post('/api/scrape/all', authenticateApiKey, async (req, res) => {
  try {
    const { googleUrl, tripadvisorUrl, airbnbUrl, maxReviews = 50 } = req.body;
    
    const results = {
      success: true,
      platforms: {}
    };
    
    // Scrape Google
    if (googleUrl) {
      try {
        console.log(`[Batch] Scraping Google reviews...`);
        const reviews = await googleScraper.scrape(googleUrl, maxReviews);
        results.platforms.google = { success: true, count: reviews.length, reviews };
      } catch (error) {
        results.platforms.google = { success: false, error: error.message };
      }
    }
    
    // Scrape TripAdvisor
    if (tripadvisorUrl) {
      try {
        console.log(`[Batch] Scraping TripAdvisor reviews...`);
        const reviews = await tripadvisorScraper.scrape(tripadvisorUrl, maxReviews);
        results.platforms.tripadvisor = { success: true, count: reviews.length, reviews };
      } catch (error) {
        results.platforms.tripadvisor = { success: false, error: error.message };
      }
    }
    
    // Scrape Airbnb
    if (airbnbUrl) {
      try {
        console.log(`[Batch] Scraping Airbnb reviews...`);
        const reviews = await airbnbScraper.scrape(airbnbUrl, maxReviews);
        results.platforms.airbnb = { success: true, count: reviews.length, reviews };
      } catch (error) {
        results.platforms.airbnb = { success: false, error: error.message };
      }
    }
    
    res.json(results);
    
  } catch (error) {
    console.error('[Batch] Scraping error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Review Scraper Service running on port ${PORT}`);
  console.log(`🌐 Accessible at:`);
  console.log(`   - http://localhost:${PORT}`);
  console.log(`   - http://127.0.0.1:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 API authentication: ${process.env.API_SECRET_KEY ? 'Enabled' : 'Disabled'}`);
});

module.exports = app;
