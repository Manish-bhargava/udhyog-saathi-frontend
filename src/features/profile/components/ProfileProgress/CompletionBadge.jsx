import React from 'react';

const CompletionBadge = ({ isComplete }) => {
  return (
    <div className={`px-4 py-2 rounded-lg ${isComplete ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
      <span className="font-medium text-sm">
        {isComplete ? '✅ Profile Complete' : '📋 Profile Incomplete'}
      </span>
    </div>
  );
};

export default CompletionBadge;