'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { authAPI, dashboardAPI, coursesAPI } from '@/lib/api';
import { User, UserRole } from '@/types';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import InstructorDashboard from '@/components/dashboards/InstructorDashboard';
import StudentDashboard from '@/components/dashboards/StudentDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
        </div>

        {user.role === UserRole.ADMIN && <AdminDashboard />}
        {user.role === UserRole.INSTRUCTOR && <InstructorDashboard />}
        {user.role === UserRole.STUDENT && <StudentDashboard />}
      </div>
    </div>
  );
}
