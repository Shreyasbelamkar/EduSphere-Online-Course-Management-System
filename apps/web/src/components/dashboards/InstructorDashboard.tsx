'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardAPI, coursesAPI } from '@/lib/api';
import { BookOpen, Users, Plus, Edit, Trash2 } from 'lucide-react';

export default function InstructorDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await dashboardAPI.getInstructor();
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await coursesAPI.create(formData);
      setShowCreateModal(false);
      setFormData({ title: '', description: '' });
      fetchData();
      alert('Course created successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await coursesAPI.delete(id);
      fetchData();
      alert('Course deleted successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to delete course');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">My Courses</p>
              <p className="text-3xl font-bold mt-1">{data?.courses?.length || 0}</p>
            </div>
            <BookOpen className="w-12 h-12 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Enrollments</p>
              <p className="text-3xl font-bold mt-1">
                {data?.enrollmentStats?.reduce((sum: number, stat: any) => sum + stat.enrollment_count, 0) || 0}
              </p>
            </div>
            <Users className="w-12 h-12 text-green-600" />
          </div>
        </div>
      </div>

      {/* Create Course Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="btn btn-primary flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Create New Course
      </button>

      {/* Courses List */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">My Courses</h2>
        {data?.courses?.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No courses yet. Create your first course!</p>
        ) : (
          <div className="space-y-3">
            {data?.courses?.map((course: any) => (
              <div key={course.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>
                      {data?.enrollmentStats?.find((s: any) => s.id === course.id)?.enrollment_count || 0} students
                    </span>
                    <span>{new Date(course.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" onClick={() => handleDeleteCourse(course.id)} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Course Title</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Introduction to Web Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  className="input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what students will learn..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary flex-1 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Course'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
