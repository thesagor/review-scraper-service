@echo off
echo ===================================================
echo   DEPLOYING PUPPETEER FIXES TO RENDER
echo ===================================================
echo.
echo 1. Adding changed files (scrapers/*.js)...
git add scrapers/airbnb-scraper.js scrapers/google-scraper.js scrapers/tripadvisor-scraper.js

echo.
echo 2. Committing changes...
git commit -m "Fix: Replace deprecated page.waitForTimeout with Promise-based delay"

echo.
echo 3. Pushing to remote repository...
git push

echo.
echo ===================================================
echo   DONE! 
echo   Render will now rebuild your service.
echo   This should fix the 'waitForTimeout is not a function' error.
echo ===================================================
pause
