import React from 'react';

const Heading = ({ children, level = 'h1', size = 'xl', className = '', ...props }) => {
  const sizes = {
    xs: 'text-lg font-semibold',
    sm: 'text-xl font-semibold',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-bold',
    xl: 'text-4xl font-bold'
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