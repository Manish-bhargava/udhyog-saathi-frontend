import React from 'react'
import { LandingPage } from './features/landing'
import { LoginPage, SignupPage } from './features/auth'
import { DashboardPage } from './features/dashboard'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/dashboard' element={<DashboardPage />} />
    </Routes>
  )
}

export default App