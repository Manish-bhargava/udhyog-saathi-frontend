import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import billAPI from '../../bills/api/index';

export const useDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billStats, setBillStats] = useState({
    totalCount: 0,
    pendingCount: 0,
    completedCount: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch both types of bills to aggregate stats
        const [pakkaResponse, kachaResponse] = await Promise.all([
          billAPI.getBillsByType('pakka', 1, 1000),
          billAPI.getKachaBills(1, 1000)
        ]);

        const allBills = [
          ...(pakkaResponse?.data || []),
          ...(kachaResponse?.data || [])
        ];

        const stats = allBills.reduce((acc, bill) => {
          // Count totals
          acc.totalCount += 1;
          
          // Count by status (handling both 'paid' and 'completed' naming conventions)
          if (bill.status === 'paid' || bill.status === 'completed') {
            acc.completedCount += 1;
          } else {
            acc.pendingCount += 1;
          }

          // Sum Revenue
          acc.totalRevenue += (bill.grandTotal || bill.totalAmount || 0);

          return acc;
        }, {
          totalCount: 0,
          pendingCount: 0,
          completedCount: 0,
          totalRevenue: 0
        });

        setBillStats(stats);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = useMemo(() => [
    { 
      label: 'Total Bills', 
      value: loading ? '...' : billStats.totalCount.toString(), 
      change: '+0%', 
      icon: '📄' 
    },
    { 
      label: 'Pending Bills', 
      value: loading ? '...' : billStats.pendingCount.toString(), 
      change: '+0%', 
      icon: '⏳' 
    },
    { 
      label: 'Completed Bills', 
      value: loading ? '...' : billStats.completedCount.toString(), 
      change: '+0%', 
      icon: '✅' 
    },
    { 
      label: 'Revenue', 
      value: loading ? '...' : `₹${billStats.totalRevenue.toLocaleString('en-IN')}`, 
      change: '+0%', 
      icon: '💰' 
    },
  ], [billStats, loading]);

  const quickActions = [
    { label: 'Create kacha bill', icon: '➕', path: '/bills/kacha' },
    { label: 'Create Pakka bill', icon: '➕', path: '/bills/pakka' },
    { label: 'View All Bills', icon: '📋', path: '/bills/all' },
    { label: 'Talk to AI', icon: '👤', path: '/ai-assistant' },
  ];

  return {
    user,
    stats,
    quickActions,
    loading,
    error
  };
};