@echo off
title PetStore Launcher

echo.
echo  ==========================================
echo    PetStore Launcher
echo  ==========================================
echo.

echo  Starting backend (Spring Boot)...
cd /d "%~dp0petstore-server"
start /min "PetStore-Backend" cmd /c "mvn spring-boot:run"

echo       Waiting for backend to start...
timeout /t 20 /nobreak >nul

echo.
echo  ==========================================
echo    Backend started!
echo  ==========================================
echo.
echo    Backend API : http://localhost:8080
echo.
echo  ==========================================
echo    Run stop.bat to stop all services
echo  ==========================================
echo.
pause
