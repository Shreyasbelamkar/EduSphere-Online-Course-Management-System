'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface Quiz {
  id: number;
  course_id: number;
  question: string;
  options: string[];
  correct_option?: number;
  created_at: string;
}

interface QuizManagerProps {
  courseId: number;
  isInstructor?: boolean;
  isStudent?: boolean;
}

export default function QuizManager({ courseId, isInstructor = false, isStudent = false }: QuizManagerProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_option: 0
  });
  const [studentAnswers, setStudentAnswers] = useState<{ [key: number]: number }>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, [courseId]);

  const fetchQuizzes = async () => {
    try {
      const response = await api.get(`/courses/${courseId}/quiz`);
      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/courses/${courseId}/quiz`, formData);
      setShowForm(false);
      setFormData({ question: '', options: ['', '', '', ''], correct_option: 0 });
      fetchQuizzes();
      alert('Quiz question added successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add quiz question');
    }
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await api.delete(`/quiz/${quizId}`);
      fetchQuizzes();
      alert('Question deleted successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete question');
    }
  };

  const handleStudentSubmit = async () => {
    if (Object.keys(studentAnswers).length !== quizzes.length) {
      alert('Please answer all questions before submitting!');
      return;
    }

    try {
      const response = await api.post(`/courses/${courseId}/quiz/submit`, {
        answers: studentAnswers
      });
      setQuizResult(response.data.attempt);
      setShowResults(true);
      alert(`Quiz submitted! Your score: ${response.data.attempt.percentage}%`);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit quiz');
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  if (loading) {
    return <div className="text-center py-8">Loading quiz...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Quiz</h2>
        {isInstructor && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        )}
      </div>

      {/* Add Question Form (Instructor) */}
      {showForm && isInstructor && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Add Quiz Question</h3>
          <form onSubmit={handleSubmitQuiz} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Question</label>
              <textarea
                className="input"
                rows={3}
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium">Options</label>
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={formData.correct_option === index}
                    onChange={() => setFormData({ ...formData, correct_option: index })}
                    className="w-4 h-4"
                  />
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    required
                  />
                  <span className="text-sm text-gray-500">
                    {formData.correct_option === index && '✓ Correct'}
                  </span>
                </div>
              ))}
              <p className="text-sm text-gray-500">Select the radio button for the correct answer</p>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">Add Question</button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quiz Questions */}
      {quizzes.length === 0 ? (
        <div className="card text-center py-8 text-gray-500">
          No quiz questions available yet.
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {quizzes.map((quiz, qIndex) => (
              <div key={quiz.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">
                    Question {qIndex + 1}: {quiz.question}
                  </h3>
                  {isInstructor && (
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Delete question"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {quiz.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      {isStudent ? (
                        <input
                          type="radio"
                          name={`quiz-${quiz.id}`}
                          value={oIndex}
                          checked={studentAnswers[quiz.id] === oIndex}
                          onChange={() => setStudentAnswers({ ...studentAnswers, [quiz.id]: oIndex })}
                          className="w-4 h-4"
                          disabled={showResults}
                        />
                      ) : null}
                      <label className="flex-1 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        {option}
                        {isInstructor && quiz.correct_option === oIndex && (
                          <span className="ml-2 text-green-600 font-medium">✓ Correct Answer</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button (Student) */}
          {isStudent && !showResults && (
            <div className="flex justify-center">
              <button
                onClick={handleStudentSubmit}
                className="btn btn-primary px-8"
              >
                Submit Quiz
              </button>
            </div>
          )}

          {/* Results (Student) */}
          {showResults && quizResult && (
            <div className="card bg-primary-50 border-2 border-primary-500">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary-700 mb-2">Quiz Results</h3>
                <div className="text-5xl font-bold text-primary-600 my-4">
                  {quizResult.percentage}%
                </div>
                <p className="text-lg text-gray-700">
                  You got {quizResult.correct_answers} out of {quizResult.total_questions} questions correct!
                </p>
                {quizResult.percentage >= 70 ? (
                  <div className="flex items-center justify-center gap-2 mt-4 text-green-600">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold">Great job! You passed!</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 mt-4 text-orange-600">
                    <XCircle className="w-6 h-6" />
                    <span className="font-semibold">Keep practicing!</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
