-- Seed data for EduSphere
USE edusphere;

-- Insert sample users
-- Password for all users: "password123" (hashed with bcrypt, 10 rounds)

INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@edusphere.com', '$2b$10$kST19CFZcb.DoMnhC/jIBuU1.kVd8o4BDYRRpNd3Ukq8DfgENEFF7C', 'ADMIN'),
('John Instructor', 'john@edusphere.com', '$2b$10$kST19CFZcb.DoMnhC/jIBuU1.kVd8o4BDYRRpNd3Ukq8DfgENEFF7C', 'INSTRUCTOR'),
('Jane Instructor', 'jane@edusphere.com', '$2b$10$kST19CFZcb.DoMnhC/jIBuU1.kVd8o4BDYRRpNd3Ukq8DfgENEFF7C', 'INSTRUCTOR'),
('Alice Student', 'alice@edusphere.com', '$2b$10$kST19CFZcb.DoMnhC/jIBuU1.kVd8o4BDYRRpNd3Ukq8DfgENEFF7C', 'STUDENT'),
('Bob Student', 'bob@edusphere.com', '$2b$10$kST19CFZcb.DoMnhC/jIBuU1.kVd8o4BDYRRpNd3Ukq8DfgENEFF7C', 'STUDENT');

-- Insert sample courses
INSERT INTO courses (title, description, instructor_id) VALUES
('Introduction to Web Development', 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.', 2),
('Advanced React Patterns', 'Master advanced React concepts including hooks, context, and performance optimization.', 2),
('Node.js Backend Development', 'Build scalable backend APIs with Node.js, Express, and databases.', 3),
('Database Design Fundamentals', 'Learn how to design efficient and normalized database schemas.', 3),
('Full Stack JavaScript', 'Complete guide to building full-stack applications with MERN stack.', 2);

-- Insert sample enrollments
INSERT INTO enrollments (student_id, course_id) VALUES
(4, 1),  -- Alice enrolled in Web Development
(4, 2),  -- Alice enrolled in React
(5, 1),  -- Bob enrolled in Web Development
(5, 3),  -- Bob enrolled in Node.js
(5, 5);  -- Bob enrolled in Full Stack

-- Note: Contents, quizzes, and quiz_attempts will be added in Phase 2
