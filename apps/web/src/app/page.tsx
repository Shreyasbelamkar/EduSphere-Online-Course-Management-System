import Link from 'next/link';
import { BookOpen, Users, Award, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to EduSphere
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Your gateway to quality online education. Learn from the best instructors,
              grow your skills, and achieve your goals.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register" className="btn btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Get Started
              </Link>
              <Link href="/login" className="btn bg-primary-700 text-white hover:bg-primary-800">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EduSphere?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <BookOpen className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Courses</h3>
              <p className="text-gray-600">
                Access a wide range of courses taught by experienced instructors
              </p>
            </div>
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Users className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn Together</h3>
              <p className="text-gray-600">
                Join a community of learners and grow together
              </p>
            </div>
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Award className="w-12 h-12 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your learning journey with quizzes and assessments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of students already learning on EduSphere
          </p>
          <Link 
            href="/courses" 
            className="inline-flex items-center gap-2 btn btn-primary"
          >
            Browse Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 EduSphere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
