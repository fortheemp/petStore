@echo off

echo Stopping PetStore services...

taskkill /FI "WINDOWTITLE eq PetStore-Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq PetStore-Frontend*" /F >nul 2>&1
taskkill /IM java.exe /F >nul 2>&1

echo.
echo  All PetStore services stopped.
echo.
pause
