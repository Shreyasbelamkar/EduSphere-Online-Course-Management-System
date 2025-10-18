'use client';

import { useEffect, useState } from 'react';
import { dashboardAPI } from '@/lib/api';
import { Users, BookOpen, UserCheck, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await dashboardAPI.getAdmin();
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const userStatsByRole = data?.userStats?.reduce((acc: any, stat: any) => {
    acc[stat.role] = stat.count;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold mt-1">
                {(userStatsByRole?.ADMIN || 0) + 
                 (userStatsByRole?.INSTRUCTOR || 0) + 
                 (userStatsByRole?.STUDENT || 0)}
              </p>
            </div>
            <Users className="w-12 h-12 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Courses</p>
              <p className="text-3xl font-bold mt-1">{data?.totalCourses || 0}</p>
            </div>
            <BookOpen className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Enrollments</p>
              <p className="text-3xl font-bold mt-1">{data?.totalEnrollments || 0}</p>
            </div>
            <UserCheck className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Instructors</p>
              <p className="text-3xl font-bold mt-1">{userStatsByRole?.INSTRUCTOR || 0}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Recent Courses</h2>
        <div className="space-y-3">
          {data?.recentCourses?.map((course: any) => (
            <div key={course.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">{course.title}</p>
                <p className="text-sm text-gray-600">by {course.instructor_name}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(course.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
