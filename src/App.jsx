import React from 'react'
import { LandingPage } from './features/landing'
import { LoginPage, SignupPage } from './features/auth'
import { DashboardPage } from './features/dashboard'
import PrivateRoute from './features/auth/components/PrivateRoute'
import { AuthProvider } from './features/auth/context/AuthContext'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/dashboard' element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App