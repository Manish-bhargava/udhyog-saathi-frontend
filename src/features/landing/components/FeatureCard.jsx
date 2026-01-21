import React from 'react';

const FeatureCard = ({ feature, index }) => {
  const { title, description, icon, color, border } = feature;
  
  return (
    <div className={`bg-white rounded-xl p-6 border ${border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 text-2xl shadow-sm`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;