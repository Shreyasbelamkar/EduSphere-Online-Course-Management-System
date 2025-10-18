# Phase 2 Implementation Guide

## Overview

Phase 2 adds interactive learning features:
- Video content upload and streaming
- Document/PDF upload and viewing
- Quiz creation and evaluation
- Progress tracking
- Enhanced analytics

## Week 3: Content Upload Module

### Backend Changes

#### 1. Install Dependencies

```bash
cd apps/api
npm install multer @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

#### 2. Create Content Routes

**File**: `apps/api/src/routes/content.routes.ts`

```typescript
import { Router } from 'express';
import multer from 'multer';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { UserRole } from '../types';
import {
  uploadContent,
  getContentByCourse,
  deleteContent
} from '../controllers/content.controller';

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

const router = Router();

router.post(
  '/:courseId/content',
  requireAuth,
  requireRole(UserRole.INSTRUCTOR, UserRole.ADMIN),
  upload.single('file'),
  uploadContent
);

router.get(
  '/:courseId/content',
  requireAuth,
  getContentByCourse
);

router.delete(
  '/content/:contentId',
  requireAuth,
  requireRole(UserRole.INSTRUCTOR, UserRole.ADMIN),
  deleteContent
);

export default router;
```

#### 3. Content Controller

**File**: `apps/api/src/controllers/content.controller.ts`

```typescript
import { Response } from 'express';
import { AuthRequest } from '../types';
import db from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function uploadContent(req: AuthRequest, res: Response) {
  try {
    const { courseId } = req.params;
    const { title, type } = req.body; // type: VIDEO or PDF
    const file = req.file;

    if (!file && type !== 'LINK') {
      return res.status(400).json({ error: 'File is required' });
    }

    // For YouTube links
    let fileUrl = req.body.url || '';
    let fileSize = 0;

    if (file) {
      // TODO: Upload to S3 or cloud storage
      fileUrl = `/uploads/${file.filename}`;
      fileSize = file.size;
    }

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO contents (course_id, title, file_type, file_url, file_size) VALUES (?, ?, ?, ?, ?)',
      [courseId, title, type, fileUrl, fileSize]
    );

    res.status(201).json({
      message: 'Content uploaded successfully',
      content: {
        id: result.insertId,
        title,
        file_type: type,
        file_url: fileUrl
      }
    });
  } catch (error) {
    console.error('Upload content error:', error);
    res.status(500).json({ error: 'Failed to upload content' });
  }
}

