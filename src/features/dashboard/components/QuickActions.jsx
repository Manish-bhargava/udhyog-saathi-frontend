import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ actions }) => {
  const navigate = useNavigate();

  const handleActionClick = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleActionClick(action.path)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <div className="flex items-center">
              <span className="text-xl mr-3 group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span className="font-medium text-gray-900">{action.label}</span>
            </div>
            <span className="text-gray-400 group-hover:text-gray-600">→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;