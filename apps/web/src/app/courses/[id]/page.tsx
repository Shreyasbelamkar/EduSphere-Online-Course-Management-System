'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ContentManager from '@/components/ContentManager';
import QuizManager from '@/components/QuizManager';
import { coursesAPI, enrollmentsAPI, authAPI } from '@/lib/api';
import { Course, User } from '@/types';
import { BookOpen, User as UserIcon, Calendar, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [courseRes, userRes] = await Promise.all([
        coursesAPI.getById(params.id as string),
        authAPI.getMe().catch(() => ({ data: { user: null } })),
      ]);
      
      setCourse(courseRes.data.course);
      setUser(userRes.data.user);

      // Check if enrolled
      if (userRes.data.user?.role === 'STUDENT') {
        const enrollmentsRes = await enrollmentsAPI.getMyEnrollments();
        const isEnrolled = enrollmentsRes.data.enrollments.some(
          (e: any) => e.course_id === parseInt(params.id as string)
        );
        setEnrolled(isEnrolled);
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setEnrolling(true);
      await enrollmentsAPI.enroll(params.id as string);
      setEnrolled(true);
      alert('Successfully enrolled in course!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-primary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6" />
              <span className="text-primary-100">Course</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <div className="flex items-center gap-6 text-primary-100">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>{course.instructor_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(course.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">About This Course</h2>
                <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
              </div>

              {/* Content Section - Show if enrolled or instructor */}
              {(enrolled || user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                <ContentManager 
                  courseId={parseInt(params.id as string)} 
                  isInstructor={user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN'}
                />
              )}

              {/* Quiz Section - Show if enrolled or instructor */}
              {(enrolled || user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                <QuizManager 
                  courseId={parseInt(params.id as string)} 
                  isInstructor={user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN'}
                  isStudent={user?.role === 'STUDENT' && enrolled}
                />
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="card sticky top-4">
                {enrolled ? (
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">You're enrolled!</p>
                    <p className="text-gray-600 text-sm mb-4">
                      Access course materials below
                    </p>
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="btn btn-secondary w-full"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                ) : user?.role === 'STUDENT' ? (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Enroll Now</h3>
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="btn btn-primary w-full disabled:opacity-50"
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll in Course'}
                    </button>
                  </div>
                ) : !user ? (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Get Started</h3>
                    <p className="text-gray-600 mb-4">
                      Sign in to enroll in this course
                    </p>
                    <button
                      onClick={() => router.push('/login')}
                      className="btn btn-primary w-full"
                    >
                      Sign In
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-600">
                    <p>Only students can enroll in courses</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
