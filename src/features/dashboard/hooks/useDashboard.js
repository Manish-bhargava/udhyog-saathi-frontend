import { useAuth } from '../../auth/context/AuthContext';

export const useDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Bills', value: '0', change: '+0%', icon: '📄' },
    { label: 'Pending Bills', value: '0', change: '+0%', icon: '⏳' },
    { label: 'Completed Bills', value: '0', change: '+0%', icon: '✅' },
    { label: 'Revenue', value: '₹0', change: '+0%', icon: '💰' },
  ];

  const quickActions = [
    { label: 'Create Bill', icon: '➕', path: '/dashboard/bills/create' },
    { label: 'Add Customer', icon: '👥', path: '/dashboard/customers/add' },
    { label: 'Generate Report', icon: '📊', path: '/dashboard/reports' },
    { label: 'Settings', icon: '⚙️', path: '/dashboard/settings' },
  ];

  return {
    user,
    stats,
    quickActions
  };
};