@echo off
echo === Building frontend ===
cd /d "%~dp0petstore-frontend"
call npm run build

echo === Cleaning backend static ===
rd /s /q "%~dp0petstore-server\src\main\resources\static\assets" 2>nul
del /q "%~dp0petstore-server\src\main\resources\static\index.html" 2>nul

echo === Copying to backend static ===
xcopy /E /Y /Q dist\* "%~dp0petstore-server\src\main\resources\static\"

echo === Done! Start backend with: cd petstore-server ^&^& mvn spring-boot:run ===
pause
