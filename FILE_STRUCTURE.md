# 📁 EduSphere File Structure

Complete file tree with descriptions for easy navigation.

## Root Directory

```
edu sphere/
│
├── 📄 README.md                      # Project overview and main documentation
├── 📄 START_HERE.md                  # 👈 Start with this file!
├── 📄 QUICK_START.md                 # 5-minute quick setup guide
├── 📄 GETTING_STARTED.md             # Detailed setup instructions
├── 📄 INSTALLATION_CHECKLIST.md      # Step-by-step installation checklist
├── 📄 PROJECT_SUMMARY.md             # Technical architecture and details
├── 📄 PROGRESS.md                    # Development progress tracker
├── 📄 FILE_STRUCTURE.md              # This file - project structure guide
│
├── 📄 package.json                   # Root package configuration
├── 📄 .gitignore                     # Git ignore rules
├── 📄 .env.example                   # Root environment variables template
├── 📜 setup.ps1                      # Windows PowerShell setup script
│
├── 📁 apps/                          # Application code
│   ├── 📁 api/                       # Backend (Express + TypeScript)
│   └── 📁 web/                       # Frontend (Next.js + React)
│
├── 📁 infra/                         # Infrastructure files
│   ├── 📁 sql/                       # Database scripts
│   └── 📄 docker-compose.yml         # Docker configuration
│
└── 📁 docs/                          # Documentation
    ├── 📄 SETUP.md                   # Comprehensive setup guide
    ├── 📄 DEPLOYMENT.md              # Production deployment guide
    ├── 📄 PHASE2_GUIDE.md            # Phase 2 implementation guide
    └── 📄 API.postman_collection.json # Postman API collection
```

---

## Backend Structure (`apps/api/`)

```
apps/api/
│
├── 📁 src/                           # Source code
│   │
│   ├── 📄 index.ts                   # Application entry point
│   ├── 📄 server.ts                  # Express server configuration
│   │
│   ├── 📁 config/                    # Configuration files
│   │   └── 📄 database.ts            # MySQL connection pool setup
│   │
│   ├── 📁 controllers/               # Business logic
│   │   ├── 📄 auth.controller.ts     # Authentication logic
│   │   ├── 📄 course.controller.ts   # Course CRUD operations
│   │   ├── 📄 enrollment.controller.ts # Enrollment management
│   │   └── 📄 dashboard.controller.ts  # Dashboard data aggregation
│   │
│   ├── 📁 routes/                    # API route definitions
│   │   ├── 📄 auth.routes.ts         # /api/auth/* endpoints
│   │   ├── 📄 course.routes.ts       # /api/courses/* endpoints
│   │   ├── 📄 enrollment.routes.ts   # /api/enrollments/* endpoints
│   │   └── 📄 dashboard.routes.ts    # /api/dashboard/* endpoints
│   │
│   ├── 📁 middlewares/               # Express middlewares
│   │   ├── 📄 auth.middleware.ts     # JWT verification, role checking
│   │   └── 📄 validation.middleware.ts # Input validation
│   │
│   ├── 📁 utils/                     # Utility functions
│   │   ├── 📄 jwt.ts                 # JWT token generation/verification
│   │   └── 📄 password.ts            # Password hashing/comparison
│   │
│   └── 📁 types/                     # TypeScript type definitions
│       └── 📄 index.ts               # Shared interfaces and enums
│
├── 📄 package.json                   # Backend dependencies
├── 📄 tsconfig.json                  # TypeScript configuration
└── 📄 .env.example                   # Environment variables template

Key Backend Files:
├── index.ts          → Starts the server, connects to database
├── server.ts         → Configures Express app, middleware, routes
├── database.ts       → MySQL connection pool
├── auth.controller   → Register, login, logout, getMe
├── course.controller → CRUD operations for courses
├── auth.middleware   → Protects routes, checks user roles
└── jwt.ts           → Token generation and verification
```

---

## Frontend Structure (`apps/web/`)

