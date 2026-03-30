import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth.js';
import { getAllPosts, deletePost } from '../utils/blogManager.js';
import { getAllUsers } from '../utils/userManager.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import StatCard from '../components/StatCard.jsx';
import Avatar from '../components/Avatar.jsx';

function AdminDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setPosts(getAllPosts());
    setUsers(getAllUsers());
  }, []);

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const viewerCount = users.filter((u) => u.role === 'viewer').length;

  const recentPosts = posts.slice(0, 5);

  function handleDeletePost(postId) {
    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    const result = deletePost(postId, user);

    if (!result.success) {
      return;
    }

    setPosts(getAllPosts());
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

  function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength).trimEnd() + '…';
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {user ? user.displayName : 'Admin'}. Here's an overview of your platform.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              label="Total Posts"
              value={totalPosts}
              icon="📝"
              color="purple"
            />
            <StatCard
              label="Total Users"
              value={totalUsers}
              icon="👥"
              color="blue"
            />
            <StatCard
              label="Admins"
              value={adminCount}
              icon="👑"
              color="orange"
            />
            <StatCard
              label="Viewers"
              value={viewerCount}
              icon="📖"
              color="green"
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/blogs/new"
                className="px-5 py-2.5 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                ✍️ Write New Post
              </Link>
              <Link
                to="/users"
                className="px-5 py-2.5 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                👥 Manage Users
              </Link>
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
              <Link
                to="/blogs"
                className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                View All →
              </Link>
            </div>

            {recentPosts.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {recentPosts.map((post) => {
                    const authorRole = post.authorId === 'admin' ? 'admin' : 'viewer';

                    return (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <Avatar role={authorRole} size="sm" />
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/blog/${post.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-purple-700 transition-colors"
                            >
                              {truncateText(post.title, 60)}
                            </Link>
                            <p className="text-xs text-gray-500 mt-0.5">
                              by {post.authorName} · {formatDate(post.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                          <button
                            onClick={() => navigate(`/blog/${post.id}/edit`)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                            title="Edit post"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete post"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
                <p className="text-4xl mb-4">📝</p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Get started by writing your first post.
                </p>
                <Link
                  to="/blogs/new"
                  className="inline-block px-5 py-2.5 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  Write Your First Post
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;