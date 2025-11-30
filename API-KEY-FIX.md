# 🔧 API Key Issue - Troubleshooting Guide

## Problem
WordPress plugin shows: **"✗ Service Reachable, but API Key is Invalid"**

## Root Cause
The API key configured in WordPress doesn't match the API key set in your Render service environment variables.

---

## ✅ Solution: Update Render Environment Variables

### Step 1: Go to Render Dashboard
1. Open: https://dashboard.render.com
2. Click on your service: **review-scraper-service**
3. Go to the **Environment** tab

### Step 2: Check API_SECRET_KEY
Look for the environment variable: `API_SECRET_KEY`

**It should be set to:**
```
social-review-scraper-secret-2024-xyz789
```

### Step 3: Update if Needed
If the API key is different or missing:

1. Click **Edit** or **Add Environment Variable**
2. Set:
   - **Key:** `API_SECRET_KEY`
   - **Value:** `social-review-scraper-secret-2024-xyz789`
3. Click **Save Changes**
4. **Important:** The service will automatically redeploy (takes 2-3 minutes)

### Step 4: Wait for Deployment
- Watch the **Events** tab for deployment status
- Wait until you see: "Deploy live for review-scraper-service"
- This usually takes 2-3 minutes

### Step 5: Test Again
1. Go back to WordPress: **Reviews → Import Settings**
2. Click **"Test Service Connection"**
3. You should now see: ✅ "Connection Successful!"

---

## 🔍 Alternative: Check What API Key Render is Using

If you're not sure what API key is currently set in Render, you can:

### Option A: Check Render Dashboard
1. Go to https://dashboard.render.com
2. Click your service
3. Go to **Environment** tab
4. Look for `API_SECRET_KEY` value

### Option B: Check Render Logs
1. Go to https://dashboard.render.com
2. Click your service
3. Go to **Logs** tab
4. Look for a line like: `🔒 API authentication: Enabled`
5. The logs won't show the key, but will confirm if it's set

---

## 🎯 Quick Fix Commands

If you want to use a different API key, you have two options:

### Option 1: Change WordPress to Match Render
In WordPress plugin settings, try these common keys:
- `social-review-scraper-secret-2024-xyz789` (recommended)
- `your-secret-api-key-here` (default in some versions)
- Check your Render dashboard for the actual value

### Option 2: Change Render to Match WordPress
1. Decide on an API key (make it strong!)
2. Update it in Render dashboard
3. Wait for redeployment
4. Use the same key in WordPress

---

## 🧪 Test API Key Manually

### Using PowerShell (Windows):
```powershell
$headers = @{
    'Content-Type' = 'application/json'
    'X-API-Key' = 'social-review-scraper-secret-2024-xyz789'
}
$body = '{"placeUrl": "test"}'

Invoke-WebRequest -Uri 'https://review-scraper-service.onrender.com/api/scrape/google' `
    -Method POST `
    -Headers $headers `
    -Body $body `
    -UseBasicParsing
```

**Expected Results:**
- ✅ **HTTP 400** = API key is VALID (400 is expected because we sent invalid data)
- ❌ **HTTP 401** = API key is INVALID

### Using curl (if available):
```bash
curl -X POST https://review-scraper-service.onrender.com/api/scrape/google \
  -H "Content-Type: application/json" \
  -H "X-API-Key: social-review-scraper-secret-2024-xyz789" \
  -d '{"placeUrl": "test"}'
```

---

## 📋 Checklist

- [ ] Logged into Render dashboard
- [ ] Found review-scraper-service
- [ ] Checked Environment tab
- [ ] Verified API_SECRET_KEY value
- [ ] Updated if needed
- [ ] Waited for redeployment (2-3 min)
- [ ] Tested connection in WordPress
- [ ] Connection successful!

---

## 🔐 Security Best Practice

After you get it working, consider:

1. **Generate a Strong API Key:**
   ```
   Use a password generator to create a 32+ character random string
   ```

2. **Update Both Places:**
   - Render dashboard environment variables
   - WordPress plugin settings

3. **Keep it Secret:**
   - Don't commit API keys to Git
   - Don't share in public forums

---

## 💡 Common Mistakes

1. **Extra Spaces:** Make sure there are no spaces before/after the API key
2. **Case Sensitive:** API keys are case-sensitive
3. **Wrong Key:** Using the GEMINI_API_KEY instead of API_SECRET_KEY
4. **Not Saved:** Forgetting to click "Save Changes" in Render
5. **Not Redeployed:** Not waiting for Render to redeploy after changes

---

## 🆘 Still Not Working?

If you've tried everything above:

1. **Check Render Logs:**
   - Go to Render dashboard → Logs
   - Look for authentication errors
   - Share the error message

2. **Try Default Key:**
   In WordPress, try: `your-secret-api-key-here`

3. **Restart Service:**
   - In Render dashboard, click "Manual Deploy" → "Clear build cache & deploy"

4. **Check Server.js:**
   Make sure the server is reading from environment variables correctly

---

**Need Help?**
Share a screenshot of:
1. Render Environment Variables tab (hide the actual key value)
2. WordPress plugin settings page
3. The exact error message
