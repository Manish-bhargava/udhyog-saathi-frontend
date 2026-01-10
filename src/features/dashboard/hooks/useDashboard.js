import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('overview');

  // Mock user data (in real app, get from auth context/API)
  const user = {
    name: 'Rajesh Gupta',
    email: 'rajesh@guptatextiles.com',
    businessName: 'Gupta Textiles',
    avatar: 'RG',
    role: 'Owner'
  };

  // Mock stats data
  const stats = [
    {
      label: 'Total Sales',
      value: '₹1.42L',
      change: '+12%',
      icon: '💰',
      color: 'bg-green-50 text-green-700 border-green-100'
    },
    {
      label: 'Active Orders',
      value: '14',
      change: '+2 new',
      icon: '📦',
      color: 'bg-blue-50 text-blue-700 border-blue-100'
    },
    {
      label: 'Pending Bills',
      value: '3',
      change: 'Action needed',
      icon: '📄',
      color: 'bg-orange-50 text-orange-700 border-orange-100'
    },
    {
      label: 'Customers',
      value: '102',
      change: '+5 this month',
      icon: '👥',
      color: 'bg-purple-50 text-purple-700 border-purple-100'
    }
  ];

  // Navigation items
  const navItems = [
    { label: 'Overview', icon: '📊', path: 'overview', active: true },
    { label: 'Kacha Bills', icon: '📝', path: 'kacha-bills' },
    { label: 'Pakka Bills', icon: '✅', path: 'pakka-bills' },
    { label: 'Customers', icon: '👥', path: 'customers' },
    { label: 'Inventory', icon: '📦', path: 'inventory' },
    { label: 'AI Assistant', icon: '🤖', path: 'ai-assistant' },
    { label: 'Reports', icon: '📈', path: 'reports' },
    { label: 'Settings', icon: '⚙️', path: 'settings' }
  ];

  // Quick actions
  const quickActions = [
    { label: 'Create Bill', icon: '➕', onClick: () => console.log('Create Bill') },
    { label: 'Add Customer', icon: '👤', onClick: () => console.log('Add Customer') },
    { label: 'Check Inventory', icon: '📦', onClick: () => console.log('Check Inventory') },
    { label: 'Ask AI', icon: '🤖', onClick: () => console.log('Ask AI') }
  ];

  const handleNavClick = (path) => {
    setActiveNav(path);
    // In real app, update route or content
    console.log(`Navigating to: ${path}`);
  };

  const handleLogout = () => {
    // In real app, clear auth tokens and redirect
    console.log('Logging out...');
    navigate('/login');
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return {
    user,
    stats,
    navItems,
    quickActions,
    sidebarOpen,
    activeNav,
    handleNavClick,
    handleLogout,
    handleToggleSidebar
  };
};