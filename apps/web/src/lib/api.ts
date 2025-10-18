import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Courses API
export const coursesAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/courses', { params }),
  getById: (id: string | number) => api.get(`/courses/${id}`),
  create: (data: { title: string; description: string }) =>
    api.post('/courses', data),
  update: (id: string | number, data: { title: string; description: string }) =>
    api.put(`/courses/${id}`, data),
  delete: (id: string | number) => api.delete(`/courses/${id}`),
};

// Enrollments API
export const enrollmentsAPI = {
  enroll: (courseId: string | number) =>
    api.post(`/enrollments/enroll/${courseId}`),
  getMyEnrollments: () => api.get('/enrollments/my-enrollments'),
  unenroll: (courseId: string | number) =>
    api.delete(`/enrollments/unenroll/${courseId}`),
};

// Dashboard API
export const dashboardAPI = {
  getAdmin: () => api.get('/dashboard/admin'),
  getInstructor: () => api.get('/dashboard/instructor'),
  getStudent: () => api.get('/dashboard/student'),
};
