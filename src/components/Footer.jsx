import React from 'react';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-purple-700">✍️ WriteSpace</span>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-purple-700 transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-purple-700 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-purple-700 transition-colors"
            >
              Terms
            </a>
          </div>

          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;