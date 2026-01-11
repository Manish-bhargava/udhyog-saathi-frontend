import React from 'react';

const ComingSoon = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
      <h3 className="font-bold text-gray-900 mb-4">Dashboard Overview</h3>
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚀</div>
        <h4 className="text-xl font-bold text-gray-900 mb-2">Exciting Features Coming Soon!</h4>
        <p className="text-gray-600 mb-6">
          We're working hard to bring you the best business management experience. 
          Your dashboard will be filled with powerful insights and tools very soon.
        </p>
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
          <span className="animate-pulse">🔧</span>
          <span className="font-medium">Under Development</span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;