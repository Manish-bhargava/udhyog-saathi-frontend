import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const QuickTour = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();

  const tourSteps = [
    {
      title: "Welcome to Your Dashboard!",
      description: "This is your main workspace where you can access all features.",
      element: "dashboard"
    },
    {
      title: "Manage Your Bills",
      description: "Create and track Kacha & Pakka bills from the Bills section.",
      element: "bills"
    },
    {
      title: "AI Assistant",
      description: "Get help with your business operations using our AI Assistant.",
      element: "ai-assistant"
    },
    {
      title: "Complete Your Profile",
      description: "Finish your onboarding to unlock all features.",
      element: "onboarding"
    }
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinishTour();
    }
  };

  const handleSkip = () => {
    handleFinishTour();
  };

  const handleFinishTour = () => {
    // Complete the tour (first part of onboarding)
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {tourSteps[currentStep].title}
          </h2>
          <p className="text-gray-600">
            {tourSteps[currentStep].description}
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {currentStep + 1} / {tourSteps.length}
          </span>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleSkip}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Skip Tour
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Complete your profile to unlock all features
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickTour;