<#
PowerShell helper to install Docker Desktop on Windows.
This script tries winget, and falls back to installing Chocolatey then Docker.
Run as Administrator.
#>

Write-Host "Starting Docker Desktop install helper..." -ForegroundColor Cyan

function Install-WSL2 {
    Write-Host "Ensuring WSL2 is enabled..." -ForegroundColor Cyan
    try {
        wsl --install -v 2
        Write-Host "WSL install invoked (may require reboot)." -ForegroundColor Green
    } catch {
        Write-Host "wsl --install failed or already present. Attempting to enable features..." -ForegroundColor Yellow
        dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
        dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
        Write-Host "WSL/VirtualMachinePlatform features enabled (reboot may be required)." -ForegroundColor Green
    }
}

function Install-DockerWithWinget {
    Write-Host "Trying winget to install Docker Desktop..." -ForegroundColor Cyan
    try {
        winget install --id Docker.DockerDesktop -e --accept-package-agreements --accept-source-agreements
        return $true
    } catch {
        Write-Host "winget install failed or winget not available." -ForegroundColor Yellow
        return $false
    }
}

function Install-Chocolatey {
    Write-Host "Installing Chocolatey..." -ForegroundColor Cyan
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

function Install-DockerWithChoco {
    Write-Host "Installing Docker Desktop via Chocolatey..." -ForegroundColor Cyan
    choco install docker-desktop -y
}

if (-not ([bool](Get-Command docker -ErrorAction SilentlyContinue))) {
    Install-WSL2
    $ok = $false
    if ([bool](Get-Command winget -ErrorAction SilentlyContinue)) {
        $ok = Install-DockerWithWinget
    }
    if (-not $ok) {
        if (-not ([bool](Get-Command choco -ErrorAction SilentlyContinue))) {
            Install-Chocolatey
            # Refresh session to make choco available; user may need to re-open terminal
            Write-Host "Chocolatey installed. You may need to open a new Admin PowerShell to continue." -ForegroundColor Yellow
        }
        if ([bool](Get-Command choco -ErrorAction SilentlyContinue)) {
            Install-DockerWithChoco
        } else {
            Write-Host "Chocolatey not available. Please re-open PowerShell as Admin and run this script again." -ForegroundColor Red
        }
    } else {
        Write-Host "Docker Desktop installed via winget." -ForegroundColor Green
    }
} else {
    Write-Host "Docker CLI already present. Skipping installation." -ForegroundColor Green
}

Write-Host "Installation script finished. Please start Docker Desktop from Start Menu and allow WSL2 integration if prompted." -ForegroundColor Cyan
