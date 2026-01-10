import React, { useState } from 'react';
import Logo from '../../../components/Logo';

const Sidebar = ({ 
  user, 
  navItems, 
  activeNav, 
  onNavClick, 
  onLogout,
  sidebarOpen = true 
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <aside className="h-screen bg-slate-900 text-white flex flex-col shadow-xl">
      {/* Logo Section - Top aligned */}
      <div className="pt-4 px-4 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center space-x-3 py-3">
          <Logo size="small" invert={true} />
          <div>
            <h1 className="font-bold text-lg">UdhyogSaathi</h1>
            <p className="text-slate-400 text-xs">Business Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation - Takes remaining space */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => onNavClick(item.path)}
                className={`
                  w-full flex items-center space-x-8 px-8 py-2.5 rounded-lg
                  transition-all duration-200
                  ${activeNav === item.path
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
                {item.path === 'kacha-bills' && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    3
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile and Logout Section at Bottom */}
      <div className="border-t border-slate-700 px-3 py-4 flex-shrink-0">
        {/* Profile Section with Hover Dropdown */}
        <div className="relative mb-3">
          <div 
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center font-bold text-sm">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-xs truncate">{user.name}</h2>
              <p className="text-slate-400 text-xs truncate">{user.businessName}</p>
            </div>
            <svg 
              className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div 
              className="absolute bottom-full left-0 right-0 mb-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50"
              onMouseEnter={() => setShowProfileMenu(true)}
              onMouseLeave={() => setShowProfileMenu(false)}
            >
              <button
                onClick={() => {
                  console.log('Navigate to profile');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-slate-700 transition-colors text-sm"
              >
                <span className="text-sm">👤</span>
                <span className="font-medium">My Profile</span>
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-slate-700 transition-colors border-t border-slate-700 text-sm"
              >
                <span className="text-sm">🚪</span>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Version Info */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-700">
          Version 1.0.0
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;