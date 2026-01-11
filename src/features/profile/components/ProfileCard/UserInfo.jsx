import React from 'react';
import { useAuth } from '../../../auth/context/AuthContext';

const UserInfo = () => {
  const { user } = useAuth();

  return (
    <div className="text-center">
      {/* Avatar/Logo */}
      <div className="relative inline-block mb-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mb-3 mx-auto">
          {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {user?.name || 'User Name'}
          </h3>
          <p className="text-sm text-gray-600 truncate">
            {user?.email || 'user@example.com'}
          </p>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-left">
              <p className="text-gray-500">Role</p>
              <p className="font-medium text-gray-900">Business Owner</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="pt-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-500">Bills</p>
              <p className="font-bold text-blue-600">0</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-500">Customers</p>
              <p className="font-bold text-green-600">0</p>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-500">Since</p>
              <p className="font-bold text-purple-600">2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;