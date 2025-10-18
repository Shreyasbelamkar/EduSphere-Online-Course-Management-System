# ✅ EduSphere Installation Checklist

Use this checklist to ensure proper setup of your EduSphere project.

## Pre-Installation

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MySQL 8.0+ installed OR Docker installed
- [ ] Git installed (for version control)
- [ ] Code editor installed (VS Code recommended)

## Step 1: Project Setup

- [ ] Navigate to project directory: `cd "d:/edu sphere"`
- [ ] Verify all files are present (README.md, package.json, etc.)
- [ ] Run setup script: `.\setup.ps1` (Windows) or manual installation

## Step 2: Dependencies Installation

### Root Dependencies
- [ ] Run `npm install` in root directory
- [ ] Verify `node_modules` folder created
- [ ] Check for any error messages

### Backend Dependencies
- [ ] Navigate to `apps/api`
- [ ] Run `npm install`
- [ ] Verify `node_modules` folder created
- [ ] Check `package.json` has all dependencies

### Frontend Dependencies
- [ ] Navigate to `apps/web`
- [ ] Run `npm install`
- [ ] Verify `node_modules` folder created
- [ ] Check for peer dependency warnings (normal)

## Step 3: Environment Configuration

### Backend Environment
- [ ] Copy `apps/api/.env.example` to `apps/api/.env`
- [ ] Edit `apps/api/.env`:
  - [ ] Set `DB_HOST` (default: localhost)
  - [ ] Set `DB_PORT` (default: 3306)
  - [ ] Set `DB_USER` (your MySQL username)
  - [ ] Set `DB_PASSWORD` (your MySQL password)
  - [ ] Set `DB_NAME` (edusphere)
  - [ ] Set `JWT_SECRET` (generate a strong random string)
  - [ ] Set `CORS_ORIGIN` (http://localhost:3000)
- [ ] Save the file

### Frontend Environment
- [ ] Copy `apps/web/.env.local.example` to `apps/web/.env.local`
- [ ] Edit `apps/web/.env.local`:
  - [ ] Set `NEXT_PUBLIC_API_BASE_URL` (http://localhost:5000/api)
- [ ] Save the file

## Step 4: Database Setup

### Option A: Docker (Recommended)
- [ ] Navigate to `infra` directory
- [ ] Run `docker-compose up -d`
- [ ] Wait for containers to start (30 seconds)
- [ ] Verify MySQL is running: `docker ps`
- [ ] Access phpMyAdmin at http://localhost:8080
  - Username: `root`
  - Password: `root_password`
- [ ] Verify `edusphere` database exists

### Option B: Manual MySQL Setup
- [ ] Start MySQL service
- [ ] Connect to MySQL: `mysql -u root -p`
- [ ] Create database: `CREATE DATABASE edusphere;`
- [ ] Exit MySQL: `exit`
- [ ] Import schema: `mysql -u root -p edusphere < infra/sql/schema.sql`
- [ ] (Optional) Import seed data: `mysql -u root -p edusphere < infra/sql/seed.sql`

### Verify Database
- [ ] Connect to database: `mysql -u root -p edusphere`
- [ ] List tables: `SHOW TABLES;`
- [ ] Should see: users, courses, enrollments, contents, quizzes, quiz_attempts
- [ ] Exit: `exit`

## Step 5: Start the Application

### Option A: Start Both (Recommended)
- [ ] Navigate to root directory
- [ ] Run `npm run dev`
- [ ] Wait for both servers to start
- [ ] Check terminal for success messages

### Option B: Start Separately

#### Backend
- [ ] Open terminal 1
- [ ] Navigate to `apps/api`
- [ ] Run `npm run dev`
- [ ] Wait for "Server running on http://localhost:5000"
- [ ] Check for "Database connection established"

#### Frontend
- [ ] Open terminal 2
- [ ] Navigate to `apps/web`
- [ ] Run `npm run dev`
- [ ] Wait for "Ready on http://localhost:3000"
- [ ] Check for compilation success

## Step 6: Verify Installation

### Backend Verification
- [ ] Open browser to http://localhost:5000/health
- [ ] Should see: `{"status":"ok","timestamp":"..."}`
- [ ] Check terminal for no error messages

### Frontend Verification
- [ ] Open browser to http://localhost:3000
- [ ] Landing page loads successfully
- [ ] Navigation bar is visible
- [ ] No console errors in browser DevTools (F12)

### Database Verification
- [ ] Backend terminal shows "Database connection established"
- [ ] No connection errors in logs

## Step 7: Test Core Features

### Authentication Test
- [ ] Click "Sign Up" on homepage
- [ ] Fill registration form:
  - Name: Test User
  - Email: test@example.com
  - Password: password123
  - Role: Student
- [ ] Submit form
- [ ] Should redirect to dashboard
- [ ] User name appears in navbar
- [ ] Click "Logout"
- [ ] Should redirect to login page

### Login Test
- [ ] Click "Sign In"
- [ ] Enter credentials:
  - Email: test@example.com
  - Password: password123
- [ ] Submit form
- [ ] Should redirect to dashboard
- [ ] Dashboard shows "Welcome back, Test User"

### Course Browsing Test
- [ ] Click "Courses" in navbar
- [ ] Course listing page loads
- [ ] Search bar is visible
- [ ] (If seed data imported) Sample courses appear

### Instructor Test
- [ ] Logout current user
- [ ] Register new user with "Instructor" role
- [ ] Login as instructor
- [ ] Go to Dashboard
- [ ] Click "Create New Course"
- [ ] Fill course form:
  - Title: Test Course
  - Description: This is a test course
- [ ] Submit form
- [ ] Course appears in "My Courses"

### Student Enrollment Test
- [ ] Logout instructor
- [ ] Login as student (test@example.com)
- [ ] Go to "Courses"
- [ ] Click on "Test Course"
- [ ] Click "Enroll in Course"
- [ ] Should see "Successfully enrolled!"
- [ ] Go to Dashboard
- [ ] "Test Course" appears in enrolled courses

## Step 8: API Testing (Optional)

### Postman Setup
- [ ] Install Postman (if not already installed)
- [ ] Open Postman
- [ ] Click "Import"
- [ ] Select `docs/API.postman_collection.json`
- [ ] Collection imported successfully

### Test Endpoints
- [ ] Set `baseUrl` variable to `http://localhost:5000/api`
- [ ] Test "Register" endpoint
- [ ] Test "Login" endpoint (saves cookie)
- [ ] Test "Get Current User" endpoint
- [ ] Test "Get All Courses" endpoint
- [ ] Test "Create Course" endpoint (as instructor)

## Step 9: Development Tools Setup (Optional)

### VS Code Extensions
- [ ] ESLint
- [ ] Prettier
- [ ] Tailwind CSS IntelliSense
- [ ] ES7+ React/Redux/React-Native snippets
- [ ] MySQL (for database management)

### Browser Extensions
- [ ] React Developer Tools
- [ ] Redux DevTools (if using Redux later)

## Troubleshooting Checklist

### Database Issues
- [ ] MySQL service is running
- [ ] Credentials in `.env` are correct
- [ ] Database `edusphere` exists
- [ ] Schema has been imported
- [ ] Firewall allows MySQL connections

### Backend Issues
- [ ] Port 5000 is not in use
- [ ] All dependencies installed
- [ ] `.env` file exists and is configured
- [ ] TypeScript compiles without errors
- [ ] No syntax errors in code

### Frontend Issues
- [ ] Port 3000 is not in use
- [ ] All dependencies installed
- [ ] `.env.local` file exists
- [ ] API URL is correct
- [ ] No TypeScript errors

### CORS Issues
- [ ] `CORS_ORIGIN` in backend matches frontend URL
- [ ] Backend is running
- [ ] Cookies are enabled in browser
- [ ] No browser extensions blocking requests

### Authentication Issues
- [ ] JWT_SECRET is set in backend `.env`
- [ ] Cookies are enabled
- [ ] Browser allows third-party cookies (for localhost)
- [ ] Clear browser cookies and try again

## Post-Installation

### Git Setup
- [ ] Initialize git: `git init`
- [ ] Add remote: `git remote add origin <your-repo-url>`
- [ ] Create `.gitignore` (already exists)
- [ ] First commit: `git add . && git commit -m "Initial commit"`
- [ ] Push to GitHub: `git push -u origin main`

### Documentation Review
- [ ] Read `README.md`
- [ ] Review `GETTING_STARTED.md`
- [ ] Check `docs/SETUP.md` for details
- [ ] Review `PROGRESS.md` for development roadmap

### Next Steps
- [ ] Customize UI theme in `apps/web/tailwind.config.ts`
- [ ] Add more seed data if needed
- [ ] Plan Phase 2 features (content upload, quizzes)
- [ ] Set up version control workflow
- [ ] Plan deployment strategy

## Success Criteria

✅ **Installation is successful if:**
- Both frontend and backend start without errors
- Database connection is established
- You can register and login
- You can create and view courses
- You can enroll in courses
- All dashboards load correctly
- No console errors in browser or terminal

## Getting Help

If you encounter issues:

1. **Check Documentation**
   - `GETTING_STARTED.md` - Detailed setup guide
   - `docs/SETUP.md` - Troubleshooting section
   - `QUICK_START.md` - Quick reference

2. **Check Logs**
   - Backend terminal for API errors
   - Frontend terminal for build errors
   - Browser console (F12) for frontend errors
   - MySQL logs for database issues

3. **Common Solutions**
   - Restart both servers
   - Clear browser cookies
   - Drop and recreate database
   - Delete `node_modules` and reinstall
   - Check all environment variables

4. **Verify Prerequisites**
   - Node.js version 18+
   - MySQL 8.0+
   - All ports available (3000, 5000, 3306)

---

**Installation Complete!** 🎉

You're ready to start developing EduSphere. Happy coding!

**Next**: Review `PROGRESS.md` for development roadmap and start building Phase 2 features.
