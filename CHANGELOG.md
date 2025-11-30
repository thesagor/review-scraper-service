# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-29

### 🎉 Initial Release

#### Added
- ✨ **Google Gemini AI Integration** - Free AI-powered review extraction
- 🌐 **Multi-Platform Support** - Google, TripAdvisor, and Airbnb scrapers
- 🔒 **API Authentication** - Secure API key-based authentication
- ⚡ **Rate Limiting** - Built-in rate limiting (100 req/15min)
- 🛡️ **Security Features** - Helmet.js, CORS, input validation
- 📊 **Structured API** - RESTful API with JSON responses
- 🔄 **Batch Scraping** - Scrape multiple platforms in one request
- 🧪 **Testing Tools** - Comprehensive test suite and diagnostic tools
- 📝 **Documentation** - Complete README and API documentation
- 🐳 **Docker Support** - Dockerfile for containerized deployment
- ⚙️ **Configuration Scripts** - PowerShell setup scripts for easy configuration

#### Features
- **AI Providers**
  - Google Gemini 2.0 Flash (Primary, FREE)
  - OpenAI GPT-4o-mini (Optional fallback)
  
- **Scrapers**
  - Google Business Reviews
  - TripAdvisor Hotel Reviews
  - Airbnb Listing Reviews
  
- **API Endpoints**
  - `GET /health` - Health check
  - `POST /api/scrape/google` - Scrape Google reviews
  - `POST /api/scrape/tripadvisor` - Scrape TripAdvisor reviews
  - `POST /api/scrape/airbnb` - Scrape Airbnb reviews
  - `POST /api/scrape/all` - Batch scrape all platforms

- **Security**
  - API key authentication
  - Rate limiting
  - CORS protection
  - Helmet.js security headers
  - Input validation

- **Developer Tools**
  - `test-gemini.js` - Test Gemini API integration
  - `test-scrape.js` - Test scraping functionality
  - `diagnose-api.js` - Diagnose API key issues
  - `configure-gemini.ps1` - Automated setup script

#### Technical Details
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Browser Automation**: Puppeteer
- **AI**: Google Generative AI SDK
- **Dependencies**: 
  - express ^4.18.2
  - puppeteer ^21.6.1
  - @google/generative-ai ^0.24.1
  - cors ^2.8.5
  - helmet ^7.1.0
  - dotenv ^16.3.1
  - express-rate-limit ^7.1.5

#### Documentation
- Comprehensive README.md
- API documentation
- Contributing guidelines
- MIT License
- Quick reference guide
- Setup completion guide

---

## [Unreleased]

### Planned Features
- [ ] Yelp review scraping
- [ ] Facebook review scraping
- [ ] Review sentiment analysis
- [ ] Caching layer for improved performance
- [ ] Web dashboard for monitoring
- [ ] Webhook notifications
- [ ] Review monitoring and alerts
- [ ] Advanced filtering options
- [ ] Export to CSV/Excel
- [ ] Scheduled scraping jobs

### Under Consideration
- [ ] GraphQL API
- [ ] WebSocket support for real-time updates
- [ ] Multi-language support
- [ ] Review deduplication
- [ ] Image extraction from reviews
- [ ] Review response tracking
- [ ] Analytics dashboard

---

## Version History

### [1.0.0] - 2024-11-29
- Initial public release
- Google Gemini AI integration
- Multi-platform scraping support
- Complete documentation

---

## Migration Guides

### From OpenAI to Gemini

If you were using an earlier version with OpenAI:

1. Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Update your `.env` file:
   ```env
   GEMINI_API_KEY=your-gemini-key
   # OPENAI_API_KEY=your-openai-key  # Optional fallback
   ```
3. Restart the service
4. Enjoy 100% free AI-powered scraping!

---

## Support

For questions, issues, or feature requests:
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/ai-review-scraper/issues)
- **GitHub Discussions**: [Ask questions and discuss ideas](https://github.com/yourusername/ai-review-scraper/discussions)

---

## Contributors

Thank you to all contributors who have helped make this project better! 🙏

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

---

**Legend:**
- ✨ New feature
- 🐛 Bug fix
- 🔒 Security update
- 📝 Documentation
- ⚡ Performance improvement
- 🔧 Configuration change
- 🗑️ Deprecation
- ❌ Breaking change
