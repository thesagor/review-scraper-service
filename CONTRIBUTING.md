# Contributing to AI Review Scraper

First off, thank you for considering contributing to AI Review Scraper! 🎉

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- ✅ Be respectful and inclusive
- ✅ Welcome newcomers and help them learn
- ✅ Focus on what is best for the community
- ✅ Show empathy towards other community members
- ❌ No harassment, trolling, or discriminatory language
- ❌ No personal attacks or political arguments

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, Node version, etc.)
- **Error messages** and logs

**Bug Report Template:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. Windows 11, Ubuntu 22.04]
 - Node.js: [e.g. 18.17.0]
 - Version: [e.g. 1.0.0]

**Additional context**
Any other context about the problem.
```

### Suggesting Features

Feature suggestions are welcome! Please:

- **Check existing feature requests** first
- **Provide a clear use case** for the feature
- **Explain why** this feature would be useful
- **Consider implementation** complexity

**Feature Request Template:**

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots.
```

### Contributing Code

We love pull requests! Here's how to contribute:

1. **Fork** the repository
2. **Create a branch** for your feature (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Commit** with clear messages
6. **Push** to your fork
7. **Open a Pull Request**

## Development Setup

### Prerequisites

- Node.js 18+
- Git
- Google Gemini API key (free)

### Setup Steps

```bash
# 1. Fork and clone the repository
git clone https://github.com/your-username/ai-review-scraper.git
cd ai-review-scraper

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Add your API keys to .env
# GEMINI_API_KEY=your-key-here
# API_SECRET_KEY=your-secret-here

# 5. Start development server
npm run dev
```

### Project Structure

```
ai-review-scraper/
├── scrapers/           # Platform-specific scrapers
│   ├── google-scraper.js
│   ├── tripadvisor-scraper.js
│   └── airbnb-scraper.js
├── utils/              # Utility functions
│   └── ai-extractor.js # AI extraction logic
├── server.js           # Main Express server
├── test.js             # Test suite
├── .env.example        # Environment template
└── README.md           # Documentation
```

### Running Tests

```bash
# Run all tests
npm test

# Test Gemini integration
node test-gemini.js

# Test scraping functionality
node test-scrape.js

# Diagnose API issues
node diagnose-api.js
```

## Pull Request Process

### Before Submitting

- ✅ Test your changes locally
- ✅ Update documentation if needed
- ✅ Add tests for new features
- ✅ Ensure all tests pass
- ✅ Follow coding standards
- ✅ Update CHANGELOG.md

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

### Review Process

1. **Automated checks** must pass (if configured)
2. **Code review** by maintainers
3. **Testing** by reviewers
4. **Approval** and merge

## Coding Standards

### JavaScript Style

We follow **Standard JS** style with some modifications:

```javascript
// ✅ Good
async function scrapeReviews(url, maxReviews = 50) {
  try {
    const reviews = await fetchReviews(url);
    return reviews.slice(0, maxReviews);
  } catch (error) {
    console.error('Error scraping:', error);
    throw error;
  }
}

// ❌ Bad
async function scrapeReviews(url,maxReviews=50){
  try{
    const reviews=await fetchReviews(url)
    return reviews.slice(0,maxReviews)
  }catch(error){
    console.error('Error scraping:',error)
    throw error
  }
}
```

### Best Practices

#### 1. Error Handling

```javascript
// ✅ Always use try-catch for async operations
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('[Module] Error:', error);
  throw new Error(`Operation failed: ${error.message}`);
}
```

#### 2. Logging

```javascript
// ✅ Use descriptive log messages with context
console.log('[Google] Scraping reviews from:', url);
console.error('[AI] Extraction failed:', error.message);
```

#### 3. Comments

```javascript
// ✅ Comment complex logic
// Extract reviews using AI - try Gemini first, fallback to OpenAI
if (genAI) {
  // Gemini logic...
}
```

#### 4. Function Documentation

```javascript
/**
 * Extract reviews from HTML using AI
 * @param {string} html - The HTML content to parse
 * @param {string} platform - Platform name (google, tripadvisor, airbnb)
 * @param {number} maxReviews - Maximum number of reviews to extract
 * @returns {Promise<Array>} - Array of review objects
 */
async function extractReviews(html, platform, maxReviews) {
  // Implementation...
}
```

#### 5. Naming Conventions

```javascript
// ✅ Use camelCase for variables and functions
const maxReviews = 50;
async function fetchReviews() {}

// ✅ Use PascalCase for classes
class ReviewScraper {}

// ✅ Use UPPER_CASE for constants
const API_TIMEOUT = 30000;
```

## Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Good commit messages
feat(scraper): add Yelp review scraping support
fix(ai): handle Gemini rate limit errors gracefully
docs(readme): update installation instructions
refactor(server): improve error handling middleware
test(scraper): add unit tests for Google scraper

# Bad commit messages
update stuff
fix bug
changes
wip
```

### Detailed Example

```
feat(scraper): add support for Yelp reviews

- Implement Yelp scraper using Puppeteer
- Add AI extraction for Yelp HTML structure
- Update API endpoint to support Yelp URLs
- Add tests for Yelp scraping functionality

Closes #123
```

## Areas for Contribution

We especially welcome contributions in these areas:

### High Priority

- 🔴 **New Platform Support** (Yelp, Facebook, etc.)
- 🔴 **Performance Optimization**
- 🔴 **Error Handling Improvements**
- 🔴 **Test Coverage**

### Medium Priority

- 🟡 **Documentation Improvements**
- 🟡 **Code Refactoring**
- 🟡 **UI/Dashboard Development**
- 🟡 **Caching Layer**

### Low Priority

- 🟢 **Additional Features** (sentiment analysis, etc.)
- 🟢 **Deployment Guides**
- 🟢 **Example Integrations**

## Questions?

- **GitHub Discussions**: Ask questions and discuss ideas
- **GitHub Issues**: Report bugs and request features
- **Email**: Contact maintainers directly

## Recognition

Contributors will be:

- ✨ Listed in CONTRIBUTORS.md
- 🎉 Mentioned in release notes
- 🏆 Credited in documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to AI Review Scraper!** 🙏

Your contributions help make this project better for everyone! 🚀
