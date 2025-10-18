# EduSphere Deployment Guide

## Overview

This guide covers deploying EduSphere to production:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Render PostgreSQL or PlanetScale MySQL

## Prerequisites

- GitHub account
- Vercel account (free tier)
- Render account (free tier)
- Production database (Render, Railway, or PlanetScale)

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: EduSphere project"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 1.2 Update .gitignore

Ensure `.env` files are ignored:
```
.env
.env.local
.env*.local
```

## Step 2: Deploy Database

### Option A: Render MySQL

1. Go to https://render.com
2. Click "New +" → "MySQL"
3. Configure:
   - Name: `edusphere-db`
   - Database: `edusphere`
   - User: `edusphere_user`
4. Click "Create Database"
5. Note the **Internal Database URL** and **External Database URL**

### Option B: PlanetScale (Recommended)

1. Go to https://planetscale.com
2. Create new database: `edusphere`
3. Create branch: `main`
4. Get connection string
5. Run schema:
```bash
# Connect using PlanetScale CLI
pscale connect edusphere main --port 3309

# In another terminal
mysql -h 127.0.0.1 -P 3309 -u root < infra/sql/schema.sql
```

## Step 3: Deploy Backend (Render)

### 3.1 Create Web Service

1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `edusphere-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `apps/api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3.2 Add Environment Variables

In Render service settings, add:

```env
NODE_ENV=production
PORT=10000

# Database (use your connection string)
DB_HOST=<your-db-host>
DB_PORT=3306
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
DB_NAME=edusphere

# JWT (generate a strong secret)
JWT_SECRET=<generate-a-strong-random-secret>
JWT_EXPIRES_IN=7d

# CORS (will update after frontend deployment)
CORS_ORIGIN=https://your-app.vercel.app

COOKIE_SECRET=<generate-another-strong-secret>
```

### 3.3 Deploy

Click "Create Web Service". Render will build and deploy your backend.

Note your backend URL: `https://edusphere-api.onrender.com`

## Step 4: Deploy Frontend (Vercel)

### 4.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 4.2 Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 4.3 Add Environment Variables

In Vercel project settings → Environment Variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://edusphere-api.onrender.com/api
```

### 4.4 Deploy

Click "Deploy". Vercel will build and deploy your frontend.

Note your frontend URL: `https://edusphere.vercel.app`

### 4.5 Update Backend CORS

Go back to Render backend settings and update:
```env
CORS_ORIGIN=https://edusphere.vercel.app
```

Redeploy the backend service.

## Step 5: Verify Deployment

### 5.1 Test API

```bash
curl https://edusphere-api.onrender.com/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### 5.2 Test Frontend

1. Visit your Vercel URL
2. Register a new account
3. Login
4. Create a course (as instructor)
5. Enroll in course (as student)

## Step 6: Custom Domain (Optional)

### Frontend Domain

1. In Vercel project settings → Domains
2. Add your custom domain (e.g., `edusphere.com`)
3. Follow DNS configuration instructions
4. Update backend `CORS_ORIGIN` to your custom domain

### Backend Domain

1. In Render service settings → Custom Domains
2. Add subdomain (e.g., `api.edusphere.com`)
3. Update DNS records
4. Update frontend `NEXT_PUBLIC_API_BASE_URL`

## Troubleshooting

### Backend Won't Start

1. Check Render logs for errors
2. Verify all environment variables are set
3. Ensure database is accessible
4. Test database connection:
```bash
mysql -h <DB_HOST> -P <DB_PORT> -u <DB_USER> -p<DB_PASSWORD> <DB_NAME>
```

### Frontend Can't Connect to Backend

1. Check browser console for CORS errors
2. Verify `NEXT_PUBLIC_API_BASE_URL` is correct
3. Ensure backend `CORS_ORIGIN` matches frontend URL
4. Check backend is running: visit `/health` endpoint

### Database Connection Timeout

1. If using Render MySQL, use **Internal Database URL** for backend
2. Check database is running
3. Verify firewall/security group settings
4. For PlanetScale, ensure connection string includes SSL params

### Cookie/Authentication Issues

1. Ensure backend uses `secure: true` for cookies in production
2. Check `sameSite` cookie settings
3. Verify JWT_SECRET is set
4. Clear browser cookies and try again

## Monitoring & Maintenance

### Render

- View logs in Render dashboard
- Set up health checks
- Monitor resource usage

### Vercel

- View deployment logs
- Check Analytics (if enabled)
- Monitor build times

### Database

- Regular backups (automatic on Render/PlanetScale)
- Monitor connection pool usage
- Check slow queries

## Scaling Considerations

### Free Tier Limitations

- **Render**: Service spins down after inactivity (cold starts)
- **Vercel**: 100GB bandwidth/month
- **Database**: Connection limits

### Upgrade Path

1. Render: Upgrade to paid plan for always-on service
2. Database: Increase connection pool size
3. Add Redis for session storage
4. Enable CDN for static assets

## Security Checklist

- [ ] Strong JWT_SECRET and COOKIE_SECRET
- [ ] HTTPS only (enforced by Vercel/Render)
- [ ] Secure cookie settings in production
- [ ] Database credentials in environment variables
- [ ] CORS properly configured
- [ ] Rate limiting (add in Phase 2)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)

## Next Steps

- Set up CI/CD with GitHub Actions
- Add monitoring (Sentry, LogRocket)
- Configure automated backups
- Set up staging environment
- Add performance monitoring

## Support

For deployment issues:
1. Check Render/Vercel documentation
2. Review service logs
3. Test locally with production environment variables
