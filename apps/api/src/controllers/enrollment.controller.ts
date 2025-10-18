import { Response } from 'express';
import { AuthRequest } from '../types';
import db from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function enrollInCourse(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const student_id = req.user!.id;

    // Check if course exists
    const [courses] = await db.query<RowDataPacket[]>(
      'SELECT id FROM courses WHERE id = ?',
      [id]
    );

    if (courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    const [enrollments] = await db.query<RowDataPacket[]>(
      'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?',
      [student_id, id]
    );

    if (enrollments.length > 0) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Enroll
    await db.query<ResultSetHeader>(
      'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
      [student_id, id]
    );

    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ error: 'Failed to enroll' });
  }
}

export async function getMyEnrollments(req: AuthRequest, res: Response) {
  try {
    const student_id = req.user!.id;

    const [enrollments] = await db.query<RowDataPacket[]>(
      `SELECT e.*, c.title, c.description, u.name as instructor_name
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       JOIN users u ON c.instructor_id = u.id
       WHERE e.student_id = ?
       ORDER BY e.enrolled_at DESC`,
      [student_id]
    );

    res.json({ enrollments });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
}

export async function unenrollFromCourse(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const student_id = req.user!.id;

    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM enrollments WHERE student_id = ? AND course_id = ?',
      [student_id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json({ message: 'Unenrolled successfully' });
  } catch (error) {
    console.error('Unenroll error:', error);
    res.status(500).json({ error: 'Failed to unenroll' });
  }
}

export async function markCourseComplete(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const student_id = req.user!.id;

    // Check if enrolled
    const [enrollments] = await db.query<RowDataPacket[]>(
      'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?',
      [student_id, id]
    );

    if (enrollments.length === 0) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    // Mark as completed
    await db.query<ResultSetHeader>(
      'UPDATE enrollments SET status = ?, completed_at = NOW() WHERE student_id = ? AND course_id = ?',
      ['COMPLETED', student_id, id]
    );

    res.json({ message: 'Course marked as completed' });
  } catch (error) {
    console.error('Mark complete error:', error);
    res.status(500).json({ error: 'Failed to mark course as complete' });
  }
}
