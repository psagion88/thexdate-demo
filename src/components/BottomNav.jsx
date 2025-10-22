import React from 'react'
import { NavLink } from 'react-router-dom'

const Item = ({ to, icon, label }) => (
  <NavLink to={to} className={({ isActive }) => `navbtn${isActive ? ' active' : ''}`}>
    <div aria-hidden="true" style={{fontSize:16}}>{icon}</div>
    <div>{label}</div>
  </NavLink>
)

export default function BottomNav() {
  return (
    <nav className="bottomnav" role="navigation" aria-label="Primary">
      <Item to="/signup" icon="✨" label="Start" />
      <Item to="/discover" icon="🗺️" label="Discover" />
      <Item to="/vendor-gate" icon="🧾" label="Vendor" />
      <Item to="/profile" icon="👤" label="Profile" />
    </nav>
  )
}
