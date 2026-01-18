import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';

/**
 * Topbar Component
 * Handles page titles, global search, and the notification system.
 * Consumes NotificationContext for real-time updates across the platform.
 */
const Topbar = ({ title }) => {
  const { 
    notifications, 
    removeNotification, 
    markAllAsRead, 
    hasUnread 
  } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Close the notification dropdown when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement global search logic here
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6 relative">
      <div className="flex items-center justify-between">
        {/* Left Side: Dynamic Page Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        
        {/* Right Side: Search & Actions */}
        <div className="flex items-center space-x-4">
          {/* Global Search Bar */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-48 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
          
          {/* Notification System */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
              aria-label="View Notifications"
            >
              <span className="text-xl">🔔</span>
              {/* Red Dot Indicator: Only shows if there are unread items */}
              {hasUnread && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden transform origin-top-right transition-all">
                {/* Dropdown Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-900">Notifications</h3>
                  {notifications.length > 0 && (
                    <button 
                      onClick={markAllAsRead} 
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                {/* Notification List Area */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors flex justify-between items-start ${
                          notification.unread ? 'bg-blue-50/40' : 'bg-white'
                        }`}
                      >
                        <div className="flex-1 pr-2">
                          <p className={`text-sm ${
                            notification.unread ? 'font-semibold text-gray-900' : 'text-gray-600'
                          }`}>
                            {notification.text}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                        
                        {/* Remove Notification Button */}
                        <button 
                          onClick={() => removeNotification(notification.id)} 
                          className="text-gray-300 hover:text-red-500 transition-colors ml-2"
                          title="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    /* Empty State */
                    <div className="p-10 text-center">
                      <div className="text-4xl mb-2 opacity-20">📭</div>
                      <p className="text-gray-400 text-sm">No notifications yet</p>
                    </div>
                  )}
                </div>

                {/* Optional: Footer Action */}
                {notifications.length > 0 && (
                  <div className="p-3 bg-gray-50 text-center border-t">
                    <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                      View all activity
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Chat/Support Placeholder Button */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <span className="text-xl">💬</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;