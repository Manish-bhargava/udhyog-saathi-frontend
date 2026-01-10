import React from 'react';

const QuickActions = ({ actions }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
        <span className="mr-2">⚡</span>
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <span className="text-xl mb-1 group-hover:scale-110 transition-transform">
              {action.icon}
            </span>
            <span className="text-xs font-medium text-gray-700">
              {action.label}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-5 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-2">Recent Activity</p>
        <div className="space-y-2">
          <div className="flex items-center text-xs">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
            <span>You logged in 2 hours ago</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
            <span>3 new Kacha bills created today</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
            <span>2 pending payments need attention</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;