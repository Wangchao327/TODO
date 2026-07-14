$launcher = Join-Path $PSScriptRoot "launch.bat"
$desktop = [Environment]::GetFolderPath("Desktop")
$shortcut = Join-Path $desktop "TODO.lnk"

if (-not (Test-Path $launcher)) {
    Write-Host "[ERROR] launch.bat not found." -ForegroundColor Red
    Read-Host
    exit 1
}

Write-Host "[1/3] Creating desktop shortcut..."

$edge = $null
if (Test-Path "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe") {
    $edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
} elseif (Test-Path "C:\Program Files\Microsoft\Edge\Application\msedge.exe") {
    $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$ws = New-Object -ComObject WScript.Shell
$s = $ws.CreateShortcut($shortcut)
$s.TargetPath = $launcher
$s.WorkingDirectory = $PSScriptRoot
$s.Description = "TODO Daily Check-in"
if ($edge) {
    $s.IconLocation = "$edge,0"
}
$s.Save()

Write-Host "       OK." -ForegroundColor Green

Write-Host "[2/2] Done!"
Write-Host ""
Write-Host "--------------------------------------------"
Write-Host "  Desktop shortcut created."
Write-Host "  Double-click to open TODO app."
Write-Host "--------------------------------------------"
Write-Host ""
Write-Host "Tip: drag to taskbar to pin for quick access."
Write-Host ""
Write-Host "Launching now..."
Start-Process $launcher
