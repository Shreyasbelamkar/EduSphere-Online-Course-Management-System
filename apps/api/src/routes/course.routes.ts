import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/course.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { UserRole } from '../types';

const router = Router();

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes
router.post(
  '/',
  requireAuth,
  requireRole(UserRole.ADMIN, UserRole.INSTRUCTOR),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    validate
  ],
  createCourse
);

router.put(
  '/:id',
  requireAuth,
  requireRole(UserRole.ADMIN, UserRole.INSTRUCTOR),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    validate
  ],
  updateCourse
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(UserRole.ADMIN),
  deleteCourse
);

export default router;
