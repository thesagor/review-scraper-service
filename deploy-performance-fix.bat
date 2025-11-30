@echo off
echo ===================================================
echo   DEPLOYING PERFORMANCE FIXES TO RENDER
echo ===================================================
echo.
echo 1. Adding changed files (scrapers/*.js)...
git add scrapers/airbnb-scraper.js scrapers/google-scraper.js scrapers/tripadvisor-scraper.js

echo.
echo 2. Committing changes...
git commit -m "Fix: Optimize scrapers with longer timeouts and resource blocking"

echo.
echo 3. Pushing to remote repository...
git push

echo.
echo ===================================================
echo   DONE! 
echo   Render will now rebuild your service.
echo   This should fix the TimeoutError.
echo ===================================================
pause
