// import React, { useState, useEffect, useRef } from 'react';
// import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';

// const DashboardLayout = () => {
//   // --- 1. STATE & ROUTING ---
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeNav, setActiveNav] = useState('/dashboard');
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [billsMenuOpen, setBillsMenuOpen] = useState(false);
//   const notificationRef = useRef(null);

//   const location = useLocation();
//   const navigate = useNavigate();

//   // --- 2. DATA FROM LOCAL STORAGE (v1 Logic) ---
//   const user = JSON.parse(localStorage.getItem('user')) || {};
//   // The single 'onboarding' flag determines the banner visibility
//   const showBanner = user.onboarding === false;

//   // AUTH GUARD: Check for token on every navigation
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       window.location.href = '/login'; // Force hard redirect to login
//     }
//     setActiveNav(location.pathname);
//   }, [location, navigate]);

//   // PREVENT FLASH: Do not render anything if token is missing
//   if (!localStorage.getItem('token')) return null;

//   // --- 3. NAVIGATION CONFIG ---
//   // Updated base path to singular /bill to match App.jsx routing
//   const navItems = [
//     { path: '/dashboard', label: 'Dashboard', icon: '📊' },
//     { path: '/bill/all', label: 'Bills', icon: '📄' },
//     { path: '/ai-assistant', label: 'AI Assistant', icon: '🤖' },
//     { path: '/reports', label: 'Reports', icon: '📈' },
//     { path: '/settings', label: 'Settings', icon: '⚙️' },
//   ];

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/login';
//   };

//   const getPageTitle = () => {
//     if (location.pathname === '/profile') return 'Profile';
//     // Match based on path segments to handle /bill/pakka as "Bills"
//     const item = navItems.find(i => location.pathname.startsWith(i.path.split('/all')[0]));
//     return item?.label || 'Dashboard';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      
//       {/* --- SIDEBAR --- */}
//       <aside className={`
//         fixed inset-y-0 left-0 z-40 bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col
//         ${sidebarOpen ? 'w-64' : 'w-20'}
//       `}>
//         {/* Logo Section */}
//         <div className="p-4 border-b border-slate-800 shrink-0">
//           <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
//             <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
//               <span className="text-xl font-bold">U</span>
//             </div>
//             {sidebarOpen && (
//               <div className="flex-1 min-w-0">
//                 <h2 className="text-xl font-bold truncate">UdhyogSaathi</h2>
//                 <p className="text-slate-400 text-xs truncate">Business Suite</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
//           {navItems.map((item) => (
//             <div key={item.path}>
//               <button
//                 onClick={() => {
//                   if (item.label === 'Bills') setBillsMenuOpen(!billsMenuOpen);
//                   else navigate(item.path);
//                 }}
//                 className={`
//                   w-full flex items-center rounded-lg transition-all duration-200
//                   ${location.pathname.startsWith(item.path.split('/all')[0]) ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-300'}
//                   ${sidebarOpen ? 'px-4 py-3 space-x-3' : 'px-3 py-3 justify-center'}
//                 `}
//               >
//                 <span className="text-xl">{item.icon}</span>
//                 {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
//               </button>
              
//               {/* Bills Submenu - Fixed to use singular /bill/ routes */}
//               {item.label === 'Bills' && billsMenuOpen && sidebarOpen && (
//                 <div className="ml-8 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
//                   {['Kacha', 'Pakka', 'All'].map(sub => (
//                     <button 
//                       key={sub}
//                       onClick={() => navigate(`/bill/${sub.toLowerCase()}`)}
//                       className={`w-full text-left px-4 py-2 text-sm transition-colors ${
//                         location.pathname === `/bill/${sub.toLowerCase()}` 
//                           ? 'text-white font-bold' 
//                           : 'text-slate-400 hover:text-white'
//                       }`}
//                     >
//                       • {sub} Bills
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </nav>

