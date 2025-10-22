import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import RolePicker from './pages/RolePicker.jsx'
import DiscoverPhone from './pages/DiscoverPhone.jsx'

export default function App() {
  return (
    <div className="iphone">
      <div className="notch"></div>
      <div className="screen">
        <div className="statusbar">
          <span>9:41</span>
          <span>🔋 ▰▰▰</span>
        </div>
        <div className="appbar">The X Date</div>
        <div className="page">
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/role" element={<RolePicker />} />
            <Route path="/discover" element={<DiscoverPhone />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
