import React from 'react'
import { Link } from 'react-router-dom'
export default function SignupOptions() {
  return (
    <div className="list" style={{maxWidth:520}}>
      <h2>Sign Up</h2>
      <div className="list-item"><Link to="/signup/google" className="btn">Continue with Google (mock)</Link></div>
      <div className="list-item"><Link to="/signup/email" className="btn secondary">Continue with Email</Link></div>
      <div className="muted">Demo flows are mocked per your stories.</div>
    </div>
  )
}