# 🚀 Getting Started with EduSphere

Welcome to EduSphere! This guide will help you get the project running on your local machine in under 10 minutes.

## 📋 What You'll Need

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MySQL** 8.0+ ([Download](https://dev.mysql.com/downloads/))
- A code editor (VS Code recommended)
- A terminal/command prompt

## ⚡ Quick Setup (5 Steps)

### Step 1: Install Dependencies

Open your terminal in the project root directory:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd apps/api
npm install

# Install frontend dependencies
cd ../web
npm install

# Return to root
cd ../..
```

### Step 2: Setup Database

**Option A: Using Docker (Easiest)**

```bash
cd infra
docker-compose up -d
```

✅ Done! MySQL is running with the database already created.

**Option B: Manual Setup**

1. Start MySQL server
2. Open MySQL command line:
```bash
mysql -u root -p
```

3. Run the schema:
```bash
mysql -u root -p < infra/sql/schema.sql
```

### Step 3: Configure Backend

```bash
cd apps/api
cp .env.example .env
```

Edit `apps/api/.env` (use your MySQL password):

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=edusphere

JWT_SECRET=my-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

### Step 4: Configure Frontend

```bash
cd apps/web
cp .env.local.example .env.local
```

The default values should work:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### Step 5: Start the Application

**Option A: Run Both (Recommended)**

From the root directory:
```bash
npm run dev
```

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
cd apps/api
npm run dev
```

Terminal 2 (Frontend):
```bash
cd apps/web
npm run dev
```

## 🎉 You're Ready!

Open your browser and visit:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/health

## 👤 Create Your First Account

1. Click "Sign Up" on the homepage
2. Fill in your details
3. Choose your role:
   - **Student**: Browse and enroll in courses
   - **Instructor**: Create and manage courses
   - **Admin**: Full system access (register manually or via seed data)

## 🧪 Test the Features

### As a Student:
1. Browse courses at http://localhost:3000/courses
2. Click on a course to view details
3. Click "Enroll in Course"
4. View your enrolled courses in the Dashboard

### As an Instructor:
1. Go to Dashboard
2. Click "Create New Course"
3. Fill in course details
4. View your created courses and enrollment stats

### As an Admin:
1. Go to Dashboard
2. View system-wide statistics
3. See all users, courses, and enrollments

## 📚 Next Steps

### Week 1 Checklist (Current)
- [x] Authentication system
- [x] Course management
- [x] Enrollment system
- [x] Role-based dashboards

### Week 2-3 (Content Upload)
- [ ] Video upload/embedding
- [ ] PDF/document upload
- [ ] Course content viewer

### Week 4 (Quiz Module)
- [ ] Quiz creation (instructors)
- [ ] Quiz taking (students)
- [ ] Score tracking

## 🛠️ Development Tips

### Useful Commands

```bash
# Backend
cd apps/api
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Run production build

# Frontend
cd apps/web
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Check code quality
```

### Project Structure

```
edu sphere/
├── apps/
│   ├── api/              # Express backend
│   │   ├── src/
│   │   │   ├── controllers/   # Business logic
│   │   │   ├── routes/        # API routes
│   │   │   ├── middlewares/   # Auth, validation
│   │   │   └── config/        # Database config
│   │   └── package.json
│   └── web/              # Next.js frontend
│       ├── src/
│       │   ├── app/           # Pages (App Router)
│       │   ├── components/    # React components
│       │   └── lib/           # Utilities, API client
│       └── package.json
├── infra/
│   ├── sql/              # Database schema
│   └── docker-compose.yml
└── docs/                 # Documentation
```

### Database Management

**View data with phpMyAdmin** (if using Docker):
- URL: http://localhost:8080
- Server: `mysql`
- Username: `root`
- Password: `root_password`

**Add seed data**:
```bash
mysql -u root -p edusphere < infra/sql/seed.sql
```

### API Testing

Import `docs/API.postman_collection.json` into Postman to test all endpoints.

## ❓ Troubleshooting

### "Cannot connect to database"
- Verify MySQL is running: `mysql -u root -p`
- Check credentials in `apps/api/.env`
- Ensure database `edusphere` exists

### "Port 3000 already in use"
```bash
# Kill the process or use a different port
npm run dev -- -p 3001
```

### "CORS error in browser"
- Verify backend `CORS_ORIGIN` matches frontend URL
- Clear browser cache and cookies
- Restart both servers

### "JWT token invalid"
- Clear browser cookies
- Check `JWT_SECRET` is set in backend `.env`
- Re-login

## 📖 Documentation

- **Setup Guide**: `docs/SETUP.md` (detailed setup instructions)
- **Deployment**: `docs/DEPLOYMENT.md` (production deployment)
- **API Reference**: Import Postman collection from `docs/`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create a pull request

## 📞 Need Help?

- Check the main `README.md`
- Review `docs/SETUP.md` for detailed instructions
- Check console logs for error messages
- Verify all environment variables are set

## 🎯 Phase 1 Goals

By the end of Week 2, you should have:
- ✅ Working authentication system
- ✅ Course CRUD operations
- ✅ Student enrollment
- ✅ Role-based dashboards
- ✅ Responsive UI
- ✅ API documentation

Ready to build an amazing course platform! 🚀
