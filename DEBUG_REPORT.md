# 🐛 EduSphere Debug Report
**Generated:** 2025-10-05T11:55:46+05:30

## Issues Found & Solutions

### ✅ Issue 1: Docker Compose Version Warning (FIXED)
**Problem:** `docker-compose.yml` uses obsolete `version: '3.8'` attribute
**Status:** ✅ FIXED
**Solution:** Removed the deprecated `version` line from `infra/docker-compose.yml`

---

### ❌ Issue 2: Docker Desktop Not Running
**Problem:** Docker daemon is not accessible
```
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.51/containers/json
```
**Status:** ❌ REQUIRES ACTION
**Solution:** 
1. Start Docker Desktop application
2. Wait for Docker to fully start (check system tray icon)
3. Verify with: `docker ps`

---

### ❌ Issue 3: Missing Environment Files
**Problem:** `.env` files don't exist for API and Web applications
**Status:** ❌ REQUIRES ACTION
**Solution:** Run the setup script or manually create files:

#### For API (`apps/api/.env`):
```bash
# Copy from example
cp apps/api/.env.example apps/api/.env

# Then edit with your MySQL credentials:
# - DB_PASSWORD (use 'root_password' if using Docker)
# - JWT_SECRET (generate a secure random string)
# - COOKIE_SECRET (generate a secure random string)
```

#### For Web (`apps/web/.env.local`):
```bash
cp apps/web/.env.local.example apps/web/.env.local
```

---

### ❌ Issue 4: Missing Node Modules
**Problem:** Dependencies not installed
**Status:** ❌ REQUIRES ACTION
**Solution:** Install dependencies in all locations:

```powershell
# Root dependencies
npm install

# Backend dependencies
cd apps/api
npm install

# Frontend dependencies
cd ../web
npm install

# Return to root
cd ../..
```

---

### ⚠️ Issue 5: Database Not Initialized
**Problem:** MySQL database and tables may not exist
**Status:** ⚠️ PENDING VERIFICATION
**Solution:** 

#### Option A: Using Docker (Recommended)
```powershell
cd infra
docker-compose up -d
```
The SQL files will auto-initialize:
- `infra/sql/schema.sql` - Creates tables
- `infra/sql/seed.sql` - Adds sample data

#### Option B: Using Local MySQL
```powershell
# Create database
mysql -u root -p -e "CREATE DATABASE edusphere;"

# Run schema
mysql -u root -p edusphere < infra/sql/schema.sql

# Run seed data
mysql -u root -p edusphere < infra/sql/seed.sql
```

---

## 🚀 Quick Fix Script

Run this PowerShell script to fix most issues:

```powershell
# Run the automated setup script
.\setup.ps1
```

This will:
- ✅ Install all dependencies
- ✅ Create environment files
- ✅ Provide next steps

---

## 📋 Manual Setup Checklist

- [ ] **Start Docker Desktop**
  - Check system tray for Docker icon
  - Ensure it shows "Docker Desktop is running"

- [ ] **Install Dependencies**
  ```powershell
  npm install
  cd apps/api && npm install
  cd ../web && npm install
  cd ../..
  ```

- [ ] **Create Environment Files**
  ```powershell
  # API environment
  cp apps/api/.env.example apps/api/.env
  
  # Web environment
  cp apps/web/.env.local.example apps/web/.env.local
  ```

- [ ] **Edit API .env File**
  - Open `apps/api/.env`
  - Set `DB_PASSWORD=root_password` (if using Docker)
  - Set `JWT_SECRET` to a random string
  - Set `COOKIE_SECRET` to a random string

- [ ] **Start Database**
  ```powershell
  cd infra
  docker-compose up -d
  ```

- [ ] **Verify Database**
  ```powershell
  # Check containers are running
  docker-compose ps
  
  # Should show:
  # - edusphere_mysql (port 3306)
  # - edusphere_phpmyadmin (port 8080)
  ```

- [ ] **Start Application**
  ```powershell
  # From root directory
  npm run dev
  ```

