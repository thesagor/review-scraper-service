@echo off
echo ===================================================
echo   SWITCHING TO OPENAI (PRIMARY)
echo ===================================================
echo.
echo 1. Adding changed files...
git add utils/ai-extractor.js render.yaml

echo.
echo 2. Committing changes...
git commit -m "Feat: Switch to OpenAI as primary AI provider with Gemini fallback"

echo.
echo 3. Pushing to remote repository...
git push

echo.
echo ===================================================
echo   DONE! 
echo   Now go to Render Dashboard and add your OPENAI_API_KEY
echo ===================================================
pause
