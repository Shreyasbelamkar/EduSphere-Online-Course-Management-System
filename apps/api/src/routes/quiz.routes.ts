import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { body, param, query } from 'express-validator';
import {
  createQuiz,
  getCourseQuizzes,
  submitQuiz,
  getQuizAttempts,
  deleteQuiz
} from '../controllers/quiz.controller';

const router = Router();

// Create quiz question (Instructor/Admin only)
router.post(
  '/courses/:id/quiz',
  requireAuth,
  [
    param('id').isInt().withMessage('Course ID must be a number'),
    body('question').trim().notEmpty().withMessage('Question is required'),
    body('options').isArray({ min: 2 }).withMessage('At least 2 options are required'),
    body('correct_option').isInt({ min: 0 }).withMessage('Correct option must be a valid index')
  ],
  validate,
  createQuiz
);

// Get all quiz questions for a course
router.get(
  '/courses/:id/quiz',
  requireAuth,
  [param('id').isInt().withMessage('Course ID must be a number')],
  validate,
  getCourseQuizzes
);

// Submit quiz attempt (Student only)
router.post(
  '/courses/:id/quiz/submit',
  requireAuth,
  [
    param('id').isInt().withMessage('Course ID must be a number'),
    body('answers').isObject().withMessage('Answers must be an object')
  ],
  validate,
  submitQuiz
);

// Get student's quiz attempts
router.get(
  '/quiz/attempts',
  requireAuth,
  [query('courseId').optional().isInt().withMessage('Course ID must be a number')],
  validate,
  getQuizAttempts
);

// Delete quiz question (Instructor/Admin only)
router.delete(
  '/quiz/:id',
  requireAuth,
  [param('id').isInt().withMessage('Quiz ID must be a number')],
  validate,
  deleteQuiz
);

export default router;
