import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth.js';
import { getAllPosts } from '../utils/blogManager.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import BlogCard from '../components/BlogCard.jsx';

function BlogListPage() {
  const user = getCurrentUser();
  const posts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
              <p className="mt-1 text-sm text-gray-600">
                Explore the latest posts from the community.
              </p>
            </div>
            <Link
              to="/blogs/new"
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              ✍️ Write Post
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} session={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">📝</p>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No posts yet
              </h2>
              <p className="text-gray-500 mb-6">
                Be the first to share something with the community!
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
      </main>

      <Footer />
    </div>
  );
}

export default BlogListPage;