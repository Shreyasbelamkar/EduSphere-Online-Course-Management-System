import { Router } from 'express';
import {
  enrollInCourse,
  getMyEnrollments,
  unenrollFromCourse,
  markCourseComplete
} from '../controllers/enrollment.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { UserRole } from '../types';

const router = Router();

// All routes require authentication and student role
router.post(
  '/enroll/:id',
  requireAuth,
  requireRole(UserRole.STUDENT),
  enrollInCourse
);

router.get(
  '/my-enrollments',
  requireAuth,
  requireRole(UserRole.STUDENT),
  getMyEnrollments
);

router.delete(
  '/unenroll/:id',
  requireAuth,
  requireRole(UserRole.STUDENT),
  unenrollFromCourse
);

router.post(
  '/complete/:id',
  requireAuth,
  requireRole(UserRole.STUDENT),
  markCourseComplete
);

export default router;
