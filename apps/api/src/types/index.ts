import { Request } from 'express';

export enum UserRole {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT'
}

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  enrolled_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: UserRole;
  };
}

export interface JWTPayload {
  id: number;
  email: string;
  role: UserRole;
}
