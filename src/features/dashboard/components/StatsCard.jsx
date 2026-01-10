import React from 'react';

const StatsCard = ({ stat }) => {
  const { label, value, change, icon, color } = stat;
  
  const changeColor = change.startsWith('+') 
    ? 'text-green-600' 
    : change.includes('Action') 
      ? 'text-orange-600' 
      : 'text-gray-600';
  
  return (
    <div className={`bg-white rounded-xl p-6 border ${color} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      <div className={`text-sm font-medium ${changeColor}`}>
        {change}
      </div>
    </div>
  );
};

export default StatsCard;