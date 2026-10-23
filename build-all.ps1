# Smart Disaster Response Platform — Full Build Script
# Run from repo root: .\build-all.ps1
# No AWS, Firebase, or IoT hardware required.

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

Write-Host "`n=== SDRP Local Build (Review Ready) ===" -ForegroundColor Cyan

Write-Host "`n[1/4] Backend dependencies..." -ForegroundColor Yellow
Push-Location "$root\backend"
npm install --no-fund --no-audit
Pop-Location

Write-Host "`n[2/4] ML service — install + train..." -ForegroundColor Yellow
Push-Location "$root\ml-service"
if (!(Test-Path "venv")) { py -3 -m venv venv }
.\venv\Scripts\pip.exe install -r requirements.txt -q
.\venv\Scripts\python.exe scripts/prepare_data.py
.\venv\Scripts\python.exe scripts/train.py
.\venv\Scripts\python.exe scripts/evaluate.py
Pop-Location

Write-Host "`n[3/4] Frontend production build..." -ForegroundColor Yellow
Push-Location "$root\frontend"
npm install --no-fund --no-audit
npm run build
Pop-Location

Write-Host "`n[4/4] Seeding MongoDB demo data..." -ForegroundColor Yellow
Push-Location "$root\backend"
npm run seed
Pop-Location

Write-Host "`n=== Build complete ===" -ForegroundColor Green
Write-Host "Start services:" -ForegroundColor Cyan
Write-Host "  Terminal 1: cd backend && npm run dev"
Write-Host "  Terminal 2: cd ml-service && .\venv\Scripts\activate && uvicorn main:app --reload --port 8000"
Write-Host "  Terminal 3: cd frontend && npm run dev"
Write-Host "  Terminal 4 (optional demo): cd sensor-simulator && node simulator.js high"
Write-Host "`nDemo login: admin@demo.sdrp / Demo@123`n"
