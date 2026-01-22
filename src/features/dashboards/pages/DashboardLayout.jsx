import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaFileInvoiceDollar, 
  FaRobot, 
  FaChartBar, 
  FaRupeeSign,
  FaChevronLeft,
  FaBars,
  FaUser,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaCaretDown,
  FaCaretRight,
  FaTimes,
  FaUserCircle,
  FaCog,
  FaReceipt,
  FaFileAlt,
  FaFileContract
} from 'react-icons/fa';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [billsMenuOpen, setBillsMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const showBanner = user.onboarding === false;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, [location, navigate]);

  // Close bills menu when sidebar closes
  useEffect(() => {
    if (!sidebarOpen) {
      setBillsMenuOpen(false);
    }
  }, [sidebarOpen]);

  if (!localStorage.getItem('token')) return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt className="text-lg" /> },
    { path: '/bills/template', label: 'Bills', icon: <FaFileInvoiceDollar className="text-lg" /> },
    { path: '/ai-assistant', label: 'AI Assistant', icon: <FaRobot className="text-lg" /> },
    { path: '/reports', label: 'Reports', icon: <FaChartBar className="text-lg" /> },
    { path: '/billing', label: 'Billing', icon: <FaRupeeSign className="text-lg" /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const getPageTitle = () => {
    if (location.pathname === '/profile') return 'Profile';
    const item = navItems.find(i => location.pathname.startsWith(i.path.split('/template')[0]));
    return item?.label || 'Dashboard';
  };

  // Handle Bills button click
  const handleBillsClick = () => {
    if (!sidebarOpen) {
      // If sidebar is closed, open it first
      setSidebarOpen(true);
      // Set a flag to open bills menu after sidebar animation completes
      setTimeout(() => {
        setBillsMenuOpen(true);
      }, 300); // Match this with your sidebar transition duration
    } else {
      // If sidebar is already open, toggle the bills menu
      setBillsMenuOpen(!billsMenuOpen);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex overflow-hidden">
      
      {/* FIXED SIDEBAR WITH SMOOTH TRANSITION */}
      <aside className={`
        bg-gradient-to-b from-slate-900 to-slate-800 text-white 
        transition-all duration-300 ease-in-out flex flex-col shrink-0
        h-screen sticky top-0 z-40
        ${sidebarOpen ? 'w-64' : 'w-2 overflow-hidden'}
      `}>
        {/* Always render inner container but hide content when sidebar closed */}
        <div className="w-64 flex flex-col h-full">
          <div className={`p-3 border-b border-slate-700/50 shrink-0 ${!sidebarOpen ? 'opacity-0' : 'opacity-100 transition-opacity duration-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                  <span className="text-xl font-bold">U</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-l font-bold tracking-tight uppercase">Udhyog Saathi</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Business Suite</p>
                </div>
              </div>
              {sidebarOpen && (
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <FaChevronLeft className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <nav className="flex-1 px-2 py-6 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.path}>
                <button
                  onClick={() => {
                    if (item.label === 'Bills') {
                      handleBillsClick();
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`
                    w-full flex items-center rounded-xl  duration-200
                    ${location.pathname.startsWith(item.path.split('/template')[0]) 
                      ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30 shadow-sm' 
                      : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'
                    }
                    ${sidebarOpen ? 'px-4 py-3.5 space-x-3' : 'px-3 py-3.5 justify-center'}
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                  {sidebarOpen && item.label === 'Bills' && (
                    <span className="ml-auto">
                      {billsMenuOpen ? <FaCaretDown /> : <FaCaretRight />}
                    </span>
                  )}
                </button>
                
                {sidebarOpen && item.label === 'Bills' && billsMenuOpen && (
                  <div className="ml-10 mt-2 space-y-1.5">
                    <button 
                      onClick={() => navigate('/bills/kacha')}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-all rounded-lg flex items-center gap-2 ${
                        location.pathname === '/bills/kacha' 
                          ? 'text-white font-semibold bg-slate-700/50' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                      }`}
                    >
                      <FaReceipt className="text-xs" /> Kacha Bills
                    </button>
                    <button 
                      onClick={() => navigate('/bills/pakka')}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-all rounded-lg flex items-center gap-2 ${
                        location.pathname === '/bills/pakka' 
                          ? 'text-white font-semibold bg-slate-700/50' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                      }`}
                    >
                      <FaFileContract className="text-xs" /> Pakka Bills
                    </button>
                    <button 
                      onClick={() => navigate('/bills/template')}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-all rounded-lg flex items-center gap-2 ${
                        location.pathname === '/bills/template' 
                          ? 'text-white font-semibold bg-slate-700/50' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                      }`}
                    >
                      <FaFileAlt className="text-xs" /> Bill Templates
                    </button>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-700/50 shrink-0 relative">
            <button
              onMouseEnter={() => setShowProfileMenu(true)}
              className={`
                w-full flex items-center rounded-xl hover:bg-slate-800/50 transition-all
                ${sidebarOpen ? 'p-3 space-x-3' : 'p-3 justify-center'}
              `}
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold shrink-0 shadow-md">
                {user.name?.charAt(0).toUpperCase() || <FaUserCircle className="text-xl" />}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-slate-400 text-xs truncate">{user.email}</p>
                </div>
              )}
            </button>

            {showProfileMenu && sidebarOpen && (
              <div 
                onMouseLeave={() => setShowProfileMenu(false)}
                className="absolute bottom-full left-4 right-4 mb-3 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50"
              >
                <Link to="/profile" className="w-full flex items-center px-4 py-3.5 text-sm text-slate-300 hover:bg-slate-700/80 transition-colors gap-3">
                  <FaUser /> Profile Settings
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center px-4 py-3.5 text-sm text-slate-300 hover:bg-red-600/80 transition-colors gap-3">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA: Independent scrolling */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER: Shrink-0 ensures it doesn't get squashed */}
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FaBars className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          </div>
        </header>

        {/* SCROLLABLE CANVAS: This is the only area that should scroll */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {showBanner && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-xl">
                  <FaExclamationTriangle className="text-amber-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Complete Your Profile</h3>
                  <p className="text-sm text-gray-600">Finish onboarding to unlock all features.</p>
                </div>
              </div>
              <button onClick={() => navigate('/profile')} className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold">Finish</button>
            </div>
          )}

          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;