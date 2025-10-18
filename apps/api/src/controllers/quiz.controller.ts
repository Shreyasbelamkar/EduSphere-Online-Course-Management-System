import { Response } from 'express';
import { AuthRequest } from '../types';
import db from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Create quiz question
export async function createQuiz(req: AuthRequest, res: Response) {
  try {
    const { id: courseId } = req.params;
    const { question, options, correct_option } = req.body;
    const userId = req.user?.id;

    // Verify user is instructor or admin
    if (req.user?.role !== 'INSTRUCTOR' && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only instructors can create quizzes' });
    }

    // Verify course exists and user is the instructor (or admin)
    const [courses] = await db.query<RowDataPacket[]>(
      'SELECT * FROM courses WHERE id = ?',
      [courseId]
    );

    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const course = courses[0];
    if (req.user?.role === 'INSTRUCTOR' && course.instructor_id !== userId) {
      return res.status(403).json({ message: 'You can only create quizzes for your own courses' });
    }

    // Validate options array
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'Quiz must have at least 2 options' });
    }

    // Validate correct_option index
    if (correct_option < 0 || correct_option >= options.length) {
      return res.status(400).json({ message: 'Invalid correct option index' });
    }

    // Insert quiz question
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO quizzes (course_id, question, options, correct_option) VALUES (?, ?, ?, ?)',
      [courseId, question, JSON.stringify(options), correct_option]
    );

    res.status(201).json({
      message: 'Quiz question created successfully',
      quiz: {
        id: result.insertId,
        course_id: courseId,
        question,
        options,
        correct_option
      }
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all quiz questions for a course
export async function getCourseQuizzes(req: AuthRequest, res: Response) {
  try {
    const { id: courseId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Verify course exists
    const [courses] = await db.query<RowDataPacket[]>(
      'SELECT * FROM courses WHERE id = ?',
      [courseId]
    );

    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get quiz questions
    const [quizzes] = await db.query<RowDataPacket[]>(
      'SELECT * FROM quizzes WHERE course_id = ? ORDER BY created_at ASC',
      [courseId]
    );

    // If student, don't send correct answers
    if (userRole === 'STUDENT') {
      const sanitizedQuizzes = quizzes.map(quiz => ({
        id: quiz.id,
        course_id: quiz.course_id,
        question: quiz.question,
        options: typeof quiz.options === 'string' ? JSON.parse(quiz.options) : quiz.options,
        created_at: quiz.created_at
        // correct_option is hidden for students
      }));
      return res.json({ quizzes: sanitizedQuizzes });
    }

    // For instructors and admins, include correct answers
    const formattedQuizzes = quizzes.map(quiz => ({
      ...quiz,
      options: typeof quiz.options === 'string' ? JSON.parse(quiz.options) : quiz.options
    }));

    res.json({ quizzes: formattedQuizzes });
  } catch (error) {
    console.error('Get course quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Submit quiz attempt
export async function submitQuiz(req: AuthRequest, res: Response) {
  try {
    const { id: courseId } = req.params;
    const { answers } = req.body; // answers: { quizId: selectedOption }
    const userId = req.user?.id;

    // Verify user is a student
    if (req.user?.role !== 'STUDENT') {
      return res.status(403).json({ message: 'Only students can submit quizzes' });
    }

    // Verify student is enrolled in the course
    const [enrollments] = await db.query<RowDataPacket[]>(
      'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (enrollments.length === 0) {
      return res.status(403).json({ message: 'You must be enrolled in this course to take the quiz' });
    }

    // Get all quiz questions for the course
    const [quizzes] = await db.query<RowDataPacket[]>(
      'SELECT * FROM quizzes WHERE course_id = ?',
      [courseId]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'No quiz questions found for this course' });
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quizzes.length;

    quizzes.forEach(quiz => {
      const studentAnswer = answers[quiz.id];
      if (studentAnswer !== undefined && studentAnswer === quiz.correct_option) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Save quiz attempt
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO quiz_attempts (student_id, course_id, score, total_questions) VALUES (?, ?, ?, ?)',
      [userId, courseId, score, totalQuestions]
    );

    res.json({
      message: 'Quiz submitted successfully',
      attempt: {
        id: result.insertId,
        score,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        percentage: score
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get student's quiz attempts
export async function getQuizAttempts(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { courseId } = req.query;

    let query = 'SELECT qa.*, c.title as course_title FROM quiz_attempts qa JOIN courses c ON qa.course_id = c.id WHERE qa.student_id = ?';
    const params: any[] = [userId];

    if (courseId) {
      query += ' AND qa.course_id = ?';
      params.push(courseId);
    }

    query += ' ORDER BY qa.submitted_at DESC';

    const [attempts] = await db.query<RowDataPacket[]>(query, params);

    res.json({ attempts });
  } catch (error) {
    console.error('Get quiz attempts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete quiz question
export async function deleteQuiz(req: AuthRequest, res: Response) {
  try {
    const { id: quizId } = req.params;
    const userId = req.user?.id;

    // Verify user is instructor or admin
    if (req.user?.role !== 'INSTRUCTOR' && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only instructors can delete quizzes' });
    }

    // Get quiz and verify ownership
    const [quizzes] = await db.query<RowDataPacket[]>(
      `SELECT q.*, c.instructor_id 
       FROM quizzes q 
       JOIN courses c ON q.course_id = c.id 
       WHERE q.id = ?`,
      [quizId]
    );

    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const quiz = quizzes[0];
    if (req.user?.role === 'INSTRUCTOR' && quiz.instructor_id !== userId) {
      return res.status(403).json({ message: 'You can only delete quizzes from your own courses' });
    }

    // Delete quiz
    await db.query('DELETE FROM quizzes WHERE id = ?', [quizId]);

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
