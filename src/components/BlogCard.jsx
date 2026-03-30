import React from 'react';
import { useNavigate } from 'react-router-dom';
import { canEditPost } from '../utils/blogManager.js';
import Avatar from './Avatar.jsx';

function BlogCard({ post, session }) {
  const navigate = useNavigate();

  const canEdit = canEditPost(post, session);

  function handleClick() {
    navigate(`/blog/${post.id}`);
  }

  function handleEditClick(e) {
    e.stopPropagation();
    navigate(`/blog/${post.id}/edit`);
  }

  function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength).trimEnd() + '…';
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

  const authorRole = session && post.authorId === 'admin' ? 'admin' : 'viewer';

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 leading-snug">
            {truncateText(post.title, 60)}
          </h3>
          {canEdit && (
            <button
              onClick={handleEditClick}
              className="ml-2 flex-shrink-0 p-1.5 rounded-md text-gray-400 hover:text-purple-700 hover:bg-purple-50 transition-colors"
              title="Edit post"
            >
              ✏️
            </button>
          )}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-4">
          {truncateText(post.content, 150)}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Avatar role={authorRole} size="sm" />
            <span className="text-sm font-medium text-gray-700">
              {post.authorName}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {formatDate(post.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;