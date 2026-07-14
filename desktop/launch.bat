@echo off
chcp 65001 >nul
set "URL=https://Wangchao327.github.io/TODO"

where msedge >nul 2>&1
if %errorlevel% equ 0 (
    start "" msedge --app=%URL%
    exit /b 0
)

if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=%URL%
    exit /b 0
)
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --app=%URL%
    exit /b 0
)

where chrome >nul 2>&1
if %errorlevel% equ 0 (
    start "" chrome --app=%URL%
    exit /b 0
)

start "" %URL%
