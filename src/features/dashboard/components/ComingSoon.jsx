import React from 'react';

const ComingSoon = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 md:p-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto">
          🚧
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Dashboard Under Construction
        </h2>
        <p className="text-gray-600 mb-6">
          We're working hard to bring you the complete UdhyogSaathi dashboard experience. 
          This section will soon be filled with powerful features to help you manage your business.
        </p>
        <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Coming Soon</span>
        </div>
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="text-2xl mb-3">📄</div>
            <h3 className="font-bold text-gray-900 mb-2">Kacha/Pakka Bills</h3>
            <p className="text-gray-600 text-sm">
              Seamless draft to final invoice management
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 text-sm">
              Real-time insights into your business performance
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="text-2xl mb-3">🤖</div>
            <h3 className="font-bold text-gray-900 mb-2">AI Assistant</h3>
            <p className="text-gray-600 text-sm">
              Get intelligent answers to your business questions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;