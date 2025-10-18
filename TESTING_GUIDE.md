# 🧪 EduSphere Testing Guide

## Quick Start Testing

### Prerequisites
- ✅ Docker Desktop running
- ✅ Database started (`cd infra && docker-compose up -d`)
- ✅ Application running (`npm run dev`)
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:5000

---

## Test Scenario 1: Complete Instructor Workflow

### Step 1: Register as Instructor
1. Go to http://localhost:3000/register
2. Fill in:
   - Name: `Test Instructor`
   - Email: `instructor@test.com`
   - Password: `password123`
   - Role: **Instructor**
3. Click Register
4. Login with same credentials

### Step 2: Create a Course
1. Go to Dashboard
2. Click "Create New Course"
3. Fill in:
   - Title: `Introduction to Web Development`
   - Description: `Learn HTML, CSS, and JavaScript basics`
4. Click "Create Course"
5. Note the course ID or name

### Step 3: Add Content to Course
1. Click on your created course
2. Scroll to "Course Content" section
3. Click "Add Content"
4. **Add Video:**
   - Title: `Lesson 1: HTML Basics`
   - Type: Video
   - URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
5. Click "Upload"
6. **Add PDF:**
   - Title: `Course Notes - Chapter 1`
   - Type: PDF
   - URL: `https://example.com/sample.pdf`
7. Click "Upload"

### Step 4: Create Quiz Questions
1. Scroll to "Course Quiz" section
2. Click "Add Question"
3. **Question 1:**
   - Question: `What does HTML stand for?`
   - Option 1: `Hyper Text Markup Language` (select as correct)
   - Option 2: `High Tech Modern Language`
   - Option 3: `Home Tool Markup Language`
   - Option 4: `Hyperlinks and Text Markup Language`
4. Click "Add Question"
5. **Question 2:**
   - Question: `Which tag is used for creating a paragraph?`
   - Option 1: `<p>` (select as correct)
   - Option 2: `<para>`
   - Option 3: `<paragraph>`
   - Option 4: `<text>`
6. Click "Add Question"

**Expected Result:** ✅ Content and quiz questions appear in the course

---

## Test Scenario 2: Complete Student Workflow

### Step 1: Register as Student
1. Logout (if logged in)
2. Go to http://localhost:3000/register
3. Fill in:
   - Name: `Test Student`
   - Email: `student@test.com`
   - Password: `password123`
   - Role: **Student**
4. Click Register
5. Login with same credentials

### Step 2: Browse and Enroll
1. Go to "Courses" page
2. Find "Introduction to Web Development"
3. Click on the course
4. Click "Enroll in Course"
5. Confirm enrollment

**Expected Result:** ✅ "You're enrolled!" message appears

### Step 3: View Course Content
1. Scroll down to "Course Content" section
2. **Video should be visible:**
   - Embedded YouTube player
   - Can play video
3. **PDF link should be visible:**
   - Click "Download PDF" link
   - Opens in new tab

**Expected Result:** ✅ All content is accessible

### Step 4: Take Quiz
1. Scroll to "Course Quiz" section
2. Read questions
3. Select answers:
   - Question 1: Select "Hyper Text Markup Language"
   - Question 2: Select "<p>"
4. Click "Submit Quiz"

**Expected Result:** ✅ Score displays: "100% - Great job! You passed!"

### Step 5: Try Wrong Answers
1. Refresh the page
2. Take quiz again with wrong answers
3. Submit

**Expected Result:** ✅ Lower score displays with "Keep practicing!" message

---

## Test Scenario 3: Admin Workflow

### Step 1: Register as Admin
1. Logout
2. Register with:
   - Email: `admin@test.com`
   - Role: **Admin**

### Step 2: View All Courses
1. Go to Dashboard
2. View system statistics
3. See all courses from all instructors

### Step 3: Manage Any Course
1. Navigate to any course
2. Add content (admin can manage any course)
3. Add quiz questions
4. Delete content/quiz

**Expected Result:** ✅ Admin has full access to all courses

---

## Test Scenario 4: Content Types

### Test Video Content
**YouTube:**
- URL: `https://www.youtube.com/watch?v=VIDEO_ID`
- Should embed properly

**Vimeo:**
- URL: `https://vimeo.com/VIDEO_ID`
- Should embed properly

