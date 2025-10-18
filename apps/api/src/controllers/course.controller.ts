import { Request, Response } from 'express';
import { AuthRequest, UserRole } from '../types';
import db from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function getAllCourses(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT c.*, u.name as instructor_name 
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
    `;
    const params: any[] = [];

    if (search) {
      query += ' WHERE c.title LIKE ? OR c.description LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [courses] = await db.query<RowDataPacket[]>(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM courses';
    const countParams: any[] = [];
    
    if (search) {
      countQuery += ' WHERE title LIKE ? OR description LIKE ?';
      countParams.push(`%${search}%`, `%${search}%`);
    }

    const [countResult] = await db.query<RowDataPacket[]>(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

export async function getCourseById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const [courses] = await db.query<RowDataPacket[]>(
      `SELECT c.*, u.name as instructor_name, u.email as instructor_email
       FROM courses c
       JOIN users u ON c.instructor_id = u.id
       WHERE c.id = ?`,
      [id]
    );

    if (courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course: courses[0] });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
}

export async function createCourse(req: AuthRequest, res: Response) {
  try {
    const { title, description } = req.body;
    const instructor_id = req.user!.id;

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO courses (title, description, instructor_id) VALUES (?, ?, ?)',
      [title, description, instructor_id]
    );

    res.status(201).json({
      message: 'Course created successfully',
      course: {
        id: result.insertId,
        title,
        description,
        instructor_id
      }
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
}

export async function updateCourse(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Check if course exists and user has permission
    const [courses] = await db.query<RowDataPacket[]>(
      'SELECT instructor_id FROM courses WHERE id = ?',
      [id]
    );

    if (courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Only instructor who created or admin can update
    if (req.user!.role !== UserRole.ADMIN && courses[0].instructor_id !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

    await db.query(
      'UPDATE courses SET title = ?, description = ? WHERE id = ?',
      [title, description, id]
    );

    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
}

export async function deleteCourse(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    // Check if course exists
    const [courses] = await db.query<RowDataPacket[]>(
      'SELECT id FROM courses WHERE id = ?',
      [id]
    );

    if (courses.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await db.query('DELETE FROM courses WHERE id = ?', [id]);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
}
