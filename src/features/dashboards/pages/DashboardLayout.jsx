import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { profileAPI } from '../../profiles/api';
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
  FaReceipt,
  FaFileAlt,
  FaFileContract
} from 'react-icons/fa';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [billsMenuOpen, setBillsMenuOpen] = useState(false);
  
  // State for user data to ensure name display is always correct
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});

  const location = useLocation();
  const navigate = useNavigate();
  const showBanner = user.onboarding === false;

  // Sync profile data whenever navigating to ensure name is correct
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchFreshUser = async () => {
      try {
        const res = await profileAPI.getProfile();
        if (res.success) {
          const d = res.data;
          const updatedUser = { 
            ...user, 
            name: d.name, 
            email: d.email, 
            onboarding: d.isOnboarded 
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } catch (err) {
        console.error("Failed to sync user data in layout:", err);
      }
    };

    fetchFreshUser();
  }, [location.pathname]);

  // Close sidebar by default on mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/bills/template', label: 'Bills', icon: <FaFileInvoiceDollar /> },
    { path: '/ai-assistant', label: 'AI Assistant', icon: <FaRobot /> },
    { path: '/reports', label: 'Reports', icon: <FaChartBar /> },
    { path: '/billing', label: 'Billing', icon: <FaRupeeSign /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  };

  const getPageTitle = () => {
    if (location.pathname === '/profile') return 'Profile';
    const item = navItems.find(i => location.pathname.startsWith(i.path.split('/template')[0]));
    return item?.label || 'Dashboard';
  };

  const handleBillsClick = () => {
    setBillsMenuOpen(!billsMenuOpen);
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col md:flex-row overflow-hidden">
      
      {/* MOBILE TOP NAVIGATION MENU */}
      <div className={`
        md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300
        ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `} onClick={() => setSidebarOpen(false)}>
        <div 
          className={`
            bg-slate-900 text-white w-full shadow-2xl transition-transform duration-300 ease-in-out p-6
            ${sidebarOpen ? 'translate-y-0' : '-translate-y-full'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold">U</div>
              <span className="font-bold uppercase tracking-tight">Udhyog Saathi</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400">
              <FaTimes size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <div key={item.path}>
                <button
                  onClick={() => {
                    if (item.label === 'Bills') handleBillsClick();
                    else {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center p-3 rounded-xl gap-3 ${location.pathname.includes(item.path.split('/template')[0]) ? 'bg-blue-600 text-white' : 'text-slate-300'}`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {item.label === 'Bills' && <span className="ml-auto">{billsMenuOpen ? <FaCaretDown /> : <FaCaretRight />}</span>}
                </button>
                {item.label === 'Bills' && billsMenuOpen && (
                  <div className="ml-8 mt-2 space-y-1">
                    <button onClick={() => { navigate('/bills/kacha'); setSidebarOpen(false); }} className="w-full text-left p-2 text-sm text-slate-400">Kacha Bills</button>
                    <button onClick={() => { navigate('/bills/pakka'); setSidebarOpen(false); }} className="w-full text-left p-2 text-sm text-slate-400">Pakka Bills</button>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.name}</p>
                <p className="text-slate-500 text-xs truncate">{user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { navigate('/profile'); setSidebarOpen(false); }} className="flex items-center justify-center gap-2 p-3 bg-slate-800 rounded-xl text-sm"><FaUser /> Profile</button>
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 p-3 bg-red-600/20 text-red-500 rounded-xl text-sm"><FaSignOutAlt /> Logout</button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className={`
        hidden md:flex bg-gradient-to-b from-slate-900 to-slate-800 text-white 
        transition-all duration-300 ease-in-out flex-col shrink-0 h-screen sticky top-0 z-40
        ${sidebarOpen ? 'w-64' : 'w-20'}
      `}>
        <div className="flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            {sidebarOpen ? (
              <>
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold shadow-lg">U</div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold uppercase tracking-tight">Udhyog Saathi</h2>
                    <p className="text-slate-400 text-[10px]">Business Suite</p>
                  </div>
                </div>
                {/* Internal Sidebar Toggle */}
                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-700 rounded-lg"><FaChevronLeft /></button>
              </>
            ) : (
              /* Internal Sidebar Toggle (Collapsed State) */
              <button onClick={() => setSidebarOpen(true)} className="mx-auto p-2 hover:bg-slate-700 rounded-lg"><FaBars /></button>
            )}
          </div>

          <nav className="flex-1 px-2 py-6 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.path}>
                <button
                  onClick={() => item.label === 'Bills' ? handleBillsClick() : navigate(item.path)}
                  className={`
                    w-full flex items-center rounded-xl duration-200 p-3.5
                    ${location.pathname.startsWith(item.path.split('/template')[0]) ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30' : 'text-slate-300 hover:bg-slate-800/50'}
                    ${sidebarOpen ? 'space-x-3' : 'justify-center'}
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                </button>
                {sidebarOpen && item.label === 'Bills' && billsMenuOpen && (
                  <div className="ml-10 mt-2 space-y-1 border-l border-slate-700 pl-4">
                    <button onClick={() => navigate('/bills/kacha')} className="w-full text-left py-2 text-xs text-slate-400 hover:text-white">Kacha Bills</button>
                    <button onClick={() => navigate('/bills/pakka')} className="w-full text-left py-2 text-xs text-slate-400 hover:text-white">Pakka Bills</button>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-700/50 relative">
            <button onMouseEnter={() => setShowProfileMenu(true)} className={`w-full flex items-center rounded-xl hover:bg-slate-800/50 p-2 ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold shrink-0 shadow-md">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-xs truncate">{user.name}</p>
                  <p className="text-slate-400 text-[10px] truncate">{user.email}</p>
                </div>
              )}
            </button>
            {showProfileMenu && sidebarOpen && (
              <div onMouseLeave={() => setShowProfileMenu(false)} className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50">
                <Link to="/profile" className="flex items-center px-4 py-3 text-xs text-slate-300 hover:bg-slate-700 gap-3"><FaUser /> Profile</Link>
                <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-xs text-slate-300 hover:bg-red-600 gap-3"><FaSignOutAlt /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${sidebarOpen && window.innerWidth < 768 ? 'blur-md brightness-75' : ''}`}>
        
        <header className="h-16 md:h-20 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-4">
            {/* MOBILE ONLY TOGGLE */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <FaBars size={20} />
            </button>

            {/* REMOVED: Redundant desktop toggle button from top bar */}
            
            <h1 className="text-lg md:text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          {showBanner && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl md:rounded-2xl p-4 md:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-xl"><FaExclamationTriangle className="text-amber-600 text-xl" /></div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base">Complete Your Profile</h3>
                  <p className="text-xs md:text-sm text-gray-600">Finish onboarding to unlock all features.</p>
                </div>
              </div>
              <button onClick={() => navigate('/profile')} className="w-full sm:w-auto bg-orange-500 text-white px-6 py-2 rounded-xl font-bold text-sm">Finish</button>
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