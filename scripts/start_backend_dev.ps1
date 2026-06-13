<#
Start backend for local development (PowerShell)

This script performs the common developer setup steps:
- generate a local .env from .env.example (if missing)
- create and activate a virtual environment (.venv)
- install backend dependencies
- generate an example ML model for predict endpoint (if missing)
- start the FastAPI backend with uvicorn

Usage: run from the repository root in PowerShell:
  (Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned) ; .\scripts\start_backend_dev.ps1
#>

Set-StrictMode -Version Latest

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $root\..\

Write-Host "Running backend dev setup in: $(Get-Location)" -ForegroundColor Cyan

if (-not (Test-Path .env)) {
    Write-Host "Creating .env from .env.example (and generating SECRET_KEY)..." -ForegroundColor Yellow
    python scripts/generate_env.py
} else {
    Write-Host ".env already exists — skipping generation" -ForegroundColor Green
}

if (-not (Test-Path .venv)) {
    Write-Host "Creating virtual environment .venv..." -ForegroundColor Yellow
    python -m venv .venv
} else {
    Write-Host "Virtual environment .venv already exists" -ForegroundColor Green
}

Write-Host "Activating virtual environment" -ForegroundColor Cyan
& .venv\Scripts\Activate.ps1

Write-Host "Installing backend dependencies (this may take a minute)..." -ForegroundColor Cyan
pip install --upgrade pip
pip install -r backend/requirements.txt

Write-Host "Ensure example model exists for predict endpoint..." -ForegroundColor Cyan
python scripts/generate_example_model.py

Write-Host "Starting backend (uvicorn) on http://0.0.0.0:8000 ..." -ForegroundColor Cyan
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

Pop-Location
