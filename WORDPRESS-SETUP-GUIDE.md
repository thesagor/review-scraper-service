# WordPress Plugin Setup Guide

## 🎉 Your Scraper Service is Ready!

Your AI scraper service is deployed at: **https://review-scraper-service.onrender.com**

---

## 📋 Quick Setup Steps

### Step 1: Copy Plugin to WordPress

1. Copy the entire `socialEmbed` folder to your WordPress plugins directory:
   ```
   wp-content/plugins/socialEmbed/
   ```

2. Alternatively, zip the folder and upload via WordPress Admin:
   - Go to **Plugins → Add New → Upload Plugin**
   - Upload `socialEmbed.zip`

### Step 2: Activate the Plugin

1. Go to **WordPress Admin → Plugins**
2. Find **Social Review Slider**
3. Click **Activate**

### Step 3: Configure Settings

1. In WordPress Admin, go to **Reviews → Import Settings**

2. Fill in the following settings:

   **AI Scraper Service:**
   - **Scraper Service URL:** `https://review-scraper-service.onrender.com`
   - **API Secret Key:** `social-review-scraper-secret-2024-xyz789`

3. Click **"Test Service Connection"** button
   - ⚠️ **First connection may take 30-60 seconds** (Render free tier cold start)
   - You should see: ✅ "Connection Successful! Service is running v1.0.0"

4. Add your platform URLs:
   - **Google Business URL:** Your Google Maps business listing URL
   - **TripAdvisor URL:** Your TripAdvisor hotel/business page
   - **Airbnb URL:** Your Airbnb listing URL

5. Configure import settings:
   - ✅ Enable Auto Import (optional)
   - Set Import Frequency (Daily recommended)
   - Set Import Limit (50 reviews per platform)

6. Click **"Save Changes"**

### Step 4: Import Reviews

**Manual Import:**
- Click the **"Import Reviews Now"** button
- Wait for the import to complete (may take 1-2 minutes)
- Check the import log for results

**Automatic Import:**
- If enabled, reviews will import automatically based on your schedule
- Check **Recent Import Activity** to monitor progress

---

## 🔧 Configuration Details

### Service Information
- **URL:** https://review-scraper-service.onrender.com
- **API Key:** social-review-scraper-secret-2024-xyz789
- **Version:** 1.0.0
- **Hosting:** Render.com (Free Tier)

### API Endpoints
- Health Check: `GET /health`
- Google Reviews: `POST /api/scrape/google`
- TripAdvisor Reviews: `POST /api/scrape/tripadvisor`
- Airbnb Reviews: `POST /api/scrape/airbnb`
- Batch Import: `POST /api/scrape/all`

### Important Notes

⚠️ **Render Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- First request after inactivity takes 30-60 seconds to wake up
- 750 hours/month free (sufficient for most use cases)

💡 **Tips:**
- Test connection before importing reviews
- Start with a small import limit (10-20) for testing
- Monitor the import log for any errors
- For production, consider upgrading to Render paid plan ($7/month)

---

## 🎨 Display Reviews on Your Site

### Using Shortcode
Add this to any page or post:
```
[social_reviews count="10" platform="all" autoplay="true"]
```

**Parameters:**
- `count` - Number of reviews to display (default: 10)
- `platform` - Filter by platform: all, google, tripadvisor, airbnb (default: all)
- `autoplay` - Enable auto-slide: true/false (default: true)
- `speed` - Autoplay speed in ms (default: 3000)

**Examples:**
```
[social_reviews count="5" platform="google"]
[social_reviews count="15" platform="all" autoplay="false"]
[social_reviews count="8" platform="tripadvisor" speed="5000"]
```

### Using Widget
1. Go to **Appearance → Widgets**
2. Add **Social Review Slider** widget to your sidebar
3. Configure display options

---

## 🧪 Testing the Connection

### Method 1: WordPress Admin
1. Go to **Reviews → Import Settings**
2. Click **"Test Service Connection"**
3. Wait for result (may take up to 60 seconds on first try)

### Method 2: Connection Test Script
1. Upload `wp-connection-test.php` to your WordPress root directory
2. Access: `https://your-site.com/wp-connection-test.php`
3. Review all test results
4. Delete the file after testing (for security)

### Method 3: Direct API Test
Use curl or Postman:
```bash
# Test health endpoint
curl https://review-scraper-service.onrender.com/health

# Test with API key
curl -X POST https://review-scraper-service.onrender.com/api/scrape/google \
  -H "Content-Type: application/json" \
  -H "X-API-Key: social-review-scraper-secret-2024-xyz789" \
  -d '{"placeUrl": "YOUR_GOOGLE_URL", "maxReviews": 5}'
```

---

## 🐛 Troubleshooting

### "Connection test failed"
- **Wait 60 seconds and try again** (service may be waking up)
- Check that the URL is exactly: `https://review-scraper-service.onrender.com`
- Verify API key is correct (case-sensitive)
- Check your WordPress server can make outbound HTTPS requests

### "Service Unreachable"
- Service may be down - check Render dashboard
- Your hosting may block outbound connections
- Try the connection test script for detailed diagnostics

### "API Key Invalid"
- Double-check the API key: `social-review-scraper-secret-2024-xyz789`
- Make sure there are no extra spaces
- Key is case-sensitive

### "No reviews found"
- Verify the platform URLs are correct
- Some platforms may block scraping temporarily
- Try with a smaller maxReviews value (5-10)
- Check Render logs for detailed error messages

### Import takes too long
- First import after inactivity takes 30-60 seconds (cold start)
- Reduce import limit to 10-20 reviews for testing
- Subsequent imports will be faster

---

## 📊 Monitoring

### Check Render Service Status
1. Go to https://dashboard.render.com
2. Find your `review-scraper-service`
3. View logs for detailed information

### WordPress Import Log
- Go to **Reviews → Import Settings**
- Scroll to **Recent Import Activity**
- Shows last 10 imports with status

---

## 🚀 Going to Production

For production use, consider:

1. **Upgrade Render Plan** ($7/month)
   - No cold starts
   - Better performance
   - More reliability

2. **Secure Your API Key**
   - Change the default API key in Render dashboard
   - Update WordPress plugin settings

3. **Set Up Monitoring**
   - Enable Render email notifications
   - Monitor import logs regularly

4. **Optimize Import Schedule**
   - Daily imports for most businesses
   - Hourly for high-traffic businesses

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Render service logs
3. Test with the connection diagnostic script
4. Check WordPress error logs

---

## ✅ Checklist

- [ ] Plugin copied to WordPress
- [ ] Plugin activated
- [ ] Service URL configured
- [ ] API key configured
- [ ] Connection test successful
- [ ] Platform URLs added
- [ ] First manual import successful
- [ ] Reviews displaying on site
- [ ] Auto-import configured (optional)

---

**You're all set! 🎉**

Your WordPress site is now connected to your Render-hosted scraper service and ready to import reviews automatically!
