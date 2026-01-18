import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OnboardingBanner = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const handleCompleteOnboarding = () => {
    // Navigate to profile page for onboarding completion
    navigate('/profile');
  };

  return (
    <div className="bg-linear-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-3">
          <div className="bg-yellow-100 p-2 rounded-lg">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Complete Your Profile</h3>
            <p className="text-sm text-gray-600 mt-1">
              Finish your onboarding to unlock all features and start using the app fully.
            </p>
          </div>
        </div>
        <button
          onClick={handleCompleteOnboarding}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          Complete Onboarding
        </button>
      </div>
    </div>
  );
};

export default OnboardingBanner;