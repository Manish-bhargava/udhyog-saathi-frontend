import React from 'react';

const Subheading = ({ children, className = '', ...props }) => {
  return (
    <p 
      className={`text-gray-600 leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

export default Subheading;