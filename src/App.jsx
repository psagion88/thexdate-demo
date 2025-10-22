import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import RolePicker from './pages/RolePicker.jsx'
import DiscoverPhone from './pages/DiscoverPhone.jsx'
import Profile from './pages/Profile.jsx'
import Notifications from './pages/Notifications.jsx'
import Vendor from './pages/Vendor.jsx'
import VendorGate from './pages/VendorGate.jsx'
import Payments from './pages/Payments.jsx'
import Checkout from './pages/Checkout.jsx'
import Refunds from './pages/Refunds.jsx'
import VendorPayout from './pages/VendorPayout.jsx'
import BottomNav from './components/BottomNav.jsx'

function AppShell({ children }) {
  const nav = useNavigate()
  const loc = useLocation()
  const [role, setRole] = useState(null)
  const [name, setName] = useState(null)

  useEffect(() => {
    const readRole = () => setRole(localStorage.getItem('thexdate.role'))
    const readProfile = () => {
      try {
        const profile = JSON.parse(localStorage.getItem('thexdate.profile') || 'null')
        setName(profile?.displayName || profile?.firstName || null)
      } catch { setName(null) }
    }
    readRole(); readProfile()
    const onRoleChanged = () => { readRole(); readProfile() }
    window.addEventListener('role-changed', onRoleChanged)
    return () => window.removeEventListener('role-changed', onRoleChanged)
  }, [loc.pathname])

  return (
    <div className="iphone">
      <div className="notch"></div>
      <div className="screen">
        <div className="statusbar">
          <span>9:41</span>
          <span>🔋 ▰▰▰</span>
        </div>
        <div className="appbar">
          <div className="left">
            <button className="iconbtn" onClick={() => nav('/signup')}>🏠 Home</button>
          </div>
          <div className="center">
            The X Date
            {role ? <span className="badge">• {role}{name ? ` (${name})` : ''}</span> : null}
          </div>
          <div className="right">
            {role === 'vendor' && (
              <button className="iconbtn primary" onClick={() => nav('/vendor')}>➕ Add</button>
            )}
            <button className="iconbtn" onClick={() => nav('/profile')}>👤</button>
            <button className="iconbtn" onClick={() => nav('/notifications')}>🔔</button>
          </div>
        </div>

        <div className="page" style={{ paddingBottom: 84 }}>
          <div className="narrow">{children}</div>
        </div>

        <BottomNav/>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<AppShell><Signup /></AppShell>} />
      <Route path="/role" element={<AppShell><RolePicker /></AppShell>} />
      <Route path="/discover" element={<AppShell><DiscoverPhone /></AppShell>} />
      <Route path="/checkout" element={<AppShell><Checkout /></AppShell>} />
      <Route path="/payments" element={<AppShell><Payments /></AppShell>} />
      <Route path="/refunds" element={<AppShell><Refunds /></AppShell>} />
      <Route path="/vendor-gate" element={<AppShell><VendorGate /></AppShell>} />
      <Route path="/vendor" element={<AppShell><Vendor /></AppShell>} />
      <Route path="/vendor-payout" element={<AppShell><VendorPayout /></AppShell>} />
      <Route path="/profile" element={<AppShell><Profile /></AppShell>} />
      <Route path="/notifications" element={<AppShell><Notifications /></AppShell>} />
      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  )
}
