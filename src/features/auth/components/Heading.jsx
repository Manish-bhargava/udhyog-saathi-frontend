import React from 'react';

const Heading = ({ children, level = 'h1', size = 'xl', className = '', ...props }) => {
  const sizes = {
    xs: 'text-base font-semibold',
    sm: 'text-lg font-semibold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold'
  };
  
  const Tag = level;
  
  return (
    <Tag 
      className={`${sizes[size]} text-gray-900 tracking-tight ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Heading;