- [ ] **Verify Services**
  - Backend API: http://localhost:5000
  - Frontend Web: http://localhost:3000
  - phpMyAdmin: http://localhost:8080

---

## 🔍 Common Error Messages & Solutions

### Error: "Cannot connect to MySQL"
**Cause:** Database not running or wrong credentials
**Fix:**
1. Check Docker: `docker-compose ps`
2. Verify `.env` DB_PASSWORD matches docker-compose.yml (root_password)
3. Ensure DB_HOST=localhost and DB_PORT=3306

### Error: "Port 3000 already in use"
**Cause:** Another Next.js app is running
**Fix:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Error: "Port 5000 already in use"
**Cause:** Another Express app is running
**Fix:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

### Error: "Module not found"
**Cause:** Dependencies not installed
**Fix:**
```powershell
# Reinstall dependencies
rm -r node_modules
npm install
```

### Error: "Table doesn't exist"
**Cause:** Database not initialized
**Fix:**
```powershell
# Restart Docker containers (will re-run SQL scripts)
cd infra
docker-compose down
docker-compose up -d
```

---

## 🧪 Testing After Setup

### 1. Test Database Connection
```powershell
# Access phpMyAdmin
# URL: http://localhost:8080
# Username: root
# Password: root_password

# Check for tables:
# - users
# - courses
# - enrollments
# - contents
# - quizzes
# - quiz_attempts
```

### 2. Test Backend API
```powershell
# Health check
curl http://localhost:5000

# Should return API info or 404 (means server is running)
```

### 3. Test Frontend
```powershell
# Open browser
# URL: http://localhost:3000

# Should see EduSphere landing page
```

### 4. Test Authentication
1. Go to http://localhost:3000/register
2. Create a test account
3. Login at http://localhost:3000/login
4. Should redirect to dashboard

---

## 📊 System Requirements

- ✅ Node.js 18+ (Installed)
- ✅ Docker Desktop (Installed, needs to be running)
- ⚠️ MySQL 8.0 (via Docker)
- ⚠️ 4GB RAM minimum
- ⚠️ 2GB free disk space

---

## 🆘 Still Having Issues?

### Check Logs

**Backend Logs:**
```powershell
cd apps/api
npm run dev
# Watch for error messages
```

**Frontend Logs:**
```powershell
cd apps/web
npm run dev
# Watch for error messages
```

**Docker Logs:**
```powershell
cd infra
docker-compose logs mysql
docker-compose logs phpmyadmin
```

### Verify File Structure
```powershell
# Check critical files exist
ls apps/api/.env
ls apps/web/.env.local
ls apps/api/node_modules
ls apps/web/node_modules
ls infra/sql/schema.sql
ls infra/sql/seed.sql
```

### Clean Restart
```powershell
# Stop everything
docker-compose down
# Kill Node processes (Ctrl+C)

# Clean install
rm -r node_modules
rm -r apps/api/node_modules
rm -r apps/web/node_modules
npm install
cd apps/api && npm install
cd ../web && npm install
cd ../..

# Restart database
cd infra
docker-compose up -d
cd ..

# Start app
npm run dev
```

---

## 📝 Next Steps After Fixing

1. ✅ Verify all services are running
2. ✅ Test user registration and login
3. ✅ Test course creation (as instructor)
4. ✅ Test course enrollment (as student)
5. ✅ Check all dashboards (admin, instructor, student)
6. 📖 Review `GETTING_STARTED.md` for feature details
7. 🚀 Start Phase 2 development (content upload, quizzes)

---

## 🔗 Useful Resources

- **Setup Guide:** `GETTING_STARTED.md`
- **Quick Start:** `QUICK_START.md`
- **API Documentation:** `docs/API.postman_collection.json`
- **Project Summary:** `PROJECT_SUMMARY.md`
- **Phase 2 Guide:** `docs/PHASE2_GUIDE.md`

---

**Debug Report Complete** ✅
