import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth.js';
import { getPostById, canEditPost, deletePost } from '../utils/blogManager.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Avatar from '../components/Avatar.jsx';

function ReadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }

    const foundPost = getPostById(id);

    if (!foundPost) {
      setNotFound(true);
      return;
    }

    setPost(foundPost);
  }, [id]);

  function handleEdit() {
    navigate(`/blog/${post.id}/edit`);
  }

  function handleDelete() {
    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    const result = deletePost(post.id, user);

    if (!result.success) {
      return;
    }

    navigate('/blogs', { replace: true });
  }

  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-4xl mb-4">🔍</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h1>
            <p className="text-gray-500 mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="inline-block px-5 py-2.5 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Back to Blogs
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (!post) {
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

  const canEdit = canEditPost(post, user);
  const authorRole = user && post.authorId === 'admin' ? 'admin' : 'viewer';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6">
            <Link
              to="/blogs"
              className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              ← Back to Blogs
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {post.title}
              </h1>
              {canEdit && (
                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                  <button
                    onClick={handleEdit}
                    className="p-2 rounded-md text-gray-400 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                    title="Edit post"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete post"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-gray-100">
              <Avatar role={authorRole} size="lg" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {post.authorName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(post.createdAt)}
                  {post.updatedAt && post.updatedAt !== post.createdAt && (
                    <span> · Updated {formatDate(post.updatedAt)}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ReadPage;