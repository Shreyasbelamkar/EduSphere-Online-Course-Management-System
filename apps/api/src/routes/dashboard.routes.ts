import { Router } from 'express';
import {
  getAdminDashboard,
  getInstructorDashboard,
  getStudentDashboard
} from '../controllers/dashboard.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { UserRole } from '../types';

const router = Router();

router.get(
  '/admin',
  requireAuth,
  requireRole(UserRole.ADMIN),
  getAdminDashboard
);

router.get(
  '/instructor',
  requireAuth,
  requireRole(UserRole.INSTRUCTOR),
  getInstructorDashboard
);

router.get(
  '/student',
  requireAuth,
  requireRole(UserRole.STUDENT),
  getStudentDashboard
);

export default router;