//         {/* Profile Section */}
//         <div className="p-4 border-t border-slate-800 shrink-0 relative">
//           <button
//             onMouseEnter={() => setShowProfileMenu(true)}
//             className={`
//               w-full flex items-center rounded-lg hover:bg-slate-800 transition-all p-2
//               ${sidebarOpen ? 'space-x-3' : 'justify-center'}
//             `}
//           >
//             <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold shrink-0">
//               {user.name?.charAt(0).toUpperCase()}
//             </div>
//             {sidebarOpen && (
//               <div className="flex-1 min-w-0 text-left">
//                 <p className="font-semibold text-sm truncate">{user.name}</p>
//                 <p className="text-slate-400 text-xs truncate">{user.email}</p>
//               </div>
//             )}
//           </button>

//           {showProfileMenu && (
//             <div 
//               onMouseLeave={() => setShowProfileMenu(false)}
//               className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden z-50"
//             >
//               <Link to="/profile" className="w-full flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 transition-colors">
//                 <span className="mr-3">👤</span> Profile
//               </Link>
//               <button 
//                 onClick={handleLogout}
//                 className="w-full flex items-center px-4 py-3 text-sm text-slate-300 hover:bg-red-600 transition-colors"
//               >
//                 <span className="mr-3">🚪</span> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* --- CONTENT CANVAS --- */}
//       <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
//         {/* TOPBAR */}
//         <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30">
//           <div className="flex items-center space-x-4">
//             <button 
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <h1 className="text-xl font-bold text-gray-900">{getPageTitle()}</h1>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="relative hidden md:block">
//               <input
//                 type="text"
//                 placeholder="Search resources..."
//                 className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm outline-none"
//               />
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
//             </div>

//             <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg relative">
//               <span className="text-xl">🔔</span>
//               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
//             </button>
//             <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
//               <span className="text-xl">💬</span>
//             </button>
//           </div>
//         </header>

//         {/* MAIN AREA */}
//         <main className="flex-1 overflow-y-auto p-6 md:p-8">
          
//           {/* ONBOARDING BANNER */}
//           {showBanner && (
//             <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-5 mb-8 shadow-sm flex items-center justify-between">
//               <div className="flex items-start space-x-4">
//                 <div className="bg-yellow-100 p-3 rounded-xl">
//                   <span className="text-yellow-600 text-xl">ℹ️</span>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-gray-900 text-lg">Complete Your Profile</h3>
//                   <p className="text-sm text-gray-600 mt-1 max-w-lg">
//                     Finish your onboarding to unlock automated billing, tax reports, and your business profile.
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => navigate('/profile')}
//                 className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all whitespace-nowrap active:scale-95"
//               >
//                 Complete Onboarding
//               </button>
//             </div>
//           )}

//           {/* DYNAMIC CONTENT CANVAS */}
//           <div className="animate-in fade-in duration-500">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;


// import React, { useState, useEffect, useRef } from 'react';
// import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';

// const DashboardLayout = () => {
//   // Initialized to true, but sidebar will now take 0px when false
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeNav, setActiveNav] = useState('/dashboard');
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [billsMenuOpen, setBillsMenuOpen] = useState(false);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem('user')) || {};
//   const showBanner = user.onboarding === false;

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       window.location.href = '/login';
//     }
//     setActiveNav(location.pathname);
//   }, [location, navigate]);

//   if (!localStorage.getItem('token')) return null;

//   const navItems = [
//     { path: '/dashboard', label: 'Dashboard', icon: '📊' },
//     { path: '/bills/all', label: 'Bills', icon: '📄' },
//     { path: '/ai-assistant', label: 'AI Assistant', icon: '🤖' },
//     { path: '/reports', label: 'Reports', icon: '📈' },
//     { path: '/settings', label: 'Settings', icon: '⚙️' },
//   ];

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/login';
//   };

//   const getPageTitle = () => {
//     if (location.pathname === '/profile') return 'Profile';
//     const item = navItems.find(i => location.pathname.startsWith(i.path.split('/all')[0]));
//     return item?.label || 'Dashboard';
//   };

