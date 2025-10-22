import React, { useState } from 'react'

export default function Notifications() {
  const [email, setEmail] = useState(true)
  const [push, setPush] = useState(false)
  const [radius, setRadius] = useState(5)

  return (
    <div className="pad">
      <div className="stack">
        <div className="card">
          <h3>Notifications</h3>
          <div className="muted">Control alerts for nearby deals.</div>
        </div>

        <div className="card form">
          <label className="toggle"><input type="checkbox" checked={email} onChange={e=>setEmail(e.target.checked)}/> Email notifications</label>
          <label className="toggle"><input type="checkbox" checked={push} onChange={e=>setPush(e.target.checked)}/> Push notifications</label>
          <div className="row">
            <label className="muted">Radius (km)</label>
            <input className="input" inputMode="numeric" value={radius} onChange={e=>setRadius(e.target.value)}/>
          </div>
          <button className="btn">Save</button>
        </div>
      </div>
    </div>
  )
}
