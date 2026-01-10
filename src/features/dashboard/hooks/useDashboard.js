import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';

export const useDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('overview');

  // Stats data - would come from API in real app
  const stats = [
    {
      label: 'Total Sales',
      value: '₹0', // Would be fetched from API
      change: '+0%',
      icon: '💰',
      color: 'bg-green-50 text-green-700 border-green-100'
    },
    {
      label: 'Active Orders',
      value: '0',
      change: '+0 new',
      icon: '📦',
      color: 'bg-blue-50 text-blue-700 border-blue-100'
    },
    {
      label: 'Pending Bills',
      value: '0',
      change: 'Action needed',
      icon: '📄',
      color: 'bg-orange-50 text-orange-700 border-orange-100'
    },
    {
      label: 'Customers',
      value: '0',
      change: '+0 this month',
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
    console.log(`Navigating to: ${path}`);
  };

  const handleLogout = () => {
    logout();
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