//   return (
//     // overflow-x-hidden prevents scrollbars during the width transition
//     <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      
//       {/* SIDEBAR: Removed 'fixed', using dynamic width and overflow-hidden */}
//       <aside className={`
//         bg-gradient-to-b from-slate-900 to-slate-800 text-white 
//         transition-all duration-300 ease-in-out flex flex-col shrink-0
//         h-screen sticky top-0 z-40
//         ${sidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'}
//       `}>
//         {/* Min-width wrapper ensures content doesn't "squish" during animation */}
//         <div className="w-64 flex flex-col h-full">
//           <div className="p-6 border-b border-slate-700/50 shrink-0">
//             <div className="flex items-center space-x-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
//                 <span className="text-xl font-bold">U</span>
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h2 className="text-xl font-bold tracking-tight uppercase">Udhyog</h2>
//                 <p className="text-slate-400 text-xs mt-0.5">Business Suite</p>
//               </div>
//             </div>
//           </div>

//           <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
//             {navItems.map((item) => (
//               <div key={item.path}>
//                 <button
//                   onClick={() => {
//                     if (item.label === 'Bills') setBillsMenuOpen(!billsMenuOpen);
//                     else navigate(item.path);
//                   }}
//                   className={`
//                     w-full flex items-center px-4 py-3.5 space-x-3 rounded-xl transition-all duration-200 group
//                     ${location.pathname.startsWith(item.path.split('/all')[0]) 
//                       ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-100 border border-blue-500/30 shadow-lg' 
//                       : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'
//                     }
//                   `}
//                 >
//                   <span className="text-xl transition-transform group-hover:scale-110">{item.icon}</span>
//                   <span className="font-medium text-sm">{item.label}</span>
//                 </button>
                
//                 {item.label === 'Bills' && billsMenuOpen && (
//                   <div className="ml-10 mt-2 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
//                     {['Kacha', 'Pakka', 'All'].map(sub => (
//                       <button 
//                         key={sub}
//                         onClick={() => navigate(`/bill/${sub.toLowerCase()}`)}
//                         className={`w-full text-left px-4 py-2.5 text-sm transition-all rounded-lg ${
//                           location.pathname === `/bill/${sub.toLowerCase()}` 
//                             ? 'text-white font-semibold bg-slate-700/50' 
//                             : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
//                         }`}
//                       >
//                         • {sub} Bills
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </nav>

//           <div className="p-4 border-t border-slate-700/50 shrink-0 relative">
//             <button
//               onMouseEnter={() => setShowProfileMenu(true)}
//               className="w-full flex items-center space-x-3 rounded-xl hover:bg-slate-800/50 transition-all p-3"
//             >
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center font-bold shrink-0 shadow-md">
//                 {user.name?.charAt(0).toUpperCase()}
//               </div>
//               <div className="flex-1 min-w-0 text-left">
//                 <p className="font-semibold text-sm truncate">{user.name}</p>
//                 <p className="text-slate-400 text-xs truncate mt-0.5">{user.email}</p>
//               </div>
//             </button>

//             {showProfileMenu && (
//               <div 
//                 onMouseLeave={() => setShowProfileMenu(false)}
//                 className="absolute bottom-full left-4 right-4 mb-3 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50"
//               >
//                 <Link to="/profile" className="w-full flex items-center px-4 py-3.5 text-sm text-slate-300 hover:bg-slate-700/80 transition-colors">
//                   <span className="mr-3">👤</span> Profile Settings
//                 </Link>
//                 <button onClick={handleLogout} className="w-full flex items-center px-4 py-3.5 text-sm text-slate-300 hover:bg-red-600/80 transition-colors">
//                   <span className="mr-3">🚪</span> Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* MAIN CONTENT: Removed 'ml-64', added flex-1 to auto-fill space */}
//       <div className="flex-1 flex flex-col min-w-0">
//         <header className="h-20 bg-white border-b border-gray-200 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
//           <div className="flex items-center space-x-4">
//             <button 
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors hover:text-gray-700"
//             >
//               {/* Toggle icon changes slightly based on state */}
//               <svg className={`w-6 h-6 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h1>
//             </div>
//           </div>

          
//           {/* for future implementation of search bar and global notification feature */}
//           {/* <div className="flex items-center space-x-3"> 
            
