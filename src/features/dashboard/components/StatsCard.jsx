import React from 'react';

const StatsCard = ({ stat }) => {
  const { label, value, change, icon, color } = stat;
  
  const changeColor = change.startsWith('+') 
    ? 'text-green-600' 
    : change.includes('Action') 
      ? 'text-orange-600' 
      : 'text-gray-600';
  
  return (
    <div className={`bg-white rounded-xl p-5 border ${color} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            {label}
          </p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
      <div className={`text-xs font-medium ${changeColor} mt-3`}>
        {change}
      </div>
    </div>
  );
};

export default StatsCard;