```
apps/web/
│
├── 📁 src/                           # Source code
│   │
│   ├── 📁 app/                       # Next.js App Router
│   │   │
│   │   ├── 📄 layout.tsx             # Root layout (wraps all pages)
│   │   ├── 📄 page.tsx               # Landing page (/)
│   │   ├── 📄 globals.css            # Global styles + Tailwind
│   │   │
│   │   ├── 📁 login/                 # Login page
│   │   │   └── 📄 page.tsx           # /login
│   │   │
│   │   ├── 📁 register/              # Registration page
│   │   │   └── 📄 page.tsx           # /register
│   │   │
│   │   ├── 📁 courses/               # Courses section
│   │   │   ├── 📄 page.tsx           # /courses (list all)
│   │   │   └── 📁 [id]/              # Dynamic route
│   │   │       └── 📄 page.tsx       # /courses/[id] (detail)
│   │   │
│   │   └── 📁 dashboard/             # Dashboard page
│   │       └── 📄 page.tsx           # /dashboard (role-specific)
│   │
│   ├── 📁 components/                # React components
│   │   │
│   │   ├── 📄 Navbar.tsx             # Navigation bar (all pages)
│   │   │
│   │   └── 📁 dashboards/            # Dashboard components
│   │       ├── 📄 AdminDashboard.tsx      # Admin view
│   │       ├── 📄 InstructorDashboard.tsx # Instructor view
│   │       └── 📄 StudentDashboard.tsx    # Student view
│   │
│   ├── 📁 lib/                       # Utilities and helpers
│   │   ├── 📄 api.ts                 # Axios API client + endpoints
│   │   └── 📄 utils.ts               # Helper functions (cn, formatDate)
│   │
│   └── 📁 types/                     # TypeScript types
│       └── 📄 index.ts               # Frontend type definitions
│
├── 📁 public/                        # Static assets
│
├── 📄 package.json                   # Frontend dependencies
├── 📄 tsconfig.json                  # TypeScript configuration
├── 📄 next.config.mjs                # Next.js configuration
├── 📄 tailwind.config.ts             # Tailwind CSS configuration
├── 📄 postcss.config.js              # PostCSS configuration
└── 📄 .env.local.example             # Environment variables template

Key Frontend Files:
├── app/layout.tsx       → Root layout with metadata
├── app/page.tsx         → Landing page with hero section
├── app/login/page.tsx   → Login form
├── app/register/page.tsx → Registration form
├── app/courses/page.tsx → Course listing with search
├── app/dashboard/page.tsx → Role-based dashboard
├── components/Navbar.tsx → Navigation with auth state
├── lib/api.ts           → API client and all endpoints
└── globals.css          → Tailwind + custom styles
```

---

## Infrastructure (`infra/`)

```
infra/
│
├── 📁 sql/                           # Database scripts
│   ├── 📄 schema.sql                 # Database schema (CREATE TABLE)
│   └── 📄 seed.sql                   # Sample data (INSERT INTO)
│
└── 📄 docker-compose.yml             # Docker services
    ├── MySQL 8.0 (port 3306)
    └── phpMyAdmin (port 8080)

Database Tables:
├── users           → User accounts (id, name, email, password_hash, role)
├── courses         → Courses (id, title, description, instructor_id)
├── enrollments     → Student enrollments (student_id, course_id)
├── contents        → Course content (Phase 2)
├── quizzes         → Quiz questions (Phase 2)
└── quiz_attempts   → Quiz submissions (Phase 2)
```

---

## Documentation (`docs/`)

```
docs/
│
├── 📄 SETUP.md                       # Comprehensive setup guide
│   ├── Prerequisites
│   ├── Installation steps
│   ├── Configuration
│   ├── Troubleshooting
│   └── Advanced topics
│
├── 📄 DEPLOYMENT.md                  # Production deployment
│   ├── Vercel setup (frontend)
│   ├── Render setup (backend)
│   ├── Database hosting
│   ├── Environment variables
│   └── Custom domains
│
├── 📄 PHASE2_GUIDE.md                # Phase 2 implementation
│   ├── Content upload (Week 3)
│   ├── Quiz module (Week 4)
│   ├── Code examples
│   └── Testing checklist
│
└── 📄 API.postman_collection.json    # API testing
    ├── Authentication endpoints
    ├── Course endpoints
    ├── Enrollment endpoints
    └── Dashboard endpoints
```

---

## Configuration Files

### Root Level
```
📄 package.json          → Root scripts (dev, build)
📄 .gitignore           → Git ignore rules
📄 .env.example         → Root environment template
```

### Backend (`apps/api/`)
```
📄 package.json          → Backend dependencies
📄 tsconfig.json        → TypeScript compiler options
📄 .env.example         → Backend environment template
📄 .env                 → Your local config (not in git)
```

