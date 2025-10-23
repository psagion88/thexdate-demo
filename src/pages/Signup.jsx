import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const nav = useNavigate()
  const [emailMode, setEmailMode] = useState(false)
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'' })
  const [msg, setMsg] = useState('')

  const finish = (profile) => {
    try { localStorage.setItem('thexdate.profile', JSON.stringify(profile)) } catch {}
    nav('/role')
  }

  const google = () => {
    // Mock Google — save no name
    finish({ displayName: '', email: 'user@example.com', phone: '' })
  }
  const apple = () => {
    // Mock Apple — save no name
    finish({ displayName: '', email: 'user@icloud.com', phone: '' })
  }

  const emailSubmit = () => {
    setMsg('')
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setMsg('Enter a valid email.')
    if (!form.password || form.password.length < 6) return setMsg('Password must be at least 6 characters.')
    const name = [form.firstName, form.lastName].filter(Boolean).join(' ').trim()
    finish({ displayName: name || '', email: form.email, phone: '' })
  }

  return (
    <div className="pad">
      <div className="stack">
        <div className="card" style={{textAlign:'center'}}>
          <h2 style={{margin:'4px 0'}}>The X Date</h2>
          <div className="muted">Buy discounted food before it expires.</div>
        </div>

        {!emailMode ? (
          <>
            <div className="card stack">
              <button className="btn block" onClick={google}>Continue with Google</button>
              <button className="btn secondary block" onClick={apple}>Continue with Apple</button>
              <button className="btn secondary block" onClick={()=>setEmailMode(true)}>Continue with Email</button>
              <div className="muted">No password yet? Choose any method to get started.</div>
            </div>
          </>
        ) : (
          <div className="card">
            <h3 style={{marginTop:0}}>Create account (Email)</h3>
            <div className="form">
              <div className="row h">
                <input className="input" placeholder="First name" value={form.firstName} onChange={e=>setForm({...form, firstName:e.target.value})}/>
                <input className="input" placeholder="Last name" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})}/>
              </div>
              <div className="row">
                <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
              </div>
              <div className="row">
                <input className="input" type="password" placeholder="Create password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
              </div>
              {msg && <div className="muted" style={{color:'#b91c1c'}}>{msg}</div>}
              <div className="row h">
                <button className="btn" onClick={emailSubmit}>Create account</button>
                <button className="btn secondary" onClick={()=>setEmailMode(false)}>Back</button>
              </div>
            </div>
          </div>
        )}

        <div className="card stack">
          <button className="btn block" onClick={()=>nav('/role')}>Skip for now</button>
          <div className="muted">You can complete your profile later.</div>
        </div>
      </div>
    </div>
  )
}
