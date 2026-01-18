// import React from 'react';
// import AuthCard from '../../auth/components/AuthCard';
// import Heading from '../../auth/components/Heading';
// import Subheading from '../../auth/components/Subheading';
// import Button from '../../auth/components/Button';

// const TourPage = () => {
//   const handleFinishTour = () => {
//     localStorage.setItem('tourComplete', 'true');
//     localStorage.setItem('isNewUser', 'false'); // Finally, they are an "Old User"
//     window.location.href = '/dashboard'; // Hard refresh to Dashboard
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <AuthCard>
//         <div className="text-center">
//           <Heading>Quick Tour</Heading>
//           <Subheading>Welcome! Let us show you how to create your first bill.</Subheading>
          
//           <div className="my-10 p-10 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg text-blue-600">
//              [ Here you can add your Tour Content or Video ]
//           </div>

//           <Button onClick={handleFinishTour} fullWidth>
//             Finish & Go to Dashboard
//           </Button>
          
//           <button onClick={handleFinishTour} className="mt-4 text-sm text-gray-400 hover:text-gray-600">
//             Skip Tour
//           </button>
//         </div>
//       </AuthCard>
//     </div>
//   );
// };

// export default TourPage;



import React from 'react';
import AuthCard from '../../auth/components/AuthCard';
import Heading from '../../auth/components/Heading';
import Subheading from '../../auth/components/Subheading';
import Button from '../../auth/components/Button';

const TourPage = () => {
  const handleFinishTour = () => {
    localStorage.setItem('tourComplete', 'true');
    localStorage.setItem('isNewUser', 'false');
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 flex items-center justify-center p-4">
      <AuthCard className="max-w-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
            <span className="text-2xl">🚀</span>
          </div>
          <Heading className="text-3xl">Welcome to UdhyogSaathi</Heading>
          <Subheading className="mt-3 text-gray-600 max-w-lg mx-auto">
            Let's take a quick tour to show you how to create your first bill in minutes.
          </Subheading>
          
          <div className="my-10 p-10 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-2xl text-center">
            <div className="text-5xl mb-4">📹</div>
            <p className="text-gray-700 font-medium">Interactive Tour Content</p>
            <p className="text-gray-500 text-sm mt-2">Guided walkthrough of key features</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl mb-3">📄</div>
                <h4 className="font-semibold text-gray-900">Create Bills</h4>
                <p className="text-gray-600 text-sm mt-1">Generate professional invoices in seconds</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-xl mb-3">🤖</div>
                <h4 className="font-semibold text-gray-900">AI Assistant</h4>
                <p className="text-gray-600 text-sm mt-1">Get smart suggestions for your business</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-xl mb-3">📈</div>
                <h4 className="font-semibold text-gray-900">Analytics</h4>
                <p className="text-gray-600 text-sm mt-1">Track your business performance</p>
              </div>
            </div>

            <Button 
              onClick={handleFinishTour} 
              fullWidth 
              className="py-3.5 text-base font-semibold mt-8"
            >
              Finish Tour & Go to Dashboard
            </Button>
            
            <button 
              onClick={handleFinishTour} 
              className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Skip Tour
            </button>
          </div>
        </div>
      </AuthCard>
    </div>
  );
};

export default TourPage;