### Frontend (`apps/web/`)
```
📄 package.json          → Frontend dependencies
📄 tsconfig.json        → TypeScript compiler options
📄 next.config.mjs      → Next.js configuration
📄 tailwind.config.ts   → Tailwind CSS theme
📄 postcss.config.js    → PostCSS plugins
📄 .env.local.example   → Frontend environment template
📄 .env.local           → Your local config (not in git)
```

---

## File Purposes Quick Reference

### Must Edit (During Setup)
```
✏️ apps/api/.env              → Database credentials, JWT secret
✏️ apps/web/.env.local        → API base URL
```

### Entry Points
```
🚀 apps/api/src/index.ts      → Backend starts here
🚀 apps/web/src/app/page.tsx  → Frontend landing page
```

### Key Logic Files
```
🧠 apps/api/src/controllers/  → Business logic
🧠 apps/api/src/routes/       → API endpoints
🧠 apps/web/src/lib/api.ts    → API client
```

### Configuration
```
⚙️ apps/api/tsconfig.json     → Backend TypeScript
⚙️ apps/web/tsconfig.json     → Frontend TypeScript
⚙️ apps/web/tailwind.config.ts → UI theme
```

### Database
```
🗄️ infra/sql/schema.sql       → Database structure
🗄️ infra/sql/seed.sql         → Sample data
```

### Documentation
```
📖 START_HERE.md              → Project overview
📖 GETTING_STARTED.md         → Setup guide
📖 docs/SETUP.md              → Detailed guide
```

---

## Navigation Guide

### I want to...

**Setup the project**
→ `START_HERE.md` → `QUICK_START.md` → `INSTALLATION_CHECKLIST.md`

**Understand the architecture**
→ `PROJECT_SUMMARY.md` → `FILE_STRUCTURE.md` (this file)

**Add a new API endpoint**
→ `apps/api/src/routes/` → `apps/api/src/controllers/`

**Add a new page**
→ `apps/web/src/app/[page-name]/page.tsx`

**Modify the UI**
→ `apps/web/src/components/` → `apps/web/tailwind.config.ts`

**Change database schema**
→ `infra/sql/schema.sql` → Run migration

**Deploy to production**
→ `docs/DEPLOYMENT.md`

**Implement Phase 2 features**
→ `docs/PHASE2_GUIDE.md`

**Test the API**
→ Import `docs/API.postman_collection.json` to Postman

---

## File Naming Conventions

### Backend
- **Controllers**: `*.controller.ts` (e.g., `auth.controller.ts`)
- **Routes**: `*.routes.ts` (e.g., `auth.routes.ts`)
- **Middlewares**: `*.middleware.ts` (e.g., `auth.middleware.ts`)
- **Types**: `index.ts` in `types/` folder

### Frontend
- **Pages**: `page.tsx` (Next.js convention)
- **Layouts**: `layout.tsx` (Next.js convention)
- **Components**: `PascalCase.tsx` (e.g., `Navbar.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `api.ts`, `utils.ts`)

### Documentation
- **Guides**: `SCREAMING_SNAKE_CASE.md` (e.g., `GETTING_STARTED.md`)
- **Technical**: `PascalCase.md` in `docs/` (e.g., `DEPLOYMENT.md`)

---

## Important Paths to Remember

```bash
# Backend
apps/api/src/index.ts              # Start here to trace backend
apps/api/src/server.ts             # Express app setup
apps/api/src/routes/               # All API endpoints
apps/api/.env                      # Your local config

# Frontend
apps/web/src/app/page.tsx          # Landing page
apps/web/src/app/layout.tsx        # Root layout
apps/web/src/lib/api.ts            # API client
apps/web/.env.local                # Your local config

# Database
infra/sql/schema.sql               # Database structure
infra/docker-compose.yml           # Docker setup

# Documentation
START_HERE.md                      # Start here!
GETTING_STARTED.md                 # Setup guide
docs/SETUP.md                      # Detailed guide
```

---

## File Count Summary

```
Total Files: ~60+

Backend:
  - TypeScript files: 15+
  - Config files: 3

Frontend:
  - TypeScript/TSX files: 20+
  - Config files: 5

Infrastructure:
  - SQL files: 2
  - Docker: 1

Documentation:
  - Markdown files: 12+
  - Postman: 1
```

---

**Use this guide to navigate the EduSphere project efficiently!** 🗺️

*Last Updated: 2025-10-05*
