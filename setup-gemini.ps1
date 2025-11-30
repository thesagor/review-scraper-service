$envFile = ".env"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   🤖 Google Gemini Setup (FREE) 🤖" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Get your FREE API Key here:" -ForegroundColor Yellow
Write-Host "   https://aistudio.google.com/app/apikey" -ForegroundColor White
Write-Host ""
Write-Host "2. Click 'Create API key'" -ForegroundColor Yellow
Write-Host "3. Copy the key (starts with AIza...)" -ForegroundColor Yellow
Write-Host ""

$geminiKey = Read-Host "Paste your Gemini API Key here"

if ([string]::IsNullOrWhiteSpace($geminiKey)) {
    Write-Host "❌ No key provided. Setup cancelled." -ForegroundColor Red
    exit
}

# Read existing .env or create new
if (Test-Path $envFile) {
    $content = Get-Content $envFile -Raw
} else {
    $content = "PORT=3000`nAPI_SECRET_KEY=social-review-scraper-secret-2024-xyz789`n"
}

# Remove existing GEMINI_API_KEY if present
$content = $content -replace "GEMINI_API_KEY=.*`n?", ""
$content = $content -replace "GEMINI_API_KEY=.*$", ""

# Add new key
$content += "`nGEMINI_API_KEY=$geminiKey"

# Save file
$content | Set-Content $envFile

Write-Host ""
Write-Host "✅ Gemini API Key saved to .env!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart the server: npm start" -ForegroundColor White
Write-Host "2. Test scraping: node test-scrape.js" -ForegroundColor White
