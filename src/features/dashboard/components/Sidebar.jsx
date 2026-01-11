import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ user, navItems, activeNav, onNavClick, onLogout, sidebarOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [billsMenuOpen, setBillsMenuOpen] = useState(false);

  const isBillsActive = activeNav === '/bills/kacha' || 
                      activeNav === '/bills/pakka' || 
                      activeNav === '/bills/all';

  const handleBillsClick = () => {
    setBillsMenuOpen(!billsMenuOpen);
  };

  const handleBillsSubmenuClick = (path) => {
    setBillsMenuOpen(false);
    onNavClick(path);
  };

  return (
    <div className={`
      bg-slate-900 text-white h-full
      flex flex-col
      overflow-y-auto
      transition-all duration-300
      ${sidebarOpen ? 'w-64' : 'w-20 lg:w-20'}
    `}>
      {/* Logo/Brand */}
      <div className="p-4 border-b border-slate-800">
        <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold">U</span>
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">UdhyogSaathi</h2>
              <p className="text-slate-400 text-xs truncate">Business Suite</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item, index) => {
          // Check if this is the Bills item
          if (item.label === 'Bills') {
            return (
              <div key={index} className="relative">
                <button
                  onClick={handleBillsClick}
                  className={`
                    w-full flex items-center rounded-lg
                    transition-all duration-200
                    ${isBillsActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'hover:bg-slate-800 text-slate-300'
                    }
                    ${sidebarOpen ? 'px-4 py-3 space-x-3' : 'px-3 py-3 justify-center'}
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && (
                    <>
                      <span className="font-medium text-sm">{item.label}</span>
                      <svg 
                        className={`w-4 h-4 ml-auto transition-transform duration-200 ${billsMenuOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                  {sidebarOpen && isBillsActive && (
                    <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                  )}
                </button>

                {/* Bills Submenu */}
                {sidebarOpen && billsMenuOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    <button
                      onClick={() => handleBillsSubmenuClick('/bills/kacha')}
                      className={`
                        w-full flex items-center px-4 py-2 rounded-lg
                        transition-all duration-200 text-sm
                        ${activeNav === '/bills/kacha'
                          ? 'bg-blue-700 text-white'
                          : 'hover:bg-slate-800 text-slate-300'
                        }
                      `}
                    >
                      <span className="mr-2">•</span>
                      Kacha Bills
                    </button>
                    <button
                      onClick={() => handleBillsSubmenuClick('/bills/pakka')}
                      className={`
                        w-full flex items-center px-4 py-2 rounded-lg
                        transition-all duration-200 text-sm
                        ${activeNav === '/bills/pakka'
                          ? 'bg-blue-700 text-white'
                          : 'hover:bg-slate-800 text-slate-300'
                        }
                      `}
                    >
                      <span className="mr-2">•</span>
                      Pakka Bills
                    </button>
                    <button
                      onClick={() => handleBillsSubmenuClick('/bills/all')}
                      className={`
                        w-full flex items-center px-4 py-2 rounded-lg
                        transition-all duration-200 text-sm
                        ${activeNav === '/bills/all'
                          ? 'bg-blue-700 text-white'
                          : 'hover:bg-slate-800 text-slate-300'
                        }
                      `}
                    >
                      <span className="mr-2">•</span>
                      All Bills
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // Regular menu items
          return (
            <button
              key={index}
              onClick={() => onNavClick(item.path)}
              className={`
                w-full flex items-center rounded-lg
                transition-all duration-200
                ${activeNav === item.path 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'hover:bg-slate-800 text-slate-300'
                }
                ${sidebarOpen ? 'px-4 py-3 space-x-3' : 'px-3 py-3 justify-center'}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
              {sidebarOpen && activeNav === item.path && (
                <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile Section - Moved to bottom */}
      <div className="p-4 border-t border-slate-800">
        <div 
          className="relative"
          onMouseEnter={() => setShowProfileMenu(true)}
          onMouseLeave={() => setShowProfileMenu(false)}
        >
          {/* Profile Button */}
          <button
            className={`
              w-full flex items-center rounded-lg
              transition-all duration-200
              hover:bg-slate-800 text-slate-300
              ${sidebarOpen ? 'px-4 py-3 space-x-3' : 'px-3 py-3 justify-center'}
            `}
          >
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 text-left">
                <p className="font-semibold text-sm truncate">{user?.name || 'User'}</p>
                <p className="text-slate-400 text-xs truncate">{user?.email || 'user@example.com'}</p>
              </div>
            )}
            {sidebarOpen && (
              <svg 
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>

          {/* Profile Dropdown Menu - Shows on hover */}
          {sidebarOpen && showProfileMenu && (
            <div className="absolute bottom-full left-0 right-0 bg-slate-800 rounded-lg shadow-lg overflow-hidden z-50">
              <Link
                to="/profile"
                className="w-full flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 transition-colors duration-200"
              >
                <span className="mr-3">👤</span>
                Profile
              </Link>
              <button 
                onClick={onLogout}
                className="w-full flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-red-600 transition-colors duration-200"
              >
                <span className="mr-3">🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Version Info */}
        {sidebarOpen && (
          <div className="mt-4 text-center text-slate-500 text-xs">
            <p>v1.0.0 • UdhyogSaathi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;