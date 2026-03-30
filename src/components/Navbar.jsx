import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from '../utils/auth.js';
import Avatar from './Avatar.jsx';

function Navbar() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to={user ? '/blogs' : '/'} className="flex items-center space-x-2">
              <span className="text-xl font-bold text-purple-700">✍️ WriteSpace</span>
            </Link>

            {user && (
              <div className="hidden sm:flex items-center space-x-4">
                <Link
                  to="/blogs"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/blogs')
                      ? 'text-purple-700 bg-purple-50'
                      : 'text-gray-600 hover:text-purple-700 hover:bg-gray-50'
                  }`}
                >
                  Blogs
                </Link>
                <Link
                  to="/blogs/new"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/blogs/new')
                      ? 'text-purple-700 bg-purple-50'
                      : 'text-gray-600 hover:text-purple-700 hover:bg-gray-50'
                  }`}
                >
                  Write
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/dashboard')
                          ? 'text-purple-700 bg-purple-50'
                          : 'text-gray-600 hover:text-purple-700 hover:bg-gray-50'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/users"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive('/users')
                          ? 'text-purple-700 bg-purple-50'
                          : 'text-gray-600 hover:text-purple-700 hover:bg-gray-50'
                      }`}
                    >
                      Users
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Avatar role={user.role} size="sm" />
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    {user.displayName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;