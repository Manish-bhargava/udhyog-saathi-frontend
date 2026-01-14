import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import OnboardingBanner from '../../auth/components/OnBoardingBanner';
import QuickTour from '../../auth/components/QuickTour';
import { NotificationProvider } from '../context/NotificationContext';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('/dashboard');
  const { user, logout, isNewUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveNav(location.pathname);
  }, [location]);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/bills/kacha', label: 'Bills', icon: '📝' },
    { path: '/ai-assistant', label: 'AI ASSISTANT', icon: '🤖' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleNavClick = (path) => {
    setActiveNav(path);
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/profile') return 'Profile';
    if (path === '/dashboard') return 'Dashboard';
    const navItem = navItems.find(item => item.path === path);
    return navItem?.label || 'Dashboard';
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Fixed reference to user.isOnboarded */}
        {isNewUser && !user.isOnboarded && <QuickTour />}

        <div className={`
          fixed top-0 left-0 right-0 z-30
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'lg:ml-64' : ''}
        `}>
          <Topbar title={getPageTitle()} />
        </div>

        <div className={`
          fixed left-0 top-0 h-screen z-40
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar
            user={user}
            navItems={navItems}
            activeNav={activeNav}
            onNavClick={handleNavClick}
            onLogout={handleLogout}
            sidebarOpen={sidebarOpen}
          />
        </div>

        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={handleToggleSidebar}
          />
        )}

        <button
          onClick={handleToggleSidebar}
          className={`
            fixed z-40 
            bg-slate-900 text-white 
            w-6 h-10 rounded-r-lg 
            shadow-lg hover:bg-slate-800 
            transition-all duration-300
            flex items-center justify-center
            hover:scale-105 transform -translate-y-1/2
            ${sidebarOpen ? 'top-1/2 left-64' : 'top-1/2 left-0'}
          `}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={sidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
          </svg>
        </button>

        <main className={`
          min-h-screen
          transition-all duration-300
          overflow-y-auto
          ${sidebarOpen ? 'lg:ml-64' : ''}
          pt-16
        `}>
          <div className="p-4 md:p-6">
            {!user.isOnboarded && <OnboardingBanner />}
            <Outlet />
          </div>
        </main>
      </div>
    </NotificationProvider>
  );
};

export default DashboardLayout;