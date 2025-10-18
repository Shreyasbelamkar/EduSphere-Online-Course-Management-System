'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api, { dashboardAPI } from '@/lib/api';
import { BookOpen, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await dashboardAPI.getStudent();
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (courseId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Mark this course as completed?')) return;
    
    try {
      await api.post(`/enrollments/complete/${courseId}`);
      alert('Course marked as completed!');
      fetchData(); // Refresh data
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to mark as complete');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Enrolled Courses</p>
              <p className="text-3xl font-bold mt-1">{data?.enrollments?.length || 0}</p>
            </div>
            <BookOpen className="w-12 h-12 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-3xl font-bold mt-1">{data?.inProgressCourses || 0}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-3xl font-bold mt-1">{data?.completedCourses || 0}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-600" />
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">My Courses</h2>
        {data?.enrollments?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't enrolled in any courses yet.</p>
            <Link href="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data?.enrollments?.map((enrollment: any) => (
              <Link key={enrollment.id} href={`/courses/${enrollment.course_id}`}>
                <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{enrollment.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{enrollment.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>Instructor: {enrollment.instructor_name}</span>
                        <span>Enrolled: {formatDate(enrollment.enrolled_at)}</span>
                        {enrollment.status === 'COMPLETED' && (
                          <span className="text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                    {enrollment.status !== 'COMPLETED' && (
                      <button
                        onClick={(e) => handleMarkComplete(enrollment.course_id, e)}
                        className="btn btn-primary text-sm px-3 py-1 ml-4"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Available Courses */}
      {data?.availableCourses?.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Recommended Courses</h2>
          <div className="space-y-3">
            {data?.availableCourses?.map((course: any) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{course.description}</p>
                  <p className="text-sm text-gray-500 mt-2">by {course.instructor_name}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/courses" className="btn btn-secondary w-full mt-4">
            View All Courses
          </Link>
        </div>
      )}
    </div>
  );
}
