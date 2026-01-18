import React from 'react';

const Divider = ({ text, className = '' }) => {
  if (text) {
    return (
      <div className={`flex items-center my-6 ${className}`}>
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-sm text-gray-500 font-medium">{text}</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>
    );
  }
  
  return <hr className={`my-6 border-gray-200 ${className}`} />;
};

export default Divider;