import React from 'react';

const QuickActions = ({ activeSection, onSectionChange }) => {
  const actions = [
    { id: 'company', label: 'Company Details', icon: '🏢', description: 'Business information' },
    { id: 'personal', label: 'Personal Info', icon: '👤', description: 'Your account details' },
    { id: 'password', label: 'Password', icon: '🔒', description: 'Change password' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️', description: 'App settings', disabled: true },
    { id: 'notifications', label: 'Notifications', icon: '🔔', description: 'Alert settings', disabled: true },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => !action.disabled && onSectionChange(action.id)}
            disabled={action.disabled}
            className={`
              w-full flex items-center p-3 rounded-lg transition-all duration-200
              ${activeSection === action.id
                ? 'bg-blue-50 border border-blue-200'
                : 'hover:bg-gray-50 border border-gray-100'
              }
              ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="text-xl mr-3">{action.icon}</span>
            <div className="text-left flex-1">
              <p className="font-medium text-gray-900">{action.label}</p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
            {activeSection === action.id && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
            {action.disabled && (
              <span className="text-xs text-gray-400 ml-2">Coming Soon</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;