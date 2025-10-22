import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
export default function SignupEmailMock() {
  const nav = useNavigate()
  const { signIn } = useAuth()
  const [step, setStep] = useState(1)
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const create = () => {
    if (pw !== pw2 || pw.length < 8) return alert('Passwords must match and be 8+ chars.')
    const user = { id: 'e-' + Math.random().toString(36).slice(2,8), provider: 'email', email, name: `${first} ${last}`, email_verified: true }
    signIn(user); nav('/')
  }
  return (
    <div className="list" style={{maxWidth:520}}>
      <h2>Email Sign Up (Mock)</h2>
      {step === 1 && (
        <div className="list-item" style={{display:'block'}}>
          <label>First Name<br/><input value={first} onChange={e=>setFirst(e.target.value)} /></label><br/><br/>
          <label>Last Name<br/><input value={last} onChange={e=>setLast(e.target.value)} /></label><br/><br/>
          <label>Email<br/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} /></label><br/><br/>
          <button className="btn" onClick={()=>setStep(2)} disabled={!first||!last||!email}>Continue</button>
        </div>
      )}
      {step === 2 && (
        <div className="list-item" style={{display:'block'}}>
          <label>Password<br/><input type="password" value={pw} onChange={e=>setPw(e.target.value)} /></label><br/><br/>
          <label>Re-enter Password<br/><input type="password" value={pw2} onChange={e=>setPw2(e.target.value)} /></label><br/><br/>
          <button className="btn" onClick={create}>Create Account</button>
        </div>
      )}
    </div>
  )
}