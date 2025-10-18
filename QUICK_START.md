# ⚡ EduSphere Quick Start

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+
- MySQL 8.0+ (or Docker)

## Installation

### Windows (PowerShell)

```powershell
# Run the setup script
.\setup.ps1

# Edit database credentials
notepad apps\api\.env

# Start MySQL with Docker (or use your local MySQL)
cd infra
docker-compose up -d
cd ..

# Import database schema
mysql -u root -p edusphere < infra\sql\schema.sql

# Start the application
npm run dev
```

### Manual Setup

```bash
# 1. Install dependencies
npm install
cd apps/api && npm install
cd ../web && npm install
cd ../..

# 2. Setup environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local

# 3. Edit apps/api/.env with your MySQL credentials

# 4. Setup database
# Option A: Docker
cd infra && docker-compose up -d

# Option B: Manual
mysql -u root -p < infra/sql/schema.sql

# 5. Start the application
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **phpMyAdmin** (if using Docker): http://localhost:8080

## Default Test Accounts

Register new accounts or use seed data:

```bash
mysql -u root -p edusphere < infra/sql/seed.sql
```

Then login with:
- **Admin**: admin@edusphere.com / password123
- **Instructor**: john@edusphere.com / password123
- **Student**: alice@edusphere.com / password123

## What's Included

✅ **Authentication System**
- Register/Login/Logout
- Role-based access (Admin, Instructor, Student)
- JWT authentication

✅ **Course Management**
- Browse courses
- Create courses (Instructors)
- Enroll in courses (Students)
- Course details page

✅ **Dashboards**
- Admin: System statistics
- Instructor: Course management
- Student: Enrolled courses

✅ **Modern UI**
- Responsive design
- Tailwind CSS
- Clean, professional interface

## Project Structure

```
edu sphere/
├── apps/
│   ├── api/              # Express backend
│   └── web/              # Next.js frontend
├── infra/
│   ├── sql/              # Database schema
│   └── docker-compose.yml
├── docs/                 # Documentation
└── GETTING_STARTED.md    # Detailed guide
```

## Common Commands

```bash
# Development
npm run dev              # Start both frontend and backend

# Backend only
cd apps/api
npm run dev

# Frontend only
cd apps/web
npm run dev

# Build for production
npm run build

# Database
docker-compose up -d     # Start MySQL
docker-compose down      # Stop MySQL
```

## Troubleshooting

**Database connection failed?**
- Check MySQL is running
- Verify credentials in `apps/api/.env`
- Ensure database `edusphere` exists

**Port already in use?**
- Change PORT in `apps/api/.env`
- Frontend will prompt for alternative port

**CORS errors?**
- Verify `CORS_ORIGIN` in backend matches frontend URL
- Clear browser cookies

## Next Steps

1. ✅ Complete Phase 1 (Weeks 1-2)
   - Authentication ✓
   - Course management ✓
   - Enrollment system ✓

2. 📅 Phase 2 (Weeks 3-4)
   - Content upload
   - Quiz module
   - Progress tracking

3. 🚀 Deployment
   - See `docs/DEPLOYMENT.md`

## Documentation

- **Setup Guide**: `docs/SETUP.md`
- **Getting Started**: `GETTING_STARTED.md`
- **Deployment**: `docs/DEPLOYMENT.md`
- **Phase 2 Guide**: `docs/PHASE2_GUIDE.md`
- **API Collection**: `docs/API.postman_collection.json`
- **Progress Tracker**: `PROGRESS.md`

## Support

Need help? Check:
1. `GETTING_STARTED.md` for detailed instructions
2. `docs/SETUP.md` for troubleshooting
3. Console logs for error messages

---

**Ready to build something amazing!** 🚀

Visit http://localhost:3000 to get started.
