<#
Start backend in development mode (virtualenv + uvicorn)
Run from project root.
#>
$backendDir = Join-Path -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition) -ChildPath '..\backend'
Set-Location $backendDir

if (-not (Test-Path ".venv")) {
    python -m venv .venv
}

.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
