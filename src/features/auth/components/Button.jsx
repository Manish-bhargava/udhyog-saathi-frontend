import React from 'react';

const Button = ({ 
  type = 'button', 
  children, 
  onClick, 
  disabled = false, 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const handleClick = (e) => {
    console.log('Button clicked'); // Debug log
    if (onClick && !disabled) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${fullWidth ? 'w-full' : ''}
        ${disabled 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }
        text-white font-semibold py-3 px-4 rounded-lg
        transition-all duration-200 ease-in-out
        transform hover:scale-[1.02] active:scale-[0.98]
        shadow-md hover:shadow-lg
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;