//             {/* <div className="relative hidden lg:block">
//                <input
//                 type="text"
//                 placeholder="Search..."
//                 className="pl-11 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm outline-none"
//               /> 
//                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
//             </div>
//             <button className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl relative">
//               <span className="text-xl">🔔</span> 
//               <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span> 
//             </button> 
//            </div> */}
//         </header>

//         <main className="flex-1 overflow-y-auto p-6 md:p-8">
//           {showBanner && (
//             <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8 flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <div className="bg-amber-100 p-3 rounded-xl">⚠️</div>
//                 <div>
//                   <h3 className="font-bold text-gray-900">Complete Your Profile</h3>
//                   <p className="text-sm text-gray-600">Finish onboarding to unlock all features.</p>
//                 </div>
//               </div>
//               <button onClick={() => navigate('/profile')} className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold">Finish</button>
//             </div>
//           )}

//           <div className="animate-in fade-in duration-500">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;




import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';

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

  if (!localStorage.getItem('token')) return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/bills/all', label: 'Bills', icon: '📄' },
    { path: '/ai-assistant', label: 'AI Assistant', icon: '🤖' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const getPageTitle = () => {
    if (location.pathname === '/profile') return 'Profile';
    const item = navItems.find(i => location.pathname.startsWith(i.path.split('/all')[0]));
    return item?.label || 'Dashboard';
  };

  return (
    // We use h-screen and overflow-hidden on the parent to lock the window size
    <div className="h-screen w-full bg-gray-50 flex overflow-hidden">
      
      {/* SIDEBAR: Sticky and fixed to screen height */}
      <aside className={`
        bg-gradient-to-b from-slate-900 to-slate-800 text-white 
        transition-all duration-300 ease-in-out flex flex-col shrink-0
        h-screen sticky top-0 z-40
        ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}
      `}>
        <div className="w-64 flex flex-col h-full">
          <div className="p-6 border-b border-slate-700/50 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                <span className="text-xl font-bold">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-l font-bold tracking-tight uppercase">Udhyog Saathi</h2>
                <p className="text-slate-400 text-xs mt-0.5">Business Suite</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.path}>
                <button
                  onClick={() => {
                    if (item.label === 'Bills') setBillsMenuOpen(!billsMenuOpen);
                    else navigate(item.path);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3.5 space-x-3 rounded-xl transition-all duration-200
                    ${location.pathname.startsWith(item.path.split('/all')[0]) 
                      ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30 shadow-sm' 
                      : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
                
                {item.label === 'Bills' && billsMenuOpen && (
                  <div className="ml-10 mt-2 space-y-1.5">
                    {['Kacha', 'Pakka', 'All'].map(sub => (
                      <button 
                        key={sub}
                        onClick={() => navigate(`/bills/${sub.toLowerCase()}`)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-all rounded-lg ${
                          location.pathname === `/bills/${sub.toLowerCase()}` 
                            ? 'text-white font-semibold bg-slate-700/50' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                        }`}
                      >
                        • {sub} Bills
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-700/50 shrink-0 relative">
            <button
              onMouseEnter={() => setShowProfileMenu(true)}
              className="w-full flex items-center space-x-3 rounded-xl hover:bg-slate-800/50 transition-all p-3"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold shrink-0 shadow-md">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-semibold text-sm truncate">{user.name}</p>
                <p className="text-slate-400 text-xs truncate">{user.email}</p>
              </div>
            </button>

            {showProfileMenu && (
              <div 
                onMouseLeave={() => setShowProfileMenu(false)}
                className="absolute bottom-full left-4 right-4 mb-3 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50"
              >
                <Link to="/profile" className="w-full flex items-center px-4 py-3.5 text-sm text-slate-300 hover:bg-slate-700/80 transition-colors">
                  <span className="mr-3">👤</span> Profile Settings
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center px-4 py-3.5 text-sm text-slate-300 hover:bg-red-600/80 transition-colors">
                  <span className="mr-3">🚪</span> Logout
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
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <svg className={`w-6 h-6 ${!sidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          </div>
        </header>

        {/* SCROLLABLE CANVAS: This is the only area that should scroll */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {showBanner && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-xl">⚠️</div>
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