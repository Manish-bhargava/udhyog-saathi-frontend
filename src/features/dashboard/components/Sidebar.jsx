import React from 'react';
import Logo from '../../../components/Logo';

const Sidebar = ({ 
  user, 
  navItems, 
  activeNav, 
  onNavClick, 
  onLogout,
  sidebarOpen = true 
}) => {
  return (
    <aside className={`
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0
      fixed lg:static
      inset-y-0 left-0
      z-40
      w-64
      bg-slate-900
      text-white
      transition-transform duration-300 ease-in-out
      flex flex-col
      shadow-xl
    `}>
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Logo size="small" invert={true} />
          <div>
            <h1 className="font-bold text-xl">UdhyogSaathi</h1>
            <p className="text-slate-400 text-xs">Business Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center font-bold text-lg">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{user.name}</h2>
            <p className="text-slate-400 text-sm truncate">{user.businessName}</p>
            <p className="text-slate-500 text-xs">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => onNavClick(item.path)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${activeNav === item.path
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {item.path === 'kacha-bills' && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    3
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <span>🚪</span>
          <span className="font-medium">Logout</span>
        </button>
        <div className="mt-4 text-center text-xs text-slate-500">
          Version 1.0.0
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;