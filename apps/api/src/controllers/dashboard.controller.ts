import { Response } from 'express';
import { AuthRequest, UserRole } from '../types';
import db from '../config/database';
import { RowDataPacket } from 'mysql2';

export async function getAdminDashboard(req: AuthRequest, res: Response) {
  try {
    // Total users by role
    const [userStats] = await db.query<RowDataPacket[]>(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role'
    );

    // Total courses
    const [courseCount] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM courses'
    );

    // Total enrollments
    const [enrollmentCount] = await db.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM enrollments'
    );

    // Recent courses
    const [recentCourses] = await db.query<RowDataPacket[]>(
      `SELECT c.*, u.name as instructor_name
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       ORDER BY c.created_at DESC
       LIMIT 5`
    );

    res.json({
      userStats,
      totalCourses: courseCount[0].total,
      totalEnrollments: enrollmentCount[0].total,
      recentCourses
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}

export async function getInstructorDashboard(req: AuthRequest, res: Response) {
  try {
    const instructor_id = req.user!.id;

    // My courses
    const [courses] = await db.query<RowDataPacket[]>(
      'SELECT * FROM courses WHERE instructor_id = ? ORDER BY created_at DESC',
      [instructor_id]
    );

    // Total enrollments in my courses
    const [enrollmentStats] = await db.query<RowDataPacket[]>(
      `SELECT c.id, c.title, COUNT(e.id) as enrollment_count
       FROM courses c
       LEFT JOIN enrollments e ON c.id = e.course_id
       WHERE c.instructor_id = ?
       GROUP BY c.id`,
      [instructor_id]
    );

    res.json({
      courses,
      enrollmentStats
    });
  } catch (error) {
    console.error('Instructor dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}

export async function getStudentDashboard(req: AuthRequest, res: Response) {
  try {
    const student_id = req.user!.id;

    // My enrollments
    const [enrollments] = await db.query<RowDataPacket[]>(
      `SELECT e.*, c.title, c.description, u.name as instructor_name
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       JOIN users u ON c.instructor_id = u.id
       WHERE e.student_id = ?
       ORDER BY e.enrolled_at DESC`,
      [student_id]
    );

    // Count completed courses
    const [completedCount] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM enrollments WHERE student_id = ? AND status = 'COMPLETED'`,
      [student_id]
    );

    // Count in-progress courses
    const [inProgressCount] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM enrollments WHERE student_id = ? AND status = 'IN_PROGRESS'`,
      [student_id]
    );

    // Available courses (not enrolled)
    const [availableCourses] = await db.query<RowDataPacket[]>(
      `SELECT c.*, u.name as instructor_name
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       WHERE c.id NOT IN (
         SELECT course_id FROM enrollments WHERE student_id = ?
       )
       ORDER BY c.created_at DESC
       LIMIT 5`,
      [student_id]
    );

    res.json({
      enrollments,
      availableCourses,
      completedCourses: completedCount[0].total,
      inProgressCourses: inProgressCount[0].total
    });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
}
