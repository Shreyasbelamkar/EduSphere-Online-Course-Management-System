# EduSphere Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **MySQL** 8.0 or higher
- **Git**

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "edu sphere"
```

### 2. Database Setup

#### Option A: Using Docker (Recommended)

```bash
cd infra
docker-compose up -d
```

This will start:
- MySQL on port 3306
- phpMyAdmin on port 8080 (http://localhost:8080)

Default credentials:
- MySQL User: `edusphere_user`
- MySQL Password: `edusphere_pass`
- Database: `edusphere`

#### Option B: Manual MySQL Setup

1. Create database:
```sql
CREATE DATABASE edusphere CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Import schema:
```bash
mysql -u root -p edusphere < infra/sql/schema.sql
```

3. (Optional) Import seed data:
```bash
mysql -u root -p edusphere < infra/sql/seed.sql
```

### 3. Backend Setup

```bash
cd apps/api
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=edusphere_user
DB_PASSWORD=edusphere_pass
DB_NAME=edusphere

JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

Start the backend:
```bash
npm run dev
```

Backend will run on http://localhost:5000

### 4. Frontend Setup

Open a new terminal:

```bash
cd apps/web
npm install
```

Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Testing the Application

### Default Seed Users

If you imported the seed data, you can login with:

| Email | Password | Role |
|-------|----------|------|
| admin@edusphere.com | password123 | ADMIN |
| john@edusphere.com | password123 | INSTRUCTOR |
| alice@edusphere.com | password123 | STUDENT |

**Note:** The seed file has placeholder password hashes. You'll need to register new users or update the hashes.

### API Testing with Postman

1. Import the Postman collection from `docs/API.postman_collection.json`
2. Set the `baseUrl` variable to `http://localhost:5000/api`
3. Test the endpoints in this order:
   - Register a new user
   - Login
   - Get current user
   - Create a course (as instructor)
   - Enroll in course (as student)

## Development Workflow

### Running Both Apps Simultaneously

From the root directory:

```bash
npm install
npm run dev
```

This will start both frontend and backend concurrently.

### Building for Production

Backend:
```bash
cd apps/api
npm run build
npm start
```

Frontend:
```bash
cd apps/web
npm run build
npm start
```

## Troubleshooting

### Database Connection Issues

1. Verify MySQL is running:
```bash
# Windows
net start MySQL80

# Or check Docker
docker ps
```

2. Test connection:
```bash
mysql -u edusphere_user -p -h localhost edusphere
```

3. Check `.env` credentials match your MySQL setup

### Port Already in Use

If port 3000 or 5000 is in use:

Backend:
```bash
# Change PORT in apps/api/.env
PORT=5001
```

Frontend:
```bash
# Next.js will prompt to use another port
# Or specify: npm run dev -- -p 3001
```

### CORS Issues

Ensure `CORS_ORIGIN` in backend `.env` matches your frontend URL:
```env
CORS_ORIGIN=http://localhost:3000
```

### JWT/Cookie Issues

1. Clear browser cookies
2. Verify `JWT_SECRET` is set in backend `.env`
3. Check browser console for errors

## Next Steps

- [ ] Customize the UI theme in `apps/web/tailwind.config.ts`
- [ ] Add more seed data in `infra/sql/seed.sql`
- [ ] Configure file upload for Phase 2 (content upload)
- [ ] Set up deployment on Vercel and Render

## Support

For issues and questions:
1. Check the main README.md
2. Review API documentation in Postman
3. Check console logs for errors
