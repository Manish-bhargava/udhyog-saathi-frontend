import React from 'react';
import { useProfileProgress } from '../../hooks/useProfileProgress';

const ProgressBar = () => {
  const { progress } = useProfileProgress();
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Profile Completion</span>
        <span className="text-sm font-semibold text-blue-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Complete your profile to unlock all features
      </p>
    </div>
  );
};

export default ProgressBar;