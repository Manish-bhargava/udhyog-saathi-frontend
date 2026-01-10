import React from 'react';

const Button = ({ 
  children, 
  type = 'button', 
  onClick, 
  disabled = false, 
  className = '', 
  fullWidth = false,
  variant = 'primary', 
  ...props 
}) => {
  
  const baseClasses = `
    inline-flex items-center justify-center 
    px-4 py-2 border border-transparent 
    text-sm font-medium rounded-md 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    transition-all duration-200
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;
  
  const variants = {
    primary: `
      text-white bg-blue-600 hover:bg-blue-700 
      focus:ring-blue-500
    `,
    secondary: `
      text-gray-700 bg-gray-100 hover:bg-gray-200 
      border-gray-300 focus:ring-gray-500
    `,
    danger: `
      text-white bg-red-600 hover:bg-red-700 
      focus:ring-red-500
    `,
    outline: `
      text-blue-600 bg-transparent hover:bg-blue-50 
      border-blue-600 focus:ring-blue-500
    `
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;