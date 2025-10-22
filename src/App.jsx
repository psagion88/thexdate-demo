import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Discover from './pages/Discover.jsx'
import SignupOptions from './pages/SignupOptions.jsx'
import SignupGoogleMock from './pages/SignupGoogleMock.jsx'
import SignupEmailMock from './pages/SignupEmailMock.jsx'
import VendorDashboard from './pages/VendorDashboard.jsx'
import { AuthProvider, useAuth } from './auth/AuthContext.jsx'

function TopBar() {
  const { user, signOut } = useAuth()
  return (
    <div className="topbar">
      <div className="brand">The X Date — Demo</div>
      <div className="spacer" />
      <div className="nav">
        <Link to="/">Discover</Link>
        <Link to="/vendor">Vendor</Link>
        <Link to="/signup">Sign Up</Link>
        {user ? (
          <button className="btn secondary" onClick={signOut}>Sign out ({user.provider})</button>
        ) : null}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="layout">
        <TopBar />
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/signup" element={<SignupOptions />} />
          <Route path="/signup/google" element={<SignupGoogleMock />} />
          <Route path="/signup/email" element={<SignupEmailMock />} />
          <Route path="/vendor" element={<VendorDashboard />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}