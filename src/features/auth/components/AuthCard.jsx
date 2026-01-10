import React from 'react';

const AuthCard = ({ children, title, subtitle, footer, className = '' }) => {
  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="bg-white rounded-2xl shadow-2xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="font-black text-2xl tracking-tighter">US</span>
              </div>
            </div>
            
            {title && (
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
            )}
            
            {subtitle && (
              <p className="text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="space-y-6">
            {children}
          </div>
        </div>
        
        {footer && (
          <div className="bg-gray-50 border-t border-gray-100 px-8 py-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCard;