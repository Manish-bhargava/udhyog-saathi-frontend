import React from 'react';

const FeatureCard = ({ feature, index }) => {
  const { title, description, icon, color, border } = feature;
  
  return (
    <div className={`bg-white rounded-2xl p-8 border ${border} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
      <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-6 text-3xl shadow-sm`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;