**Direct MP4:**
- URL: `https://example.com/video.mp4`
- Should show HTML5 video player

### Test PDF Content
- URL: `https://example.com/document.pdf`
- Should show "Download PDF" link
- Opens in new tab

### Test External Links
- URL: `https://developer.mozilla.org/`
- Should show "Open Link" button
- Opens in new tab

---

## Test Scenario 5: Security & Permissions

### Test 1: Unauthenticated Access
1. Logout
2. Try to access `/dashboard`
**Expected:** ✅ Redirected to login

### Test 2: Student Cannot Create Course
1. Login as student
2. Try to access course creation
**Expected:** ✅ No "Create Course" button visible

### Test 3: Instructor Cannot Manage Other's Courses
1. Login as Instructor A
2. Create a course
3. Logout and login as Instructor B
4. Try to add content to Instructor A's course
**Expected:** ✅ 403 Forbidden error

### Test 4: Student Must Be Enrolled
1. Login as student
2. Go to course WITHOUT enrolling
**Expected:** ✅ Content and quiz sections not visible

---

## Test Scenario 6: Quiz Functionality

### Test Quiz Creation
- Minimum 2 options required
- Must select correct answer
- Can add multiple questions
- Questions appear in order

### Test Quiz Taking
- Can only select one answer per question
- Must answer all questions to submit
- Cannot see correct answers before submission
- Score calculated correctly

### Test Quiz Scoring
- 2/2 correct = 100%
- 1/2 correct = 50%
- 0/2 correct = 0%
- Pass threshold = 70%

---

## API Testing with Postman

### Import Collection
1. Open Postman
2. Import `docs/API.postman_collection.json`
3. Set environment variable: `base_url = http://localhost:5000/api`

### Test Endpoints

**Content Endpoints:**
```
POST /api/courses/1/content
GET /api/courses/1/content
DELETE /api/content/1
```

**Quiz Endpoints:**
```
POST /api/courses/1/quiz
GET /api/courses/1/quiz
POST /api/courses/1/quiz/submit
GET /api/quiz/attempts
DELETE /api/quiz/1
```

---

## Common Issues & Solutions

### Issue: Video Not Embedding
**Solution:** Ensure YouTube URL is in format:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- Or: `https://youtu.be/VIDEO_ID`

### Issue: Quiz Not Submitting
**Solution:** Ensure all questions are answered before clicking submit

### Issue: Content Not Showing
**Solution:** 
- Check if user is enrolled (for students)
- Check if user is instructor/admin (for content management)

### Issue: 401 Unauthorized
**Solution:** Login again - JWT token may have expired

---

## Performance Testing

### Load Test Scenarios
1. Create 50+ courses
2. Add 10+ content items per course
3. Add 20+ quiz questions per course
4. Enroll 100+ students
5. Test page load times

### Expected Performance
- Course listing: < 1 second
- Course detail: < 2 seconds
- Content loading: < 1 second
- Quiz submission: < 500ms

---

## Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

Mobile:
- ✅ iOS Safari
- ✅ Android Chrome

---

## Automated Testing (Future)

### Unit Tests
- Controller functions
- Validation middleware
- Utility functions

### Integration Tests
- API endpoint tests
- Database operations
- Authentication flow

### E2E Tests
- User registration flow
- Course creation flow
- Enrollment flow
- Content upload flow
- Quiz taking flow

---

## Test Data

### Sample Users
```
Admin: admin@edusphere.com / password123
Instructor: john@edusphere.com / password123
Student: alice@edusphere.com / password123
```

### Sample Courses
- Introduction to Web Development
- Advanced React Patterns
- Node.js Backend Development
- Database Design Fundamentals
- Full Stack JavaScript

---

## Success Criteria

✅ All user roles can register and login  
✅ Instructors can create courses  
✅ Instructors can add content (video, PDF, link)  
✅ Instructors can create quiz questions  
✅ Students can enroll in courses  
✅ Students can view content after enrollment  
✅ Students can take quizzes  
✅ Quiz scoring works correctly  
✅ Role-based permissions enforced  
✅ No unauthorized access possible  
✅ All CRUD operations work  
✅ UI is responsive on all devices  

---

**Testing Complete!** 🎉

If all scenarios pass, your EduSphere application is working perfectly!
