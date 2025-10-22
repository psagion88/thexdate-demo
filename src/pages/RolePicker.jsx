import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function RolePicker() {
  const nav = useNavigate()
  return (
    <div className="pad">
      <div className="stack">
        <h2>Select role</h2>
        <div className="card stack">
          <button className="btn block" onClick={()=>nav('/discover')}>I'm a User</button>
          <button className="btn secondary block" onClick={()=>nav('/discover')}>I'm a Vendor</button>
        </div>
        <div className="muted">Page 2: Select user or vendor</div>
      </div>
    </div>
  )
}
