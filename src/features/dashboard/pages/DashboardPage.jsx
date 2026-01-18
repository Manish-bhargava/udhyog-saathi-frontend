import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import StatsCard from '../components/StatsCard';
import ComingSoon from '../components/ComingSoon';
import QuickActions from '../components/QuickActions';

const DashboardPage = () => {
  const {
    user,
    stats,
    quickActions,
    loading,
    error
  } = useDashboard();

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 text-blue-600 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Welcome Banner */}
      <div className="mb-6 md:mb-8 mt-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome to UdhyogSaathi, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}!
              </h2>
              <p className="text-blue-100">
                {loading ? 'Fetching your latest business data...' : "Your business dashboard is ready. Here's your current overview."}
              </p>
            </div>
            <button className="mt-4 md:mt-0 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
              Explore Features
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} stat={stat} />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <ComingSoon />
          
          {/* Placeholder for Future Content */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Upcoming Features</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-4">
                    📄
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Bill Management</h4>
                    <p className="text-sm text-gray-500">Kacha to Pakka conversion</p>
                  </div>
                </div>
                <span className="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  Coming Next
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
                    📊
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Sales Analytics</h4>
                    <p className="text-sm text-gray-500">Revenue and growth tracking</p>
                  </div>
                </div>
                <span className="text-xs font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  In Progress
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 md:space-y-8">
          <QuickActions actions={quickActions} />
          
          {/* Support Card */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-100 p-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
              <span className="mr-2">💬</span>
              Need Help?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Our team is here to help you get started with UdhyogSaathi.
            </p>
            <div className="space-y-3">
              <button className="w-full bg-white text-teal-700 font-medium py-3 rounded-lg border border-teal-200 hover:bg-teal-50 transition-colors">
                📞 Call Support
              </button>
              <button className="w-full bg-teal-600 text-white font-medium py-3 rounded-lg hover:bg-teal-700 transition-colors">
                💬 Chat with AI Assistant
              </button>
            </div>
          </div>
          
          {/* Quick Tips */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Tips</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mt-1">
                  1
                </div>
                <p className="text-sm text-gray-600">
                  Use Kacha bills for negotiations before converting to Pakka bills
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mt-1">
                  2
                </div>
                <p className="text-sm text-gray-600">
                  Ask AI assistant for insights about your best customers
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mt-1">
                  3
                </div>
                <p className="text-sm text-gray-600">
                  Check pending bills daily to ensure timely payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>
          UdhyogSaathi Dashboard • Version 1.0.0 • 
          <span className="mx-2">📧</span>
          {user?.email || 'user@example.com'}
        </p>
        <p className="mt-2">
          Real-time data enabled. Manage your business with ease.
        </p>
      </div>
    </>
  );
};

export default DashboardPage;