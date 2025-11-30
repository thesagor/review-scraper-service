$envFile = ".env"
$apiSecret = "social-review-scraper-secret-2024-xyz789"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   🤖 Configuring Gemini API 🤖" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Read existing .env or create from example
if (Test-Path $envFile) {
    $content = Get-Content $envFile -Raw
} else {
    if (Test-Path ".env.example") {
        $content = Get-Content ".env.example" -Raw
    } else {
        $content = "PORT=3000`nNODE_ENV=development`n"
    }
}

# Update or add GEMINI_API_KEY
if ($content -match "GEMINI_API_KEY=") {
    $content = $content -replace "GEMINI_API_KEY=.*", "GEMINI_API_KEY=$geminiKey"
} else {
    $content += "`nGEMINI_API_KEY=$geminiKey"
}

# Update or add API_SECRET_KEY
if ($content -match "API_SECRET_KEY=") {
    $content = $content -replace "API_SECRET_KEY=.*", "API_SECRET_KEY=$apiSecret"
} else {
    $content += "`nAPI_SECRET_KEY=$apiSecret"
}

# Comment out OpenAI key if present
$content = $content -replace "^OPENAI_API_KEY=", "# OPENAI_API_KEY="

# Ensure production mode
$content = $content -replace "NODE_ENV=development", "NODE_ENV=production"

# Save file
$content | Set-Content $envFile

Write-Host "✅ Configuration Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your configuration:" -ForegroundColor Cyan
Write-Host "  - AI Provider: Google Gemini (FREE)" -ForegroundColor Green
Write-Host "  - Gemini API Key: Configured" -ForegroundColor Green
Write-Host "  - API Secret Key: $apiSecret" -ForegroundColor Yellow
Write-Host "  - Port: 3000" -ForegroundColor White
Write-Host "  - Environment: production" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT: Save this API Secret Key!" -ForegroundColor Yellow
Write-Host "You will need it in WordPress settings: $apiSecret" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Install dependencies: npm install" -ForegroundColor White
Write-Host "2. Start the service: npm start" -ForegroundColor White
Write-Host "3. Test scraping: node test-scrape.js" -ForegroundColor White
Write-Host ""
