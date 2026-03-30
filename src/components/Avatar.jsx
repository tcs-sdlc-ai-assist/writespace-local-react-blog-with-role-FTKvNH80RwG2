import React from 'react';

function Avatar({ role, size = 'md' }) {
  const isAdmin = role === 'admin';
  const emoji = isAdmin ? '👑' : '📖';

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
    xl: 'w-12 h-12 text-lg',
  };

  const bgClass = isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700';
  const resolvedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${bgClass} ${resolvedSize}`}
      title={isAdmin ? 'Admin' : 'Viewer'}
    >
      {emoji}
    </span>
  );
}

export default Avatar;