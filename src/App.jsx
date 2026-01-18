// import React from 'react'
// import { LandingPage } from './features/landing'
// import { LoginPage, SignupPage } from './features/auth'
// import { DashboardPage } from './features/dashboard'
// import { ProfilePage } from './features/profile'
// import PrivateRoute from './features/auth/components/PrivateRoute'
// import { AuthProvider } from './features/auth/context/AuthContext'
// import { ProfileProvider } from './features/profile/context/ProfileContext'
// import { NotificationProvider } from './features/dashboard/context/NotificationContext'
// import { Route, Routes } from 'react-router-dom'
// import TestAPI from './features/auth/pages/TestAPI'
// import DashboardLayout from './features/dashboard/components/DashboardLayout'
// import TestBackendRoutes from './features/auth/pages/TestBackendRoutes.jsx';
// import { 
//   KachaBillsPage, 
//   PakkaBillsPage, 
//   AllBillsPage 
// } from './features/bills'
// import ChatInterface from './features/aiAssistant/ChatInterface'  

// function App() {
//   return (
//     <NotificationProvider>
//       <AuthProvider>
//         <ProfileProvider>
//           <Routes>
//             <Route path='/' element={<LandingPage />} />
//             <Route path='/login' element={<LoginPage />} />
//             <Route path='/signup' element={<SignupPage />} />
//             <Route path='/test-api' element={<TestAPI />} />
//             <Route path="/test-routes" element={<TestBackendRoutes />} />
            
//             {/* Dashboard Layout for all authenticated routes */}
//             <Route element={
//               <PrivateRoute>
//                 <DashboardLayout />
//               </PrivateRoute>
//             }>
//               <Route path='/dashboard' element={<DashboardPage />} />
//               <Route path='/profile' element={<ProfilePage />} />
//               <Route path='/bills/kacha' element={<KachaBillsPage />} />
//               <Route path='/bills/pakka' element={<PakkaBillsPage />} />
//               <Route path='/bills/all' element={<AllBillsPage />} />
//               <Route path='/customers' element={<div className="p-6">Customers Page Coming Soon</div>} />
//               <Route path='/bills' element={<div className="p-6">Bills Page Coming Soon</div>} />
              
//               <Route path='/reports' element={<div className="p-6">Reports Page Coming Soon</div>} />
//               <Route path='/settings' element={<div className="p-6">Settings Page Coming Soon</div>} />
//             </Route>
//             <Route path='/ai-assistant' element={<ChatInterface/>} />
//           </Routes>
//         </ProfileProvider>
//       </AuthProvider>
//     </NotificationProvider>
//   )
// }

// export default App
// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';

// // --- CONTEXT PROVIDERS ---
// import { AuthProvider } from './features/auth/context/AuthContext';
// import { ProfileProvider } from './features/profile/context/ProfileContext';
// import { NotificationProvider } from './features/dashboard/context/NotificationContext';

// // --- CORE FEATURE IMPORTS ---
// import { LandingPage } from './features/landing';
// import LoginPage from './features/authentication/pages/LoginPage';
// import SignupPage from './features/authentication/pages/SignupPage';
// import OnboardingPage from './features/onboarding/pages/OnboardingPage';
// import TourPage from './features/onboarding/pages/TourPage';
// import DashboardLayout from './features/dashboards/pages/DashboardLayout';
// import DashboardPage from './features/dashboards/pages/DashboardPage';
// import ProfilePage from './features/profiles/pages/ProfilePage';

// // --- BILLS & AI IMPORTS ---
// import { 
//   KachaBillsPage, 
//   PakkaBillsPage, 
//   AllBillsPage 
// } from './features/bills';
// import ChatInterface from './features/aiAssistant/ChatInterface';

// /**
//  * Main Application Component (v2 Stable Architecture)
//  * Handles global routing and authentication guardrails.
//  */
// function App() {
//   // --- 1. GLOBAL AUTH STATE ---
//   const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
//   const [isNewUser, setIsNewUser] = useState(localStorage.getItem('isNewUser') === 'true');

//   // --- 2. STATE SYNCHRONIZATION ---
//   useEffect(() => {
//     const syncAppState = () => {
//       setIsAuth(!!localStorage.getItem('token'));
//       setIsNewUser(localStorage.getItem('isNewUser') === 'true');
//     };

//     window.addEventListener('storage', syncAppState);
//     syncAppState();

//     return () => window.removeEventListener('storage', syncAppState);
//   }, []);

//   return (
//     <NotificationProvider>
//       <AuthProvider>
//         <ProfileProvider>
//           <Routes>
//             {/* --- PUBLIC ACCESSIBLE ROUTES --- */}
//             <Route path='/' element={<LandingPage />} />
//             <Route path='/login' element={<LoginPage />} />
//             <Route path='/signup' element={<SignupPage />} />

