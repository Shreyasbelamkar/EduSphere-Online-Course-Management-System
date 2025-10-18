# 🚀 How to Run EduSphere Project

## Prerequisites Check
- ✅ Node.js installed (you have it)
- ✅ Docker Desktop installed (you have it)
- ⚠️ Docker Desktop must be **RUNNING**

---

## Step-by-Step Setup & Run

### Step 1: Start Docker Desktop
1. Open Docker Desktop application from Start menu
2. Wait until it shows "Docker Desktop is running" in system tray
3. Verify: Open PowerShell and run `docker ps` (should not error)

### Step 2: Install Dependencies

```powershell
# In project root (d:\edu sphere)

# Install root dependencies
npm install

# Install backend dependencies
cd apps\api
npm install
cd ..\..

# Install frontend dependencies
cd apps\web
npm install
cd ..\..
```

### Step 3: Create Environment Files

```powershell
# Create API environment file
Copy-Item apps\api\.env.example apps\api\.env

# Create Web environment file
Copy-Item apps\web\.env.local.example apps\web\.env.local
```

### Step 4: Edit API Environment File

Open `apps\api\.env` in your editor and update:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root_password
DB_NAME=edusphere

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Cookie Configuration
COOKIE_SECRET=your-cookie-secret-key-change-in-production-67890
```

**Important:** Make sure `DB_PASSWORD=root_password` matches the password in `infra\docker-compose.yml`

### Step 5: Start Database

```powershell
# Navigate to infra folder
cd infra

# Start MySQL and phpMyAdmin containers
docker-compose up -d

# Verify containers are running
docker-compose ps

# You should see:
# - edusphere_mysql (running on port 3306)
# - edusphere_phpmyadmin (running on port 8080)

# Return to root
cd ..
```

### Step 6: Start the Application

```powershell
# From project root (d:\edu sphere)
npm run dev
```

This will start:
- **Backend API** on http://localhost:5000
- **Frontend Web** on http://localhost:3000

---

## Alternative: Start Services Separately

If `npm run dev` doesn't work, start each service in separate terminals:

### Terminal 1 - Backend API
```powershell
cd d:\edu sphere\apps\api
npm run dev
```

### Terminal 2 - Frontend Web
```powershell
cd d:\edu sphere\apps\web
npm run dev
```

---

## Verify Everything is Working

### 1. Check Database (phpMyAdmin)
- Open: http://localhost:8080
- Login:
  - Username: `root`
  - Password: `root_password`
- You should see `edusphere` database with tables:
  - users
  - courses
  - enrollments
  - contents
  - quizzes
  - quiz_attempts

### 2. Check Backend API
- Open: http://localhost:5000
- You should see a response (might be 404, that's OK - means server is running)

### 3. Check Frontend
- Open: http://localhost:3000
- You should see the EduSphere landing page

### 4. Test Registration
1. Go to http://localhost:3000/register
2. Create an account:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Role: Student
3. Click Register
4. Should redirect to login

### 5. Test Login
1. Go to http://localhost:3000/login
2. Login with credentials from step 4
3. Should redirect to dashboard

---

## Common Issues & Solutions

### Issue: "Docker daemon is not running"
**Solution:** Start Docker Desktop application and wait for it to fully start

### Issue: "Port 3000 already in use"
**Solution:**
```powershell
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Issue: "Port 5000 already in use"
**Solution:**
```powershell
# Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Issue: "Cannot connect to database"
**Solutions:**
1. Check Docker containers are running: `docker-compose ps`
2. Verify DB_PASSWORD in `apps\api\.env` is `root_password`
3. Restart containers:
   ```powershell
   cd infra
   docker-compose down
   docker-compose up -d
   ```

### Issue: "Module not found"
**Solution:**
```powershell
# Reinstall dependencies
npm install
cd apps\api && npm install
cd ..\web && npm install
cd ..\..
```

---

## Quick Commands Reference

```powershell
# Start database
cd infra && docker-compose up -d && cd ..

# Stop database
cd infra && docker-compose down && cd ..

# View database logs
cd infra && docker-compose logs mysql

# Start application (both frontend + backend)
npm run dev

# Start backend only
cd apps\api && npm run dev

# Start frontend only
cd apps\web && npm run dev

# Check Docker containers
docker ps

# Access database CLI
docker exec -it edusphere_mysql mysql -u root -p
# Password: root_password
```

---

## What You Should See

### Terminal Output (Backend)
```
✅ Database connection established
🚀 Server running on http://localhost:5000
📝 Environment: development
```

### Terminal Output (Frontend)
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

---

## Next Steps After Running

1. ✅ Create test accounts (Admin, Instructor, Student)
2. ✅ Test course creation as Instructor
3. ✅ Test course enrollment as Student
4. ✅ Explore all dashboards
5. 📖 Read `GETTING_STARTED.md` for feature details
6. 🚀 Start building Phase 2 features

---

**Need Help?** Check `DEBUG_REPORT.md` for detailed troubleshooting.
