// src/App.jsx
import React from 'react'
import { LandingPage } from './features/landing'
import { LoginPage, SignupPage } from './features/auth'
import { DashboardPage } from './features/dashboard'
import { ProfilePage } from './features/profile'
import PrivateRoute from './features/auth/components/PrivateRoute'
import { AuthProvider } from './features/auth/context/AuthContext'
import { Route, Routes } from 'react-router-dom'
import TestAPI from './features/auth/pages/TestAPI'
import DashboardLayout from './features/dashboard/components/DashboardLayout'
import TestBackendRoutes from './features/auth/pages/TestBackendRoutes.jsx';
import { 
  KachaBillsPage, 
  PakkaBillsPage, 
  AllBillsPage 
} from './features/bills'
import ChatInterface from './features/aiAssistant/ChatInterface'  

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/test-api' element={<TestAPI />} />
        <Route path="/test-routes" element={<TestBackendRoutes />} />
        
        {/* Dashboard Layout for all authenticated routes */}
        <Route element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/bills/kacha' element={<KachaBillsPage />} />
          <Route path='/bills/pakka' element={<PakkaBillsPage />} />
          <Route path='/bills/all' element={<AllBillsPage />} />
          <Route path='/customers' element={<div className="p-6">Customers Page Coming Soon</div>} />
          <Route path='/bills' element={<div className="p-6">Bills Page Coming Soon</div>} />
          
          <Route path='/reports' element={<div className="p-6">Reports Page Coming Soon</div>} />
          <Route path='/settings' element={<div className="p-6">Settings Page Coming Soon</div>} />
        </Route>
        <Route path='/ai-assistant' element={<ChatInterface/>} />
      </Routes>
    </AuthProvider>
  )
}

export default App