export async function getContentByCourse(req: AuthRequest, res: Response) {
  try {
    const { courseId } = req.params;

    // Check if user is enrolled or is instructor/admin
    const [enrollments] = await db.query<RowDataPacket[]>(
      'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?',
      [req.user!.id, courseId]
    );

    const [courses] = await db.query<RowDataPacket[]>(
      'SELECT instructor_id FROM courses WHERE id = ?',
      [courseId]
    );

    const isInstructor = courses[0]?.instructor_id === req.user!.id;
    const isEnrolled = enrollments.length > 0;
    const isAdmin = req.user!.role === 'ADMIN';

    if (!isInstructor && !isEnrolled && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to view content' });
    }

    const [contents] = await db.query<RowDataPacket[]>(
      'SELECT * FROM contents WHERE course_id = ? ORDER BY created_at ASC',
      [courseId]
    );

    res.json({ contents });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
}

export async function deleteContent(req: AuthRequest, res: Response) {
  try {
    const { contentId } = req.params;

    await db.query('DELETE FROM contents WHERE id = ?', [contentId]);

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
}
```

#### 4. Update Server Routes

**File**: `apps/api/src/server.ts`

Add:
```typescript
import contentRoutes from './routes/content.routes';

app.use('/api/content', contentRoutes);
```

### Frontend Changes

#### 1. Content Upload Component

**File**: `apps/web/src/components/ContentUpload.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';

interface ContentUploadProps {
  courseId: number;
  onUploadComplete: () => void;
}

export default function ContentUpload({ courseId, onUploadComplete }: ContentUploadProps) {
  const [type, setType] = useState<'VIDEO' | 'PDF' | 'LINK'>('LINK');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', type);
      
      if (type === 'LINK') {
        formData.append('url', url);
      } else if (file) {
        formData.append('file', file);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/content/${courseId}/content`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData
        }
      );

      if (!response.ok) throw new Error('Upload failed');

      alert('Content uploaded successfully!');
      setTitle('');
      setUrl('');
      setFile(null);
      onUploadComplete();
    } catch (error) {
      alert('Failed to upload content');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-lg font-semibold">Upload Content</h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">Content Type</label>
        <select
          className="input"
          value={type}
          onChange={(e) => setType(e.target.value as any)}
        >
          <option value="LINK">YouTube Link</option>
          <option value="VIDEO">Video File</option>
          <option value="PDF">PDF Document</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          required
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Lesson 1: Introduction"
        />
      </div>

      {type === 'LINK' ? (
        <div>
          <label className="block text-sm font-medium mb-2">YouTube URL</label>
          <input
            type="url"
            required
            className="input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload {type === 'VIDEO' ? 'Video' : 'PDF'}
          </label>
          <input
            type="file"
            required
            accept={type === 'VIDEO' ? 'video/*' : 'application/pdf'}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="input"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={uploading}
        className="btn btn-primary w-full disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Content'}
      </button>
    </form>
  );
}
```

## Week 4: Quiz Module

### Backend Changes

#### 1. Quiz Routes

**File**: `apps/api/src/routes/quiz.routes.ts`

```typescript
import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { UserRole } from '../types';
import {
  createQuiz,
  getQuizzesByCourse,
  submitQuiz,
  getQuizResults
} from '../controllers/quiz.controller';

const router = Router();

router.post(
  '/:courseId/quiz',
  requireAuth,
  requireRole(UserRole.INSTRUCTOR, UserRole.ADMIN),
  [
    body('question').notEmpty(),
    body('options').isArray({ min: 2 }),
    body('correct_option').isInt({ min: 0 }),
    validate
  ],
  createQuiz
);

router.get(
  '/:courseId/quiz',
  requireAuth,
  getQuizzesByCourse
);

router.post(
  '/:courseId/quiz/submit',
  requireAuth,
  requireRole(UserRole.STUDENT),
  submitQuiz
);

router.get(
  '/:courseId/quiz/results',
  requireAuth,
  getQuizResults
);

export default router;
```

#### 2. Quiz Controller

**File**: `apps/api/src/controllers/quiz.controller.ts`

```typescript
import { Response } from 'express';
import { AuthRequest } from '../types';
import db from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export async function createQuiz(req: AuthRequest, res: Response) {
  try {
    const { courseId } = req.params;
    const { question, options, correct_option } = req.body;

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO quizzes (course_id, question, options, correct_option) VALUES (?, ?, ?, ?)',
      [courseId, question, JSON.stringify(options), correct_option]
    );

    res.status(201).json({
      message: 'Quiz question created',
      quiz: { id: result.insertId, question }
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
}

export async function getQuizzesByCourse(req: AuthRequest, res: Response) {
  try {
    const { courseId } = req.params;

    const [quizzes] = await db.query<RowDataPacket[]>(
      'SELECT id, course_id, question, options, created_at FROM quizzes WHERE course_id = ?',
      [courseId]
    );

    // Parse JSON options
    const parsedQuizzes = quizzes.map(q => ({
      ...q,
      options: JSON.parse(q.options)
    }));

    res.json({ quizzes: parsedQuizzes });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
}

export async function submitQuiz(req: AuthRequest, res: Response) {
  try {
    const { courseId } = req.params;
    const { answers } = req.body; // { questionId: selectedOption }

    const [quizzes] = await db.query<RowDataPacket[]>(
      'SELECT id, correct_option FROM quizzes WHERE course_id = ?',
      [courseId]
    );

    let score = 0;
    quizzes.forEach(quiz => {
      if (answers[quiz.id] === quiz.correct_option) {
        score++;
      }
    });

    await db.query<ResultSetHeader>(
      'INSERT INTO quiz_attempts (student_id, course_id, score, total_questions) VALUES (?, ?, ?, ?)',
      [req.user!.id, courseId, score, quizzes.length]
    );

    res.json({
      score,
      total: quizzes.length,
      percentage: Math.round((score / quizzes.length) * 100)
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
}

export async function getQuizResults(req: AuthRequest, res: Response) {
  try {
    const { courseId } = req.params;

    const [attempts] = await db.query<RowDataPacket[]>(
      `SELECT qa.*, u.name as student_name
       FROM quiz_attempts qa
       JOIN users u ON qa.student_id = u.id
       WHERE qa.course_id = ?
       ORDER BY qa.submitted_at DESC`,
      [courseId]
    );

    res.json({ attempts });
  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
}
```

## Testing Checklist

### Content Upload
- [ ] Instructor can upload YouTube link
- [ ] Instructor can upload video file
- [ ] Instructor can upload PDF
- [ ] Students can view content after enrollment
- [ ] Non-enrolled users cannot access content

### Quiz Module
- [ ] Instructor can create quiz questions
- [ ] Students can view quiz questions
- [ ] Students can submit answers
- [ ] Score is calculated correctly
- [ ] Results are stored in database
- [ ] Instructor can view all attempts

## Deployment Updates

After implementing Phase 2:

1. **Update Environment Variables**
   - Add S3/cloud storage credentials
   - Configure file upload limits

2. **Database Migration**
   - Run schema updates on production
   - Test content and quiz tables

3. **Frontend Build**
   - Rebuild and redeploy to Vercel
   - Test file upload functionality

4. **Backend Deploy**
   - Update Render service
   - Verify file storage works

## Performance Optimization

- Use CDN for video delivery
- Compress PDFs before upload
- Implement lazy loading for content
- Add pagination for quiz results
- Cache frequently accessed content

## Security Considerations

- Validate file types and sizes
- Scan uploaded files for malware
- Use signed URLs for private content
- Rate limit quiz submissions
- Prevent quiz answer exposure in API
