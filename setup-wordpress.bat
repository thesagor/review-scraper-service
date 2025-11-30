@echo off
echo ========================================
echo WordPress Plugin Connection Setup
echo ========================================
echo.

REM Check if .env exists
if not exist ".env" (
    echo [ERROR] .env file not found!
    echo Please copy .env.example to .env and configure it first.
    echo.
    pause
    exit /b 1
)

echo [1/4] Checking .env configuration...
findstr /C:"API_SECRET_KEY=" .env >nul
if errorlevel 1 (
    echo [ERROR] API_SECRET_KEY not found in .env
    echo Please add API_SECRET_KEY to your .env file
    pause
    exit /b 1
)

echo [OK] .env file configured
echo.

echo [2/4] Testing if service is running...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:3000/health' -TimeoutSec 2 -UseBasicParsing; if ($response.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }"

if errorlevel 1 (
    echo [WARNING] Service is not running
    echo Starting the service now...
    echo.
    start "Scraper Service" cmd /k "npm start"
    timeout /t 5 /nobreak >nul
) else (
    echo [OK] Service is already running
)

echo.
echo [3/4] Running connection diagnostic...
echo.
node test-wordpress-connection.js

echo.
echo [4/4] WordPress Configuration
echo ========================================
echo.
echo Copy these settings to WordPress:
echo.
echo 1. Go to: WordPress Admin → Reviews → Import Settings
echo.
echo 2. Enter these values:
echo    - Scraper Service URL: http://127.0.0.1:3000
echo.

REM Extract API key from .env
for /f "tokens=2 delims==" %%a in ('findstr /C:"API_SECRET_KEY=" .env') do (
    echo    - API Secret Key: %%a
)

echo.
echo 3. Click "Test Service Connection"
echo.
echo 4. If successful, add your platform URLs and click "Import Reviews Now"
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
pause
