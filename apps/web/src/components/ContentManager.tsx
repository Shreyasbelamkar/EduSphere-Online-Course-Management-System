'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Trash2, Plus, Video, FileText, Link as LinkIcon } from 'lucide-react';

interface Content {
  id: number;
  course_id: number;
  title: string;
  file_type: 'VIDEO' | 'PDF' | 'LINK';
  file_url: string;
  file_size: number;
  created_at: string;
}

interface ContentManagerProps {
  courseId: number;
  isInstructor?: boolean;
}

export default function ContentManager({ courseId, isInstructor = false }: ContentManagerProps) {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    file_type: 'VIDEO' as 'VIDEO' | 'PDF' | 'LINK',
    file_url: '',
    file_size: 0
  });

  useEffect(() => {
    fetchContents();
  }, [courseId]);

  const fetchContents = async () => {
    try {
      const response = await api.get(`/courses/${courseId}/content`);
      setContents(response.data.contents);
    } catch (error) {
      console.error('Failed to fetch contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/courses/${courseId}/content`, formData);
      setShowForm(false);
      setFormData({ title: '', file_type: 'VIDEO', file_url: '', file_size: 0 });
      fetchContents();
      alert('Content uploaded successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload content');
    }
  };

  const handleDelete = async (contentId: number) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    try {
      await api.delete(`/content/${contentId}`);
      fetchContents();
      alert('Content deleted successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete content');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Video className="w-5 h-5 text-red-500" />;
      case 'PDF': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'LINK': return <LinkIcon className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Content</h2>
        {isInstructor && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Content
          </button>
        )}
      </div>

      {/* Upload Form */}
      {showForm && isInstructor && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Upload New Content</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                className="input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content Type</label>
              <select
                className="input"
                value={formData.file_type}
                onChange={(e) => setFormData({ ...formData, file_type: e.target.value as any })}
              >
                <option value="VIDEO">Video (YouTube/Vimeo Link)</option>
                <option value="PDF">PDF Document</option>
                <option value="LINK">External Link</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {formData.file_type === 'VIDEO' ? 'Video URL' : 
                 formData.file_type === 'PDF' ? 'PDF URL' : 'Link URL'}
              </label>
              <input
                type="url"
                className="input"
                value={formData.file_url}
                onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                placeholder="https://..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.file_type === 'VIDEO' && 'Enter YouTube or Vimeo URL'}
                {formData.file_type === 'PDF' && 'Enter direct PDF file URL'}
                {formData.file_type === 'LINK' && 'Enter any external link'}
              </p>
            </div>

            {formData.file_type === 'PDF' && (
              <div>
                <label className="block text-sm font-medium mb-2">File Size (bytes, optional)</label>
                <input
                  type="number"
                  className="input"
                  value={formData.file_size}
                  onChange={(e) => setFormData({ ...formData, file_size: parseInt(e.target.value) || 0 })}
                />
              </div>
            )}

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">Upload</button>
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

      {/* Content List */}
      {contents.length === 0 ? (
        <div className="card text-center py-8 text-gray-500">
          No content available yet.
        </div>
      ) : (
        <div className="space-y-4">
          {contents.map((content) => (
            <div key={content.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getIcon(content.file_type)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{content.title}</h3>
                    <p className="text-sm text-gray-500">
                      {content.file_type} • {new Date(content.created_at).toLocaleDateString()}
                    </p>
                    
                    {/* Video Embed */}
                    {content.file_type === 'VIDEO' && (
                      <div className="mt-4">
                        {content.file_url.includes('youtube.com') || content.file_url.includes('youtu.be') ? (
                          <iframe
                            className="w-full aspect-video rounded-lg"
                            src={content.file_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                            allowFullScreen
                          />
                        ) : (
                          <video className="w-full aspect-video rounded-lg" controls>
                            <source src={content.file_url} />
                          </video>
                        )}
                      </div>
                    )}

                    {/* PDF/Link */}
                    {(content.file_type === 'PDF' || content.file_type === 'LINK') && (
                      <a
                        href={content.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-primary-600 hover:text-primary-700 underline"
                      >
                        {content.file_type === 'PDF' ? 'Download PDF' : 'Open Link'} →
                      </a>
                    )}
                  </div>
                </div>

                {isInstructor && (
                  <button
                    onClick={() => handleDelete(content.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                    title="Delete content"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
