@echo off
echo ===================================================
echo   DEPLOYING CHROME FIX TO RENDER
echo ===================================================
echo.
echo 1. Adding changed files (render.yaml, Dockerfile)...
git add render.yaml Dockerfile

echo.
echo 2. Committing changes...
git commit -m "Fix: Switch to Docker runtime for Puppeteer/Chrome support"

echo.
echo 3. Pushing to remote repository...
git push

echo.
echo ===================================================
echo   DONE! 
echo   Check your Render Dashboard for the new deployment.
echo   It should now build using Docker and fix the Chrome error.
echo ===================================================
pause
