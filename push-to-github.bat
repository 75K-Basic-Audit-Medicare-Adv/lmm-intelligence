@echo off
REM This script pushes your code to GitHub automatically
REM Just double-click this file!

echo Installing Git check...
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Git is not installed. Please install Git from https://git-scm.com/download/win
    echo Then run this script again.
    pause
    exit /b 1
)

echo.
echo ============================================
echo Pushing code to GitHub
echo ============================================
echo.

REM Initialize git
echo Step 1: Initializing Git...
git init

REM Add all files
echo.
echo Step 2: Adding all files...
git add .

REM Create commit
echo.
echo Step 3: Creating commit...
git commit -m "Initial: Wall Street LMM Intelligence"

REM Set main branch
echo.
echo Step 4: Setting main branch...
git branch -M main

REM Add GitHub remote
echo.
echo Step 5: Adding GitHub remote...
git remote add origin https://github.com/lmm-intelligence/lmm-intelligence.git

REM Push to GitHub
echo.
echo Step 6: Pushing to GitHub...
echo.
echo When prompted:
echo   - Username: lmm-intelligence (your GitHub username)
echo   - Password: Your GitHub Personal Access Token
echo     (Get it at: github.com ^> Settings ^> Developer settings ^> Personal access tokens ^> Tokens ^(classic^) ^> Generate new token, check "repo")
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo SUCCESS! Your code is now on GitHub!
    echo ============================================
    echo.
    echo Next steps:
    echo 1. Go to vercel.com
    echo 2. Click "New Project"
    echo 3. Click "Import Git Repository"
    echo 4. Paste: https://github.com/lmm-intelligence/lmm-intelligence
    echo 5. Add environment variables and deploy
    echo.
) else (
    echo.
    echo ============================================
    echo ERROR! Something went wrong.
    echo ============================================
    echo.
)

pause
