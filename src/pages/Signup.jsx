import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const nav = useNavigate()
  return (
    <div className="pad">
      <div className="stack">
        <h2>Sign up</h2>
        <div className="card stack">
          <button className="btn block" onClick={()=>nav('/role')}>Continue with Google</button>
          <button className="btn secondary block" onClick={()=>nav('/role')}>Continue with Email</button>
          <div className="muted">Demo mode — flows are mocked.</div>
        </div>
        <div className="muted">Page 1: Signup</div>
      </div>
    </div>
  )
}
