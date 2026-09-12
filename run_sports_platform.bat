@echo off
title Sports Platform Server
echo ===================================================
echo   ⚡ SPORTS PLATFORM - Starting Server...
echo ===================================================
echo.
cd /d "C:\Users\dhinagaran g\Desktop\report_generator"
echo Server URL: http://127.0.0.1:8000/
echo Press Ctrl+C in this window anytime to stop the server.
echo.
start http://127.0.0.1:8000/
"C:\Users\dhinagaran g\AppData\Local\Python\pythoncore-3.14-64\python.exe" -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
pause
