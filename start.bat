@echo off
title PetStore Dev Launcher

echo.
echo  ==========================================
echo    PetStore Dev Launcher
echo  ==========================================
echo.

echo  [1/2] Starting backend (Spring Boot)...
cd /d "%~dp0petstore-server"
start /min "PetStore-Backend" cmd /c "mvn spring-boot:run"

echo       Waiting for backend to start...
timeout /t 20 /nobreak >nul

echo  [2/2] Starting PC frontend (Vue3)...
cd /d "%~dp0petstore-frontend"
start /min "PetStore-Frontend" cmd /c "npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo  ==========================================
echo    All services started!
echo  ==========================================
echo.
echo    Backend API : http://localhost:8080
echo    PC Frontend : http://localhost:5173
echo    Mobile      : Open with HBuilderX
echo.
echo  ==========================================
echo    Run stop.bat to stop all services
echo  ==========================================
echo.
pause
