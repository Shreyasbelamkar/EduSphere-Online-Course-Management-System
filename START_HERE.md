# 🎓 START HERE - EduSphere Project Guide

Welcome to **EduSphere**! This is your complete guide to getting started with the project.

## 📖 What is EduSphere?

EduSphere is a full-stack **Online Course Management System** that allows:
- **Students** to browse, enroll, and learn from courses
- **Instructors** to create and manage courses
- **Admins** to oversee the entire platform

Built with **Next.js**, **Express**, **MySQL**, and **TypeScript**.

---

## 🚀 Quick Start (Choose Your Path)

### Path 1: I Want to Start Immediately (5 minutes)
👉 **Read**: `QUICK_START.md`

Run this in PowerShell:
```powershell
.\setup.ps1
```
Then follow the on-screen instructions.

### Path 2: I Want Detailed Instructions (15 minutes)
👉 **Read**: `GETTING_STARTED.md`

Step-by-step guide with explanations and troubleshooting.

### Path 3: I Want to Understand Everything (30 minutes)
👉 **Read**: `docs/SETUP.md`

Comprehensive guide covering all aspects of setup and configuration.

---

## 📚 Documentation Structure

### Getting Started
1. **START_HERE.md** (this file) - Overview and navigation
2. **QUICK_START.md** - 5-minute setup
3. **GETTING_STARTED.md** - Detailed setup guide
4. **INSTALLATION_CHECKLIST.md** - Step-by-step checklist

### Project Information
5. **README.md** - Project overview and features
6. **PROJECT_SUMMARY.md** - Architecture and technical details
7. **PROGRESS.md** - Development status and roadmap

### Advanced Guides
8. **docs/SETUP.md** - Comprehensive setup and troubleshooting
9. **docs/DEPLOYMENT.md** - Production deployment guide
10. **docs/PHASE2_GUIDE.md** - Phase 2 implementation guide

### API & Testing
11. **docs/API.postman_collection.json** - API documentation and tests

---

## 🎯 What You'll Build

### Phase 1 (Current - Weeks 1-2) ✅
- ✅ User authentication (register/login)
- ✅ Role-based access (Admin, Instructor, Student)
- ✅ Course management (create, view, edit, delete)
- ✅ Course enrollment system
- ✅ Dashboards for each user role
- ✅ Responsive UI with Tailwind CSS

### Phase 2 (Upcoming - Weeks 3-4) 📅
- 📅 Video content upload and streaming
- 📅 PDF document upload and viewing
- 📅 Quiz creation and evaluation
- 📅 Progress tracking
- 📅 Enhanced analytics

---

## 🛠️ Prerequisites

Before you start, make sure you have:

- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/) OR Docker
- ✅ **Git** (optional) - For version control
- ✅ **Code Editor** - VS Code recommended

**Check your versions:**
```bash
node --version    # Should be 18.x or higher
npm --version     # Should be 9.x or higher
mysql --version   # Should be 8.0 or higher
```

---

## 📂 Project Structure Overview

```
edu sphere/
├── apps/
│   ├── api/              # Backend (Express + TypeScript)
│   │   ├── src/
│   │   │   ├── controllers/    # Business logic
│   │   │   ├── routes/         # API endpoints
│   │   │   ├── middlewares/    # Auth, validation
│   │   │   └── config/         # Database config
│   │   └── package.json
│   │
│   └── web/              # Frontend (Next.js + Tailwind)
│       ├── src/
│       │   ├── app/            # Pages (App Router)
│       │   ├── components/     # React components
│       │   └── lib/            # API client, utils
│       └── package.json
│
├── infra/
│   ├── sql/              # Database schema & seed data
│   └── docker-compose.yml
│
├── docs/                 # Documentation
│
└── [Various .md files]   # Guides and documentation
```

---

## ⚡ Installation (Quick Version)

### Step 1: Install Dependencies
```bash
# Run the setup script (Windows)
.\setup.ps1

# OR manually:
npm install
cd apps/api && npm install
cd ../web && npm install
```

### Step 2: Setup Database
```bash
# Option A: Docker (easiest)
cd infra
docker-compose up -d

# Option B: Manual
mysql -u root -p < infra/sql/schema.sql
```

### Step 3: Configure Environment
```bash
# Backend
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your MySQL credentials

# Frontend
cp apps/web/.env.local.example apps/web/.env.local
# Default values should work
```

### Step 4: Start Application
```bash
npm run dev
```

### Step 5: Open Browser
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/health

---

## 🧪 Testing Your Setup

### 1. Register a New User
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in details and choose a role
4. Submit

### 2. Create a Course (as Instructor)
1. Register/login as Instructor
2. Go to Dashboard
3. Click "Create New Course"
4. Fill in course details
5. Submit

### 3. Enroll in Course (as Student)
1. Register/login as Student
2. Go to "Courses"
3. Click on a course
4. Click "Enroll in Course"
5. Check Dashboard to see enrolled course

---

## 🎨 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Express** - Node.js web framework
- **TypeScript** - Type safety
- **MySQL** - Relational database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### DevOps
- **Docker** - Containerization
- **Vercel** - Frontend hosting
- **Render** - Backend hosting

---

## 📖 Learning Path

