@echo off
REM Script to update scraper service URLs in WordPress plugin

echo Updating scraper service URLs to Render deployment...

powershell -Command "(Get-Content 'socialEmbed\includes\class-review-importer.php') -replace 'http://127.0.0.1:3000', 'https://review-scraper-service.onrender.com' | Set-Content 'socialEmbed\includes\class-review-importer.php'"

echo.
echo ✓ URLs updated successfully!
echo.
echo The plugin is now configured to use:
echo https://review-scraper-service.onrender.com
echo.
echo Next steps:
echo 1. Copy the socialEmbed folder to your WordPress plugins directory
echo 2. In WordPress Admin, go to Plugins and activate "Social Review Slider"
echo 3. Go to Reviews -^> Import Settings
echo 4. Enter API Key: social-review-scraper-secret-2024-xyz789
echo 5. Click "Test Service Connection"
echo.
pause
