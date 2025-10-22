import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function VendorGate() {
  const nav = useNavigate()
  const goVendor = () => {
    localStorage.setItem('thexdate.role', 'vendor')
    window.dispatchEvent(new Event('role-changed'))
    nav('/vendor')
  }
  const goUser = () => {
    localStorage.setItem('thexdate.role', 'user')
    window.dispatchEvent(new Event('role-changed'))
    nav('/discover')
  }
  return (
    <div className="pad">
      <div className="stack">
        <div className="card" style={{textAlign:'center'}}>
          <h2>Continue as…</h2>
          <div className="muted">Vendor tools or user browsing</div>
        </div>
        <div className="card stack">
          <button className="btn block" onClick={goVendor}>I’m a Vendor</button>
          <div className="muted">Set up your store and post items</div>
        </div>
        <div className="card stack">
          <button className="btn secondary block" onClick={goUser}>I’m a User</button>
          <div className="muted">Browse nearby discounted items</div>
        </div>
      </div>
    </div>
  )
}
