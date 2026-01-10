import React from 'react';

const ComingSoon = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 md:p-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
          🚧
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Dashboard Under Construction
        </h2>
        <p className="text-gray-600 mb-5">
          We're working hard to bring you the complete UdhyogSaathi dashboard experience. 
          This section will soon be filled with powerful features to help you manage your business.
        </p>
        <div className="inline-flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full text-xs font-medium text-gray-700">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span>Coming Soon</span>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-xl mb-2">📄</div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Kacha/Pakka Bills</h3>
            <p className="text-gray-600 text-xs">
              Seamless draft to final invoice management
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-xl mb-2">📊</div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Analytics</h3>
            <p className="text-gray-600 text-xs">
              Real-time insights into your business performance
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-xl mb-2">🤖</div>
            <h3 className="font-bold text-gray-900 mb-1 text-sm">AI Assistant</h3>
            <p className="text-gray-600 text-xs">
              Get intelligent answers to your business questions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;