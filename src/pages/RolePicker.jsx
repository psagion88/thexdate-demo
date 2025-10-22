import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function RolePicker() {
  const nav = useNavigate()
  const pick = (r) => {
    localStorage.setItem('thexdate.role', r)
    window.dispatchEvent(new Event('role-changed'))
    if (r === 'vendor') nav('/vendor-gate')
    else nav('/discover')
  }
  return (
    <div className="pad">
      <div className="stack">
        <div className="card" style={{textAlign:'center'}}>
          <h3>Choose your role</h3>
          <div className="muted">Page 2: Select user or vendor</div>
        </div>
        <button className="btn block" onClick={()=>pick('user')}>I'm a User</button>
        <button className="btn secondary block" onClick={()=>pick('vendor')}>I'm a Vendor</button>
      </div>
    </div>
  )
}
