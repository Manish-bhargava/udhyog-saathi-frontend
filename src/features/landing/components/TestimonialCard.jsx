import React from 'react';

const TestimonialCard = ({ testimonial }) => {
  const { name, company, text, initial } = testimonial;
  
  return (
    <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xl">
          {initial}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <p className="text-xs text-gray-500 uppercase font-bold">{company}</p>
        </div>
      </div>
      <p className="text-gray-600 italic leading-relaxed">"{text}"</p>
      <div className="mt-4 flex text-yellow-400">⭐⭐⭐⭐⭐</div>
    </div>
  );
};

export default TestimonialCard;