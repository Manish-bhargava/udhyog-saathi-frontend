import React from 'react';

const TestimonialCard = ({ testimonial }) => {
  const { name, company, text, initial } = testimonial;
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
          {initial}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <p className="text-xs text-gray-500">{company}</p>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed text-sm">"{text}"</p>
      <div className="mt-3 flex text-yellow-400 text-sm">★★★★★</div>
    </div>
  );
};

export default TestimonialCard;