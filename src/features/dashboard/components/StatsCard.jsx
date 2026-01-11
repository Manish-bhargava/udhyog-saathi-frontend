import React from 'react';

const StatsCard = ({ stat }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
        </div>
        <div className="text-2xl">{stat.icon}</div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${
          stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
        }`}>
          {stat.change}
        </span>
        <span className="text-gray-500 text-sm ml-2">from last month</span>
      </div>
    </div>
  );
};

export default StatsCard;