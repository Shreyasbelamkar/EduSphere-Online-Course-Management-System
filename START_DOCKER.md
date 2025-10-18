# 🐳 How to Start Docker Desktop

## The Problem
You're getting this error:
```
request returned 500 Internal Server Error for API route
```

This means **Docker Desktop is not running**.

---

## Solution: Start Docker Desktop

### Step 1: Open Docker Desktop
1. Press **Windows Key**
2. Type: `Docker Desktop`
3. Click on **Docker Desktop** application
4. Wait for it to open

### Step 2: Wait for Docker to Start
- Look at the **system tray** (bottom-right corner of Windows taskbar)
- You'll see the Docker whale icon
- Wait until it shows: **"Docker Desktop is running"**
- This takes about 30-60 seconds

### Step 3: Verify Docker is Running
Open PowerShell and run:
```powershell
docker ps
```

**Expected Output:**
```
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```
(Empty table is OK - it means Docker is running)

**Bad Output (means Docker not running):**
```
error during connect: ... cannot find the file specified
```

---

## After Docker is Running

### Start the Database
```powershell
# Navigate to infra folder
cd d:\edu sphere\infra

# Start MySQL and phpMyAdmin
docker-compose up -d

# Verify containers are running
docker-compose ps
```

**Expected Output:**
```
NAME                    STATUS          PORTS
edusphere_mysql         Up 5 seconds    0.0.0.0:3306->3306/tcp
edusphere_phpmyadmin    Up 5 seconds    0.0.0.0:8080->80/tcp
```

### Start the Application
```powershell
# Go back to project root
cd d:\edu sphere

# Start both frontend and backend
npm run dev
```

---

## Troubleshooting

### Docker Desktop Won't Start
1. **Restart your computer** - Sometimes Docker needs a fresh start
2. **Check if WSL 2 is installed** - Docker Desktop requires WSL 2 on Windows
3. **Run as Administrator** - Right-click Docker Desktop → Run as administrator

### Docker Desktop Stuck on "Starting"
1. Close Docker Desktop completely
2. Open Task Manager (Ctrl+Shift+Esc)
3. End all Docker processes
4. Restart Docker Desktop

### "WSL 2 installation is incomplete"
1. Open PowerShell as Administrator
2. Run: `wsl --install`
3. Restart your computer
4. Start Docker Desktop again

---

## Quick Checklist

- [ ] Docker Desktop application is open
- [ ] System tray shows "Docker Desktop is running"
- [ ] `docker ps` command works (no error)
- [ ] `docker-compose up -d` in infra folder succeeds
- [ ] `docker-compose ps` shows 2 containers running
- [ ] `npm run dev` starts without database connection errors

---

## What Happens After Docker Starts

Once Docker is running and you start the database:

1. **MySQL Database** will be available on `localhost:3306`
2. **phpMyAdmin** will be available on `http://localhost:8080`
3. **Backend API** can connect to the database
4. **Application** will run successfully

---

## Next Steps

After Docker is running:
1. ✅ Start database: `cd infra && docker-compose up -d`
2. ✅ Verify: `docker-compose ps`
3. ✅ Start app: `cd .. && npm run dev`
4. ✅ Open browser: http://localhost:3000

---

**Remember:** Docker Desktop must be running EVERY TIME you want to work on this project!
