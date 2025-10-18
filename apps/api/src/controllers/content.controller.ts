import { Response } from 'express';
import { AuthRequest } from '../types';
import db from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Upload content to a course
export async function uploadContent(req: AuthRequest, res: Response) {
  try {
    const { id: courseId } = req.params;
    const { title, file_type, file_url, file_size } = req.body;
    const userId = req.user?.id;

    // Verify user is instructor or admin
    if (req.user?.role !== 'INSTRUCTOR' && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only instructors can upload content' });
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
      return res.status(403).json({ message: 'You can only upload content to your own courses' });
    }

    // Insert content
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO contents (course_id, title, file_type, file_url, file_size) VALUES (?, ?, ?, ?, ?)',
      [courseId, title, file_type, file_url, file_size || 0]
    );

    res.status(201).json({
      message: 'Content uploaded successfully',
      content: {
        id: result.insertId,
        course_id: courseId,
        title,
        file_type,
        file_url,
        file_size: file_size || 0
      }
    });
  } catch (error) {
    console.error('Upload content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all content for a course
export async function getCourseContent(req: AuthRequest, res: Response) {
  try {
    const { id: courseId } = req.params;

    // Verify course exists
    const [courses] = await db.query<RowDataPacket[]>(
      'SELECT * FROM courses WHERE id = ?',
      [courseId]
    );

    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get all content for the course
    const [contents] = await db.query<RowDataPacket[]>(
      'SELECT * FROM contents WHERE course_id = ? ORDER BY created_at DESC',
      [courseId]
    );

    res.json({ contents });
  } catch (error) {
    console.error('Get course content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete content
export async function deleteContent(req: AuthRequest, res: Response) {
  try {
    const { id: contentId } = req.params;
    const userId = req.user?.id;

    // Verify user is instructor or admin
    if (req.user?.role !== 'INSTRUCTOR' && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only instructors can delete content' });
    }

    // Get content and verify ownership
    const [contents] = await db.query<RowDataPacket[]>(
      `SELECT c.*, co.instructor_id 
       FROM contents c 
       JOIN courses co ON c.course_id = co.id 
       WHERE c.id = ?`,
      [contentId]
    );

    if (contents.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const content = contents[0];
    if (req.user?.role === 'INSTRUCTOR' && content.instructor_id !== userId) {
      return res.status(403).json({ message: 'You can only delete content from your own courses' });
    }

    // Delete content
    await db.query('DELETE FROM contents WHERE id = ?', [contentId]);

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
