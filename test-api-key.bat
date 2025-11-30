@echo off
echo Testing API Key Authentication...
echo.

REM Test with the API key from render.yaml
curl -X POST https://review-scraper-service.onrender.com/api/scrape/google ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: social-review-scraper-secret-2024-xyz789" ^
  -d "{\"placeUrl\": \"test\"}"

echo.
echo.
echo If you see HTTP 400 (bad request) = API key is VALID
echo If you see HTTP 401 (unauthorized) = API key is INVALID
echo.
pause
