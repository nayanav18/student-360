@echo off
title Push Student 360 to GitHub
cd /d "C:\Users\Admin\OneDrive\Desktop\react\student360"
echo ===================================================
echo   Pushing Student 360 to GitHub:
echo   https://github.com/nayanav18/student-360
echo ===================================================
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Code pushed successfully to:
    echo https://github.com/nayanav18/student-360
) else (
    echo [NOTE] If a browser window opened, click "Sign in with your browser" / "Authorize" to complete the push.
)
echo.
echo Press any key to close this window...
pause >nul
