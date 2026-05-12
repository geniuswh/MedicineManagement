@echo off
chcp 65001 >nul
echo ========================================
echo   医药管理系统 - 启动脚本
echo ========================================
echo.

echo [1/3] 启动后端服务 (端口 3002)...
start cmd /k "cd server && node index.js"
timeout /t 3 >nul

echo [2/3] 启动 Web 前端 (端口 3000)...
start cmd /k "cd web-frontend && npm run dev"
timeout /t 2 >nul

echo [3/3] 启动后台管理 (端口 3001)...
start cmd /k "cd admin-frontend && npm run dev -- --port 3001"
timeout /t 2 >nul

echo ========================================
echo   所有服务启动完成!
echo ========================================
echo.
echo   访问地址:
echo   - 后端API:    http://localhost:3002/api
echo   - Web前端:    http://localhost:3000
echo   - 后台管理:   http://localhost:3001
echo ========================================
echo.
echo   默认账号: admin / admin123
echo ========================================
echo.
pause
