# EduSphere Quick Setup Script for Windows
# Run this script in PowerShell: .\setup.ps1

Write-Host "🎓 EduSphere Setup Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check MySQL
Write-Host "Checking MySQL..." -ForegroundColor Yellow
try {
    $mysqlVersion = mysql --version
    Write-Host "✓ MySQL installed" -ForegroundColor Green
} catch {
    Write-Host "⚠ MySQL not found. You can use Docker instead." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host ""

# Install root dependencies
Write-Host "→ Installing root dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install root dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Root dependencies installed" -ForegroundColor Green

# Install backend dependencies
Write-Host "→ Installing backend dependencies..." -ForegroundColor Cyan
Set-Location apps/api
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green

# Install frontend dependencies
Write-Host "→ Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location ../web
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green

# Return to root
Set-Location ../..

Write-Host ""
Write-Host "Setting up environment files..." -ForegroundColor Yellow

# Setup backend .env
if (-Not (Test-Path "apps/api/.env")) {
    Copy-Item "apps/api/.env.example" "apps/api/.env"
    Write-Host "✓ Created apps/api/.env (please edit with your MySQL credentials)" -ForegroundColor Green
} else {
    Write-Host "⚠ apps/api/.env already exists" -ForegroundColor Yellow
}

# Setup frontend .env.local
if (-Not (Test-Path "apps/web/.env.local")) {
    Copy-Item "apps/web/.env.local.example" "apps/web/.env.local"
    Write-Host "✓ Created apps/web/.env.local" -ForegroundColor Green
} else {
    Write-Host "⚠ apps/web/.env.local already exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit apps/api/.env with your MySQL credentials" -ForegroundColor White
Write-Host "2. Create database: mysql -u root -p edusphere" -ForegroundColor White
Write-Host "   Then run: mysql -u root -p edusphere -e 'source infra/sql/schema.sql'" -ForegroundColor White
Write-Host "   OR use Docker: cd infra; docker-compose up -d" -ForegroundColor White
Write-Host "3. Start the application: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed instructions, see GETTING_STARTED.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Happy coding!" -ForegroundColor Green
