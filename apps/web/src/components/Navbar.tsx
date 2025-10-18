'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, LogOut, User } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useEffect, useState } from 'react';
import { User as UserType } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const fetchUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
            <BookOpen className="w-6 h-6" />
            EduSphere
          </Link>

          <div className="flex items-center gap-6">
            <Link 
              href="/courses" 
              className={`hover:text-primary-600 ${pathname === '/courses' ? 'text-primary-600 font-semibold' : ''}`}
            >
              Courses
            </Link>

            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`hover:text-primary-600 ${pathname === '/dashboard' ? 'text-primary-600 font-semibold' : ''}`}
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-primary-600">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
