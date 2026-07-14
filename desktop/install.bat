@echo off
chcp 65001 >nul
echo.
echo    ============================================
echo        T O D O 每日打卡 - 桌面安装
echo    ============================================
echo.
echo    将在桌面创建快捷方式，并加入开机自启。
echo.

set "SCRIPT_DIR=%~dp0"
set "LAUNCHER=%SCRIPT_DIR%launch.bat"
set "DESKTOP=%USERPROFILE%\Desktop"
set "SHORTCUT=%DESKTOP%\每日TODO.lnk"
set "STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"

if not exist "%LAUNCHER%" (
    echo [错误] 未找到 launch.bat，请确保脚本在同一目录。
    pause >nul
    exit /b 1
)

echo [1/3] 创建桌面快捷方式...
powershell -Command ^
  "$edge = ''; ^
   if (Test-Path 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe') { $edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' } ^
   elseif (Test-Path 'C:\Program Files\Microsoft\Edge\Application\msedge.exe') { $edge = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe' }; ^
   $ws = New-Object -ComObject WScript.Shell; ^
   $s = $ws.CreateShortcut('%SHORTCUT%'); ^
   $s.TargetPath = '%LAUNCHER%'; ^
   $s.WorkingDirectory = '%SCRIPT_DIR%'; ^
   $s.Description = '每日TODO打卡应用'; ^
   if ($edge) { $s.IconLocation = $edge + ',0' }; ^
   $s.Save()"

if %errorlevel% neq 0 (
    echo [失败] 无法创建快捷方式，尝试以管理员身份运行。
    pause >nul
    exit /b 1
)
echo       已创建。

echo [2/3] 添加到开机启动...
copy "%SHORTCUT%" "%STARTUP%\" >nul 2>&1
if %errorlevel% neq 0 (
    echo [失败] 无法添加到启动文件夹，跳过此步骤。
) else (
    echo       已添加。
)

echo [3/3] 完成！
echo.
echo    +------------------------------------------------+
echo    ^|  快捷键: Win+1（拖到任务栏固定后）              ^|
echo    ^|  桌面图标: 双击即可打开                         ^|
echo    ^|  开机自启: 下次开机自动弹出                     ^|
echo    +------------------------------------------------+
echo.
echo 立即测试启动？
choice /c yn /n /m "按 Y 启动，按 N 退出: "
if %errorlevel% equ 2 goto :end
start "" "%LAUNCHER%"

:end
exit /b 0
