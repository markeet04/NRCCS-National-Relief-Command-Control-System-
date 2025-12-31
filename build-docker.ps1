# ============================================
# NRCCS Docker Build Script
# Builds both frontend and backend images
# ============================================

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  NRCCS Docker Image Builder" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Get the project root directory
$ProjectRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$BackendDir = Join-Path $ProjectRoot "backend\nrccs"
$FrontendDir = Join-Path $ProjectRoot "frontend"
$ArtiintDir = Join-Path $ProjectRoot "Artiint"

Write-Host "Project Root: $ProjectRoot" -ForegroundColor Gray

# ============================================
# Step 1: Copy AI/ML assets to backend
# ============================================
Write-Host ""
Write-Host "[1/4] Copying AI/ML assets..." -ForegroundColor Yellow

$AiDir = Join-Path $BackendDir "ai"

# Copy model.pkl
$ModelSource = Join-Path $ArtiintDir "model.pkl"
$ModelDest = Join-Path $AiDir "model.pkl"

if (Test-Path $ModelSource) {
    Copy-Item $ModelSource $ModelDest -Force
    Write-Host "  ✓ Copied model.pkl" -ForegroundColor Green
} else {
    Write-Host "  ✗ Warning: model.pkl not found at $ModelSource" -ForegroundColor Red
    Write-Host "    Run train_model.py first to generate the model" -ForegroundColor Yellow
}

# ============================================
# Step 2: Build Backend Image
# ============================================
Write-Host ""
Write-Host "[2/4] Building Backend Image..." -ForegroundColor Yellow

Set-Location $BackendDir

docker build -t nrccs-backend:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Backend image built successfully" -ForegroundColor Green
} else {
    Write-Host "  ✗ Backend build failed!" -ForegroundColor Red
    exit 1
}

# ============================================
# Step 3: Build Frontend Image
# ============================================
Write-Host ""
Write-Host "[3/4] Building Frontend Image..." -ForegroundColor Yellow

Set-Location $FrontendDir

# Get backend URL from user or use default
$BackendUrl = Read-Host "Enter Backend API URL (press Enter for default: http://localhost:8080/api)"
if ([string]::IsNullOrEmpty($BackendUrl)) {
    $BackendUrl = "http://localhost:8080/api"
}

docker build --build-arg VITE_API_URL=$BackendUrl -t nrccs-frontend:latest .

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Frontend image built successfully" -ForegroundColor Green
} else {
    Write-Host "  ✗ Frontend build failed!" -ForegroundColor Red
    exit 1
}

# ============================================
# Step 4: Show Results
# ============================================
Write-Host ""
Write-Host "[4/4] Build Complete!" -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Docker Images Built Successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Images created:" -ForegroundColor White
docker images | Select-String "nrccs"
Write-Host ""
Write-Host "To test locally:" -ForegroundColor Yellow
Write-Host "  Backend:  docker run -p 8080:8080 -e DATABASE_URL='your-neon-url' -e SESSION_SECRET='secret' nrccs-backend:latest" -ForegroundColor Gray
Write-Host "  Frontend: docker run -p 3000:80 nrccs-frontend:latest" -ForegroundColor Gray
Write-Host ""
Write-Host "To push to GCP Artifact Registry:" -ForegroundColor Yellow
Write-Host "  docker tag nrccs-backend:latest REGION-docker.pkg.dev/PROJECT/REPO/backend:latest" -ForegroundColor Gray
Write-Host "  docker push REGION-docker.pkg.dev/PROJECT/REPO/backend:latest" -ForegroundColor Gray
Write-Host ""

# Return to project root
Set-Location $ProjectRoot
