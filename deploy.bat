@echo off
echo ==============================================
echo 🚀 Deploying Shorubenix Frontend to Netlify
echo ==============================================
echo.
echo Step 1: Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix build errors before deploying.
    pause
    exit /b %errorlevel%
)
echo.
echo Step 2: Logging into Netlify...
call npx netlify-cli login
echo.
echo Step 3: Deploying to Netlify...
call npx netlify-cli deploy --prod --dir=dist
echo.
echo 🎉 Deployment complete!
pause
