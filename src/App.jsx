import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- CORE FEATURE IMPORTS ---
import { LandingPage } from './features/landing';
import LoginPage from './features/authentication/pages/LoginPage';
import SignupPage from './features/authentication/pages/SignupPage';
import OnboardingPage from './features/onboarding/pages/OnboardingPage';
import TourPage from './features/onboarding/pages/TourPage';
import DashboardLayout from './features/dashboards/pages/DashboardLayout';
import DashboardPage from './features/dashboards/pages/DashboardPage';
import ProfilePage from './features/profiles/pages/ProfilePage';
import BillingPage from './features/billing/pages/billing.jsx';
import ChatInterface from './features/aiAssistant/ChatInterface';


import PakkaBillsPage from './features/bills/pages/PakkaBillsPage';
import KachaBillsPage from './features/bills/pages/KachaBillsPage';

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
              {/* Standardized Bill Routes */}
              <Route path="bills">
                <Route path="template" element={<div className="p-8 text-gray-500 font-medium">Bill Templates - Coming Soon</div>} />
                <Route path="pakka" element={<PakkaBillsPage />} />
                <Route path="kacha" element={<KachaBillsPage />} />
              </Route>
              {/* AI ASSISTANT */}
              <Route path='/ai-assistant' element={isAuth ? <ChatInterface /> : <Navigate to="/login" replace />} />
              
              <Route path='/reports' element={<div className="p-8 text-gray-500 font-medium">Business Reports - Coming Soon</div>} />
              <Route path='/billing' element={<BillingPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
  );
}

export default App;