//             {/* --- INITIAL SETUP FLOWS (Protected) --- */}
//             <Route 
//               path='/onboarding' 
//               element={isAuth ? <OnboardingPage /> : <Navigate to="/login" replace />} 
//             />
//             <Route 
//               path='/tour' 
//               element={isAuth ? <TourPage /> : <Navigate to="/login" replace />} 
//             />

//             {/* --- PROTECTED DASHBOARD WRAPPER --- */}
//             <Route element={<DashboardLayout />}>
              
//               {/* Core Dashboard Entry */}
//               <Route 
//                 path='/dashboard' 
//                 element={
//                   !isAuth ? (
//                     <Navigate to="/login" replace />
//                   ) : isNewUser ? (
//                     <Navigate to="/onboarding" replace />
//                   ) : (
//                     <DashboardPage />
//                   )
//                 } 
//               />

//               {/* Profile Management Section */}
//               <Route 
//                 path='/profile' 
//                 element={isAuth ? <ProfilePage /> : <Navigate to="/login" replace />} 
//               />

//               {/* --- BILLS MANAGEMENT SECTION --- */}
//               <Route 
//                 path='/bills/all' 
//                 element={isAuth ? <AllBillsPage /> : <Navigate to="/login" replace />} 
//               />
//               <Route 
//                 path='/bills/kacha' 
//                 element={isAuth ? <KachaBillsPage /> : <Navigate to="/login" replace />} 
//               />
//               <Route 
//                 path='/bills/pakka' 
//                 element={isAuth ? <PakkaBillsPage /> : <Navigate to="/login" replace />} 
//               />
//               {/* Redirect /bills to /bills/all */}
//               <Route path='/bills' element={<Navigate to="/bills/all" replace />} />
              
//               {/* --- AI ASSISTANT SECTION --- */}
//               <Route 
//                 path='/ai-assistant' 
//                 element={isAuth ? <ChatInterface /> : <Navigate to="/login" replace />} 
//               />
              
//               {/* Placeholder Routes for Future Implementation */}
//               <Route path='/reports' element={<div className="p-8 text-gray-500 font-medium">Business Reports - Coming Soon</div>} />
//               <Route path='/settings' element={<div className="p-8 text-gray-500 font-medium">Account Settings - Coming Soon</div>} />
//             </Route>

//             {/* --- CATCH-ALL REDIRECT --- */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </ProfileProvider>
//       </AuthProvider>
//     </NotificationProvider>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- CONTEXT PROVIDERS ---
import { AuthProvider } from './features/auth/context/AuthContext';
import { ProfileProvider } from './features/profile/context/ProfileContext';
import { NotificationProvider } from './features/dashboard/context/NotificationContext';

// --- CORE FEATURE IMPORTS ---
import { LandingPage } from './features/landing';
import LoginPage from './features/authentication/pages/LoginPage';
import SignupPage from './features/authentication/pages/SignupPage';
import OnboardingPage from './features/onboarding/pages/OnboardingPage';
import TourPage from './features/onboarding/pages/TourPage';
import DashboardLayout from './features/dashboards/pages/DashboardLayout';
import DashboardPage from './features/dashboards/pages/DashboardPage';
import ProfilePage from './features/profiles/pages/ProfilePage';

import ChatInterface from './features/aiAssistant/ChatInterface';

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
  const [isNewUser, setIsNewUser] = useState(localStorage.getItem('isNewUser') === 'true');

  useEffect(() => {
    const syncAppState = () => {
      setIsAuth(!!localStorage.getItem('token'));
      setIsNewUser(localStorage.getItem('isNewUser') === 'true');
    };
    window.addEventListener('storage', syncAppState);
    syncAppState();
    return () => window.removeEventListener('storage', syncAppState);
  }, []);

  return (
    <NotificationProvider>
      <AuthProvider>
        <ProfileProvider>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />

            <Route 
              path='/onboarding' 
              element={isAuth ? <OnboardingPage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path='/tour' 
              element={isAuth ? <TourPage /> : <Navigate to="/login" replace />} 
            />

            <Route element={<DashboardLayout />}>
              <Route 
                path='/dashboard' 
                element={!isAuth ? <Navigate to="/login" replace /> : isNewUser ? <Navigate to="/onboarding" replace /> : <DashboardPage />} 
              />
              <Route 
                path='/profile' 
                element={isAuth ? <ProfilePage /> : <Navigate to="/login" replace />} 
              />
              
              {/* AI ASSISTANT */}
              <Route path='/ai-assistant' element={isAuth ? <ChatInterface /> : <Navigate to="/login" replace />} />
              
              <Route path='/reports' element={<div className="p-8 text-gray-500 font-medium">Business Reports - Coming Soon</div>} />
              <Route path='/settings' element={<div className="p-8 text-gray-500 font-medium">Account Settings - Coming Soon</div>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ProfileProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;