import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { body, param } from 'express-validator';
import {
  uploadContent,
  getCourseContent,
  deleteContent
} from '../controllers/content.controller';

const router = Router();

// Upload content to a course (Instructor/Admin only)
router.post(
  '/courses/:id/content',
  requireAuth,
  [
    param('id').isInt().withMessage('Course ID must be a number'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('file_type').isIn(['VIDEO', 'PDF', 'LINK']).withMessage('Invalid file type'),
    body('file_url').trim().isURL().withMessage('Valid URL is required'),
    body('file_size').optional().isInt({ min: 0 }).withMessage('File size must be a positive number')
  ],
  validate,
  uploadContent
);

// Get all content for a course (Public for enrolled students)
router.get(
  '/courses/:id/content',
  requireAuth,
  [param('id').isInt().withMessage('Course ID must be a number')],
  validate,
  getCourseContent
);

// Delete content (Instructor/Admin only)
router.delete(
  '/content/:id',
  requireAuth,
  [param('id').isInt().withMessage('Content ID must be a number')],
  validate,
  deleteContent
);

export default router;
