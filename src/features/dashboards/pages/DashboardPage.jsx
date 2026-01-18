import React from 'react';

const DashboardPage = () => {
  // Use onboarding data from storage to personalize the view
  const onboardingData = JSON.parse(localStorage.getItem('onboardingData')) || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Invoices</p>
          <h3 className="text-2xl font-bold">0</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Business Revenue</p>
          <h3 className="text-2xl font-bold">₹0.00</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Active Company</p>
          <h3 className="text-lg font-semibold truncate text-blue-600">
            {onboardingData.company?.companyName || 'Not Set'}
          </h3>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col items-center justify-center border-dashed border-2">
         <div className="text-4xl mb-4 text-gray-300">📈</div>
         <p className="text-gray-400 font-medium">Activity and Analytics Coming Soon</p>
      </div>
    </div>
  );
};

export default DashboardPage;