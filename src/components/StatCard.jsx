import React from 'react';

function StatCard({ label, value, icon, color = 'purple' }) {
  const colorClasses = {
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  const iconBgClasses = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  const resolvedColor = colorClasses[color] || colorClasses.purple;
  const resolvedIconBg = iconBgClasses[color] || iconBgClasses.purple;

  return (
    <div className={`rounded-lg border p-5 ${resolvedColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="mt-1 text-3xl font-bold">{value}</p>
        </div>
        {icon && (
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full text-xl ${resolvedIconBg}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;