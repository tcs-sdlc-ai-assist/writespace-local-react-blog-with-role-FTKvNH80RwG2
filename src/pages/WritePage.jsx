import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth.js';
import { getPostById, createPost, updatePost, canEditPost } from '../utils/blogManager.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

function WritePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (isEditMode) {
      const post = getPostById(id);

      if (!post) {
        navigate('/blogs', { replace: true });
        return;
      }

      if (!canEditPost(post, user)) {
        navigate('/blogs', { replace: true });
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setLoading(false);
    }
  }, [id, isEditMode, navigate, user]);

  function validate() {
    let valid = true;
    setTitleError('');
    setContentError('');
    setError('');

    if (!title.trim()) {
      setTitleError('Title is required.');
      valid = false;
    }

    if (!content.trim()) {
      setContentError('Content is required.');
      valid = false;
    }

    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (isEditMode) {
      const result = updatePost(id, { title, content }, user);

      if (!result.success) {
        setError(result.error);
        return;
      }

      navigate(`/blog/${id}`, { replace: true });
    } else {
      const result = createPost({ title, content }, user);

      if (!result.success) {
        setError(result.error);
        return;
      }

      navigate(`/blog/${result.post.id}`, { replace: true });
    }
  }

  function handleCancel() {
    if (isEditMode) {
      navigate(`/blog/${id}`);
    } else {
      navigate('/blogs');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Post' : 'Write a New Post'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {isEditMode
                ? 'Update your blog post below.'
                : 'Share your thoughts with the community.'}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (titleError) setTitleError('');
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your post title"
                />
                {titleError && (
                  <p className="mt-1 text-sm text-red-600">{titleError}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (contentError) setContentError('');
                  }}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-y"
                  placeholder="Write your blog content here..."
                />
                <div className="flex items-center justify-between mt-1">
                  {contentError ? (
                    <p className="text-sm text-red-600">{contentError}</p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-gray-500">
                    {content.length} character{content.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  {isEditMode ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default WritePage;