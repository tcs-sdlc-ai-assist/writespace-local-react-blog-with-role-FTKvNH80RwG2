import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth.js';
import { getAllPosts } from '../utils/blogManager.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import BlogCard from '../components/BlogCard.jsx';

function LandingPage() {
  const user = getCurrentUser();
  const allPosts = getAllPosts();
  const latestPosts = allPosts.slice(0, 3);

  const features = [
    {
      icon: '✍️',
      title: 'Write & Publish',
      description: 'Create beautiful blog posts with an intuitive editor. Share your thoughts with the world in seconds.',
    },
    {
      icon: '🔒',
      title: 'Role-Based Access',
      description: 'Admins manage users and all content. Viewers can write and manage their own posts with full control.',
    },
    {
      icon: '⚡',
      title: 'Privacy First',
      description: 'All data stays in your browser. No servers, no tracking, no external dependencies. Your content, your control.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 text-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Your Space to Write
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
                A modern, privacy-focused blogging platform. Write, publish, and manage your content — all from your browser.
              </p>
              <div className="mt-10 flex items-center justify-center space-x-4">
                {user ? (
                  <Link
                    to="/blogs"
                    className="px-6 py-3 rounded-md text-base font-medium text-purple-700 bg-white hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    Go to Blogs
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="px-6 py-3 rounded-md text-base font-medium text-purple-700 bg-white hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="px-6 py-3 rounded-md text-base font-medium text-white border border-white/30 hover:bg-white/10 transition-colors"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Everything You Need
              </h2>
              <p className="mt-3 text-lg text-gray-600 max-w-xl mx-auto">
                Simple, powerful, and private. WriteSpace gives you the tools to blog without the bloat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-purple-100 text-2xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Posts Section */}
        <section className="py-16 sm:py-20 bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Latest Posts
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                See what people are writing about on WriteSpace.
              </p>
            </div>

            {latestPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestPosts.map((post) => (
                  <BlogCard key={post.id} post={post} session={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500 mb-2">📝</p>
                <p className="text-gray-500">
                  No posts yet. Be the first to write something!
                </p>
                {!user && (
                  <Link
                    to="/register"
                    className="inline-block mt-4 px-5 py-2.5 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default LandingPage;