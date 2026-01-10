import React from 'react';

const QuickActions = ({ actions }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">⚡</span>
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
              {action.icon}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {action.label}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-sm text-gray-500 mb-3">Recent Activity</p>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span>You logged in 2 hours ago</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span>3 new Kacha bills created today</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
            <span>2 pending payments need attention</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;