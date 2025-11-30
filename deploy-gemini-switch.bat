@echo off
echo ===================================================
echo   SWITCHING TO GEMINI (PRIMARY)
echo ===================================================
echo.
echo 1. Adding changed files...
git add utils/ai-extractor.js

echo.
echo 2. Committing changes...
git commit -m "Feat: Switch back to Gemini as primary AI provider with OpenAI fallback"

echo.
echo 3. Pushing to remote repository...
git push

echo.
echo ===================================================
echo   DONE! 
echo   Render will now rebuild your service.
echo   Gemini is now the primary AI provider.
echo ===================================================
pause
