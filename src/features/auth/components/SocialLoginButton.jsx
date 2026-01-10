import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const SocialLoginButton = ({ 
  provider = 'google', 
  onClick, 
  className = '', 
  disabled = false 
}) => {
  const providers = {
    google: {
      name: 'Google',
      icon: <FcGoogle className="h-5 w-5" />,
      bgColor: 'bg-white',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
      hoverBgColor: 'hover:bg-gray-50',
    },
    github: {
      name: 'GitHub',
      icon: <FaGithub className="h-5 w-5" />,
      bgColor: 'bg-gray-800',
      textColor: 'text-white',
      borderColor: 'border-transparent',
      hoverBgColor: 'hover:bg-gray-900',
    },
  };

  const config = providers[provider] || providers.google;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center 
        w-full px-4 py-2 border rounded-md shadow-sm 
        text-sm font-medium 
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-blue-500 transition-colors duration-200
        ${config.bgColor} 
        ${config.textColor} 
        ${config.borderColor} 
        ${config.hoverBgColor}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <span className="mr-2">{config.icon}</span>
      Continue with {config.name}
    </button>
  );
};

export default SocialLoginButton;