<#
Start both backend and frontend for local development in separate PowerShell windows.

This script launches two new PowerShell windows:
- one runs the backend development script `scripts/start_backend_dev.ps1`
- the other starts the frontend dev server (`npm run dev`) in the `frontend/` directory

Usage (from repo root):
  (Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned) ; .\scripts\start_dev.ps1
#>

Set-StrictMode -Version Latest

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path "$scriptDir\.."

Write-Host "Starting backend and frontend in separate windows..." -ForegroundColor Cyan

# Start backend in a new PowerShell window using the existing helper
$backendCmd = "(Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned) ; & '$repoRoot\scripts\start_backend_dev.ps1'"
Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command',$backendCmd

# Give backend a brief head start
Start-Sleep -Seconds 2

# Start frontend in a new PowerShell window
$frontendCmd = "cd '$repoRoot\frontend' ; npm run dev"
Start-Process -FilePath powershell -ArgumentList '-NoExit','-Command',$frontendCmd

Write-Host "Launched backend and frontend windows." -ForegroundColor Green
