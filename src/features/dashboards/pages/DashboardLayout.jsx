import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { profileAPI } from '../../profiles/api';
import { useBillPageContext } from '../../bills/BillPageContext';
import { useInventoryContext } from '../../Inventory/InventoryContext';
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
  FaShoppingCart,
  FaUserCircle,
  FaReceipt,
  FaFileAlt,
  FaFileContract,
  FaChevronDown,
  FaSearch
} from 'react-icons/fa';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [billsMenuOpen, setBillsMenuOpen] = useState(false);
  const [inventoryMenuOpen, setInventoryMenuOpen] = useState(false);
  const [inventoryFiltersOpen, setInventoryFiltersOpen] = useState(false);
  const [dashboardSearch, setDashboardSearch] = useState('');
  const inventoryFiltersRef = useRef(null);
  const { billPageState } = useBillPageContext();
  const { inventoryPageState } = useInventoryContext();
  
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
    // { path: '/reports', label: 'Reports', icon: <FaChartBar /> }, // TODO: Implement Reports feature
    { path: '/billing', label: 'Billing', icon: <FaRupeeSign /> },
    { path: '/inventory', label: 'Inventory', icon: <FaShoppingCart /> },
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

  const handleInventoryClick = () => {
    setInventoryMenuOpen(!inventoryMenuOpen);
  };

  useEffect(() => {
    setInventoryFiltersOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!inventoryFiltersOpen) return;
    const handleClickOutside = (event) => {
      if (inventoryFiltersRef.current && !inventoryFiltersRef.current.contains(event.target)) {
        setInventoryFiltersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inventoryFiltersOpen]);

  const isInventoryListPage =
    location.pathname.includes('/inventory/finished') ||
    location.pathname.includes('/inventory/raw');
  const isDashboardPage = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  const activeInventoryFilterCount = [
    inventoryPageState.sort !== 'newest',
    inventoryPageState.status !== 'all',
    inventoryPageState.warehouse !== 'all',
  ].filter(Boolean).length;
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
                    else if (item.label === 'Inventory') handleInventoryClick();
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
                  {item.label === 'Inventory' && <span className="ml-auto">{inventoryMenuOpen ? <FaCaretDown /> : <FaCaretRight />}</span>}
                </button>
                {item.label === 'Bills' && billsMenuOpen && (
                  <div className="ml-8 mt-2 space-y-1">
                    <button onClick={() => { navigate('/bills/kacha'); setSidebarOpen(false); }} className="w-full text-left p-2 text-sm text-slate-400">Kacha Bills</button>
                    <button onClick={() => { navigate('/bills/pakka'); setSidebarOpen(false); }} className="w-full text-left p-2 text-sm text-slate-400">Pakka Bills</button>
                  </div>
                )}
                {item.label === 'Inventory' && inventoryMenuOpen && (
                  <div className="ml-8 mt-2 space-y-1">
                    <button onClick={() => { navigate('/inventory/finished'); setSidebarOpen(false); }} className="w-full text-left p-2 text-sm text-slate-400">Products</button>
                    <button onClick={() => { navigate('/inventory/raw'); setSidebarOpen(false); }} className="w-full text-left p-2 text-sm text-slate-400">Raw Materials</button>
                    <button onClick={() => { navigate('/inventory/warehouses'); setSidebarOpen(false); }} className="w-full text-left p-2 text-sm text-slate-400">Warehouses</button>
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
        ${sidebarOpen ? 'w-56' : 'w-20'}
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
                  onClick={() => item.label === 'Bills' ? handleBillsClick() : item.label === "Inventory"? handleInventoryClick() : navigate(item.path)}
                  className={`
                    w-full flex items-center rounded-xl duration-200 p-3.5
                    ${location.pathname.startsWith(item.path.split('/template')[0]) ? 'bg-blue-600/20 text-blue-100 border border-blue-500/30' : 'text-slate-300 hover:bg-slate-800/50'}
                    ${sidebarOpen ? 'space-x-3' : 'justify-center'}
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                  {sidebarOpen && item.label === 'Bills' && (
                    <span className="ml-auto text-xs">
                      {billsMenuOpen ? <FaCaretDown /> : <FaCaretRight />}
                    </span>
                  )}
                  {sidebarOpen && item.label === 'Inventory' && (
                    <span className="ml-auto text-xs">
                      {inventoryMenuOpen ? <FaCaretDown /> : <FaCaretRight />}
                    </span>
                  )}
                </button>
                {sidebarOpen && item.label === 'Bills' && billsMenuOpen && (
                  <div className="ml-10 mt-2 space-y-1 border-l border-slate-700 pl-4">
                    <button onClick={() => navigate('/bills/kacha')} className="w-full text-left py-2 text-xs text-slate-400 hover:text-white">Kacha Bills</button>
                    <button onClick={() => navigate('/bills/pakka')} className="w-full text-left py-2 text-xs text-slate-400 hover:text-white">Pakka Bills</button>
                  </div>
                )}
                {sidebarOpen && item.label === "Inventory" && inventoryMenuOpen && (
                  <div className="ml-10 mt-2 space-y-1 border-l border-slate-700 pl-4">
                    <button
                    onClick={() => navigate("/inventory/finished")}
                    className="w-full text-left py-2 text-xs text-slate-400 hover:text-white">
                      Products
                    </button>
                    <button
                      onClick={() => navigate("/inventory/raw")}
                      className="w-full text-left py-2 text-xs text-slate-400 hover:text-white">
                        Raw Materials
                    </button>
                    <button
                      onClick={() => navigate("/inventory/warehouses")}
                      className="w-full text-left py-2 text-xs text-slate-400 hover:text-white">
                        Warehouses
                    </button>
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
        
        <header className="h-auto md:h-16 bg-white border-b border-gray-200 px-2 md:px-4 flex flex-wrap items-center justify-between gap-2 md:gap-4 shrink-0 sticky top-0 z-30 shadow-sm py-2 md:py-0">
          <div className="flex items-center space-x-2">
            {/* MOBILE ONLY TOGGLE */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-transform duration-300"
              style={{ transform: sidebarOpen ? 'rotateX(180deg)' : 'rotateX(0deg)' }}
            >
              <FaChevronDown size={18} />
            </button>

            {/* REMOVED: Redundant desktop toggle button from top bar */}
            
            <div className="flex items-center gap-2">
              {location.pathname.includes('/inventory/warehouses') ? (
                <h1 className="text-base md:text-lg font-bold text-gray-900 whitespace-nowrap">Warehouses &amp; stock</h1>
              ) : (
                <>
                  <h1 className="text-base md:text-lg font-bold text-gray-900">{getPageTitle()}</h1>
                  {/* BILL TYPE BADGE - SHOWN ON BILL PAGES */}
                  {location.pathname.includes('/bills/kacha') && (
                    <span className="hidden sm:inline-block px-2 py-0.5 bg-amber-100 text-amber-700 text-[8px] md:text-[10px] font-bold uppercase rounded">
                      Proforma
                    </span>
                  )}
                  {location.pathname.includes('/bills/pakka') && (
                    <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[8px] md:text-[10px] font-bold uppercase rounded">
                      Tax Invoice
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {isDashboardPage && (
            <div className="order-3 md:order-none flex items-center gap-2 w-full md:flex-1 md:mx-4 min-w-0">
              <div className="relative flex-1 min-w-[160px]">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type="text"
                  value={dashboardSearch}
                  onChange={(e) => setDashboardSearch(e.target.value)}
                  placeholder="Search bills, clients, products, status..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                />
              </div>
              {dashboardSearch && (
                <button
                  onClick={() => setDashboardSearch('')}
                  className="text-xs text-blue-600 font-medium hover:underline whitespace-nowrap shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* WAREHOUSES PAGE SEARCH - SHOWN ON WAREHOUSES PAGE */}
          {location.pathname.includes('/inventory/warehouses') && (
            <div className="flex items-center gap-2 flex-1 mx-2 md:mx-4">
              <input
                type="text"
                value={inventoryPageState.warehouseSearch}
                onChange={(e) => inventoryPageState.setWarehouseSearch(e.target.value)}
                placeholder="Search warehouse..."
                className="flex-1 px-2 md:px-3 py-1.5 rounded-lg border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              />
              {inventoryPageState.warehouseSearch && (
                <button
                  onClick={() => inventoryPageState.setWarehouseSearch('')}
                  className="text-xs text-blue-600 font-medium hover:underline whitespace-nowrap"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* INVENTORY PAGE SEARCH - SHOWN ON FINISHED AND RAW MATERIALS PAGES */}
          {isInventoryListPage && (
            <div ref={inventoryFiltersRef} className="relative flex items-center gap-2 flex-1 mx-2 md:mx-4 min-w-0">
              <input
                type="text"
                value={inventoryPageState.search}
                onChange={(e) => inventoryPageState.setSearch(e.target.value)}
                placeholder="Search..."
                className="flex-1 min-w-[120px] px-2 md:px-3 py-1.5 rounded-lg border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              />

              <button
                type="button"
                onClick={() => setInventoryFiltersOpen((prev) => !prev)}
                className="px-2 md:px-3 py-1.5 rounded-lg border border-gray-200 text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shrink-0 inline-flex items-center gap-1"
              >
                Filters
                {activeInventoryFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-blue-600 text-white text-[10px]">
                    {activeInventoryFilterCount}
                  </span>
                )}
                <FaChevronDown className={`transition-transform ${inventoryFiltersOpen ? 'rotate-180' : ''}`} size={10} />
              </button>

              {(inventoryPageState.search || activeInventoryFilterCount > 0) && (
                <button
                  onClick={inventoryPageState.clearFilters}
                  className="text-xs text-blue-600 font-medium hover:underline whitespace-nowrap shrink-0"
                >
                  Clear
                </button>
              )}

              {inventoryFiltersOpen && (
                <div className="absolute right-0 top-full mt-2 w-[min(92vw,320px)] bg-white border border-gray-200 rounded-xl shadow-lg z-40 p-3 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Sort By</label>
                    <select
                      value={inventoryPageState.sort}
                      onChange={(e) => inventoryPageState.setSort(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="priceHigh">Price: High to Low</option>
                      <option value="priceLow">Price: Low to High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Stock Status</label>
                    <select
                      value={inventoryPageState.status}
                      onChange={(e) => inventoryPageState.setStatus(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Warehouse</label>
                    <select
                      value={inventoryPageState.warehouse}
                      onChange={(e) => inventoryPageState.setWarehouse(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-gray-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                    >
                      <option value="all">All Warehouses</option>
                      {inventoryPageState.warehouses.map((wh) => (
                        <option key={wh.key || wh._id} value={wh.key || wh._id}>
                          {wh.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        inventoryPageState.clearFilters();
                        setInventoryFiltersOpen(false);
                      }}
                      className="text-xs text-blue-600 font-medium hover:underline"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* WAREHOUSES PAGE REFRESH BUTTON - SHOWN ON WAREHOUSES PAGE */}
          {location.pathname.includes('/inventory/warehouses') && (
            <button
              type="button"
              onClick={() => inventoryPageState.warehouseRefresh?.()}
              className="px-2 md:px-4 py-1.5 rounded-lg border border-gray-200 text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shrink-0"
            >
              Refresh
            </button>
          )}

          {/* BILL PAGE ACTION BUTTONS - SHOWN ONLY ON BILL PAGES */}
          {(location.pathname.includes('/bills/kacha') || location.pathname.includes('/bills/pakka')) && billPageState.onSetActiveTab && (
            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              {/* SEGMENTED TOGGLE */}
              <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                  className={`px-2 md:px-3 py-1.5 text-[10px] md:text-xs font-bold rounded-md transition-all ${
                    billPageState.activeTab === "form"
                      ? (location.pathname.includes('kacha') ? 'bg-amber-600' : 'bg-blue-600') + ' text-white shadow-sm'
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
                  onClick={() => billPageState.onSetActiveTab("form")}
                >
                  Edit
                </button>
                <button
                  className={`px-2 md:px-3 py-1.5 text-[10px] md:text-xs font-bold rounded-md transition-all ${
                    billPageState.activeTab === "preview"
                      ? (location.pathname.includes('kacha') ? 'bg-amber-600' : 'bg-blue-600') + ' text-white shadow-sm'
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
                  onClick={() => billPageState.onSetActiveTab("preview")}
                >
                  Preview
                </button>
              </div>

              <button
                onClick={billPageState.onClear}
                className="px-2 md:px-3 py-1.5 border border-gray-300 text-gray-600 text-[10px] md:text-xs font-medium rounded-md hover:bg-gray-50 shrink-0"
              >
                Clear
              </button>
              <button
                onClick={billPageState.onSave}
                disabled={billPageState.submitting || !billPageState.isFormValid}
                className={`px-2 md:px-4 py-1.5 text-[10px] md:text-xs font-bold rounded-md text-white shadow-sm transition-all shrink-0 ${
                  location.pathname.includes('kacha')
                    ? (billPageState.submitting || !billPageState.isFormValid ? "bg-amber-300" : "bg-amber-600 hover:bg-amber-700")
                    : (billPageState.submitting || !billPageState.isFormValid ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700")
                }`}
              >
                {billPageState.submitting ? "Saving..." : location.pathname.includes('kacha') ? "Save Bill" : "Save Invoice"}
              </button>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-3 md:p-6 bg-slate-50">
          {showBanner && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl md:rounded-2xl p-3 md:p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-100 p-2.5 rounded-xl"><FaExclamationTriangle className="text-amber-600 text-lg" /></div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xs md:text-sm">Complete Your Profile</h3>
                  <p className="text-xs text-gray-600">Finish onboarding to unlock all features.</p>
                </div>
              </div>
              <button onClick={() => navigate('/profile')} className="w-full sm:w-auto bg-orange-500 text-white px-4 py-1.5 rounded-xl font-bold text-xs">Finish</button>
            </div>
          )}

          <div className="max-w-[1600px] mx-auto">
            <Outlet context={{ dashboardSearch, setDashboardSearch }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
