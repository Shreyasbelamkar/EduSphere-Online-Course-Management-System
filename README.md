# 🎓 EduSphere - Online Course Management System

A full-stack course management platform with role-based access for Admins, Instructors, and Students.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TailwindCSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL
- **Auth**: JWT (HTTP-only cookies)
- **Deployment**: Vercel (Frontend) + Render (Backend)

## 📁 Project Structure

```
edusphere/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express backend
├── infra/            # Database schema & Docker
├── docs/             # API documentation & Postman
└── README.md
```

## 🧑‍💻 User Roles

| Role       | Access                                              |
|------------|-----------------------------------------------------|
| Admin      | Manage all users, courses, and view analytics       |
| Instructor | Create courses, upload content, manage quizzes      |
| Student    | Browse courses, enroll, view content, take quizzes  |

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd "edu sphere"
```

### 2. Backend Setup
```bash
cd apps/api
npm install
cp .env.example .env
# Edit .env with your MySQL credentials
npm run dev
```

### 3. Database Setup
```bash
# Import schema
mysql -u root -p edusphere < infra/sql/schema.sql
# Optional: Import seed data
mysql -u root -p edusphere < infra/sql/seed.sql
```

### 4. Frontend Setup
```bash
cd apps/web
npm install
cp .env.local.example .env.local
# Edit .env.local with API URL
npm run dev
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📦 Core Features

### Phase 1 (Weeks 1-2)
- ✅ User authentication (register/login by role)
- ✅ Course CRUD operations
- ✅ Course enrollment system
- ✅ Role-based dashboards
- ✅ Responsive UI with Tailwind

### Phase 2 (Weeks 3-4)
- ✅ Video & document upload
- ✅ Quiz creation and evaluation
- ✅ Progress tracking
- ✅ Admin analytics dashboard
- ✅ Search and filtering

## 🔗 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user

### Courses
- `GET /courses` - List all courses (public)
- `GET /courses/:id` - Get course details
- `POST /courses` - Create course (Admin/Instructor)
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course (Admin)

### Enrollments
- `POST /courses/enroll/:id` - Enroll in course (Student)
- `GET /me/enrollments` - Get my enrollments

### Content (Phase 2)
- `POST /courses/:id/content` - Upload content (Instructor)
- `GET /courses/:id/content` - Get course content

### Quiz (Phase 2)
- `POST /courses/:id/quiz` - Create quiz (Instructor)
- `GET /courses/:id/quiz` - Get quiz questions
- `POST /courses/:id/quiz/submit` - Submit quiz (Student)

## 🗄️ Database Schema

See `infra/sql/schema.sql` for complete schema.

**Tables**: users, courses, enrollments, contents, quizzes, quiz_attempts

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd apps/web
vercel --prod
```

### Backend (Render)
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `cd apps/api && npm install`
4. Set start command: `cd apps/api && npm start`
5. Add environment variables from `.env.example`

## 📚 Documentation

- API Documentation: `docs/API.postman_collection.json`
- Import into Postman for testing

## 👥 Contributors

Your Name - Initial work

## 📄 License

MIT License
