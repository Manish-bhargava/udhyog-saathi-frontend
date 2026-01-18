import React, { useEffect } from 'react';

const MessageAlert = ({ message, onClose }) => {
  if (!message || !message.text) return null;

  // Auto-close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const getAlertClass = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800 shadow-green-100';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800 shadow-red-100';
      default:
        return 'bg-blue-50 border-blue-500 text-blue-800 shadow-blue-100';
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] animate-bounce-in">
      <div className={`flex items-center p-4 rounded-lg border shadow-lg max-w-md ${getAlertClass(message.type)}`}>
        <div className="flex-shrink-0 mr-3">
          {message.type === 'success' ? (
            <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex-1 mr-8">
          <p className="text-sm font-bold uppercase tracking-wide">{message.type}</p>
          <p className="text-sm">{message.text}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageAlert;