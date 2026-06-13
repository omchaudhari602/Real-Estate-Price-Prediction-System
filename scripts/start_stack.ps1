<#
Start the full docker-compose stack (builds images if needed).
Run from project root.
#>
Write-Host "Starting docker-compose stack..." -ForegroundColor Cyan

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker CLI not found. Install Docker Desktop first or run scripts/install_docker.ps1 as Administrator."
    exit 1
}

Push-Location -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition)
# ensure we are in repo root
Set-Location ..

try {
    docker compose up --build -d
    Write-Host "Stack started. Use 'docker compose ps' to see services." -ForegroundColor Green
} catch {
    Write-Error "Failed to start docker compose stack: $_"
}
