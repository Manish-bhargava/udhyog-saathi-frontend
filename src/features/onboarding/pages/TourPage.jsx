import React from 'react';
import AuthCard from '../../auth/components/AuthCard';
import Heading from '../../auth/components/Heading';
import Subheading from '../../auth/components/Subheading';
import Button from '../../auth/components/Button';

const TourPage = () => {
  const handleFinishTour = () => {
    localStorage.setItem('tourComplete', 'true');
    localStorage.setItem('isNewUser', 'false'); // Finally, they are an "Old User"
    window.location.href = '/dashboard'; // Hard refresh to Dashboard
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <AuthCard>
        <div className="text-center">
          <Heading>Quick Tour</Heading>
          <Subheading>Welcome! Let us show you how to create your first bill.</Subheading>
          
          <div className="my-10 p-10 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg text-blue-600">
             [ Here you can add your Tour Content or Video ]
          </div>

          <Button onClick={handleFinishTour} fullWidth>
            Finish & Go to Dashboard
          </Button>
          
          <button onClick={handleFinishTour} className="mt-4 text-sm text-gray-400 hover:text-gray-600">
            Skip Tour
          </button>
        </div>
      </AuthCard>
    </div>
  );
};

export default TourPage;