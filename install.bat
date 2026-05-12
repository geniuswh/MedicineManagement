@echo off
chcp 65001 >nul
echo ========================================
echo   医药管理系统 - 依赖安装脚本
echo ========================================
echo.

echo [1/3] 安装 Web 前端依赖...
cd web-frontend
call npm install
cd ..

echo.
echo [2/3] 安装后台管理依赖...
cd admin-frontend
call npm install
cd ..

echo.
echo [3/3] 所有依赖安装完成!
echo.
echo 现在可以运行 start.bat 启动项目
echo.
pause