### Day 1: Setup & Exploration
1. ✅ Complete installation
2. ✅ Test all features
3. ✅ Explore the codebase
4. ✅ Read `PROJECT_SUMMARY.md`

### Day 2: Understanding the Code
1. 📖 Review backend structure (`apps/api/src`)
2. 📖 Review frontend structure (`apps/web/src`)
3. 📖 Understand authentication flow
4. 📖 Study database schema (`infra/sql/schema.sql`)

### Day 3: Making Changes
1. 🔧 Customize UI colors in `tailwind.config.ts`
2. 🔧 Add a new field to user profile
3. 🔧 Create a new API endpoint
4. 🔧 Add a new page to frontend

### Week 2: Phase 1 Completion
1. ✅ Complete all Phase 1 features
2. ✅ Test thoroughly
3. ✅ Fix any bugs
4. ✅ Prepare for Phase 2

### Weeks 3-4: Phase 2 Implementation
1. 📅 Follow `docs/PHASE2_GUIDE.md`
2. 📅 Implement content upload
3. 📅 Implement quiz module
4. 📅 Deploy to production

---

## 🆘 Getting Help

### Documentation
- **Quick Issues**: Check `QUICK_START.md`
- **Detailed Help**: Check `docs/SETUP.md`
- **API Reference**: Import `docs/API.postman_collection.json`

### Common Issues

**"Cannot connect to database"**
- Verify MySQL is running
- Check credentials in `apps/api/.env`
- Ensure database `edusphere` exists

**"Port already in use"**
- Change PORT in `apps/api/.env` (backend)
- Next.js will prompt for alternative port (frontend)

**"CORS error"**
- Verify `CORS_ORIGIN` in backend matches frontend URL
- Clear browser cookies
- Restart both servers

**"JWT token invalid"**
- Clear browser cookies
- Check `JWT_SECRET` is set in backend `.env`
- Re-login

### Where to Look
1. **Terminal logs** - Backend and frontend errors
2. **Browser console** (F12) - Frontend errors
3. **MySQL logs** - Database errors
4. **Documentation** - Setup and troubleshooting guides

---

## 🎯 Next Steps

### Immediate (Today)
- [ ] Complete installation
- [ ] Test all features
- [ ] Read `PROJECT_SUMMARY.md`
- [ ] Explore the codebase

### This Week
- [ ] Customize the UI
- [ ] Add more seed data
- [ ] Complete Phase 1 features
- [ ] Review `PROGRESS.md`

### Next Week
- [ ] Start Phase 2 implementation
- [ ] Follow `docs/PHASE2_GUIDE.md`
- [ ] Implement content upload
- [ ] Implement quiz module

### End of Month
- [ ] Complete all features
- [ ] Deploy to production
- [ ] Write final documentation
- [ ] Celebrate! 🎉

---

## 📋 Useful Commands

```bash
# Development
npm run dev              # Start both frontend and backend
cd apps/api && npm run dev    # Backend only
cd apps/web && npm run dev    # Frontend only

# Database
cd infra && docker-compose up -d    # Start MySQL
docker-compose down                  # Stop MySQL
mysql -u root -p edusphere          # Connect to database

# Build
npm run build            # Build both apps
cd apps/api && npm run build    # Build backend
cd apps/web && npm run build    # Build frontend

# Production
cd apps/api && npm start        # Run backend
cd apps/web && npm start        # Run frontend
```

---

## 🎓 Project Goals

### Learning Objectives
- ✅ Full-stack development with modern tools
- ✅ Authentication and authorization
- ✅ RESTful API design
- ✅ Database design and management
- ✅ React and Next.js best practices
- ✅ TypeScript in production
- ✅ Deployment and DevOps

### Deliverables
- ✅ Working web application
- ✅ Complete source code
- ✅ Comprehensive documentation
- ✅ API documentation
- ✅ Deployment guide
- ✅ GitHub repository

---

## 🌟 Features Checklist

### Authentication ✅
- [x] User registration
- [x] User login/logout
- [x] JWT authentication
- [x] Role-based access
- [x] Protected routes

### Course Management ✅
- [x] Browse courses
- [x] Create courses
- [x] View course details
- [x] Edit courses
- [x] Delete courses

### Enrollment ✅
- [x] Enroll in courses
- [x] View enrolled courses
- [x] Unenroll from courses

### Dashboards ✅
- [x] Admin dashboard
- [x] Instructor dashboard
- [x] Student dashboard

### Phase 2 (Upcoming) 📅
- [ ] Video upload
- [ ] PDF upload
- [ ] Content viewer
- [ ] Quiz creation
- [ ] Quiz taking
- [ ] Progress tracking

---

## 🚀 Ready to Start?

Choose your path:

1. **Quick Start** → `QUICK_START.md`
2. **Detailed Guide** → `GETTING_STARTED.md`
3. **Checklist** → `INSTALLATION_CHECKLIST.md`

Or just run:
```powershell
.\setup.ps1
```

---

## 📞 Support

- **Documentation**: Check all `.md` files in root and `docs/` folder
- **API Testing**: Import Postman collection from `docs/`
- **Issues**: Check `docs/SETUP.md` troubleshooting section

---

**Welcome to EduSphere! Let's build something amazing together! 🎓✨**

*Last Updated: 2025-10-05*
