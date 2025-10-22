import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
export default function SignupGoogleMock() {
  const nav = useNavigate()
  const { signIn } = useAuth()
  const completeOAuth = () => {
    const user = { id: 'g-' + Math.random().toString(36).slice(2,8), provider: 'google', email: 'user@example.com', name: 'Google User', email_verified: true }
    signIn(user); nav('/')
  }
  return (
    <div className="list" style={{maxWidth:540}}>
      <h2>Google Sign Up (Mock)</h2>
      <ol>
        <li>Open Sign Up options</li>
        <li>Redirect to Google OAuth (simulated)</li>
        <li>Consent → receive ID token (simulated)</li>
        <li>Verify token → create user (simulated)</li>
      </ol>
      <button className="btn" onClick={completeOAuth}>Complete OAuth & Sign In</button>
    </div>
  )
}