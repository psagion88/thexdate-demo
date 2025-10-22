import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { STORE_KEYS, loadJSON } from '../utils/payments.js'

const PROFILE_KEY = 'thexdate.profile'

export default function Profile() {
  const nav = useNavigate()
  const [role, setRole] = useState(localStorage.getItem('thexdate.role') || 'user')
  const [msg, setMsg] = useState('')

  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null') || {
        displayName: '', email: '', phone: ''
      }
    } catch { return { displayName:'', email:'', phone:'' } }
  })

  useEffect(() => {
    const onRole = () => setRole(localStorage.getItem('thexdate.role') || 'user')
    window.addEventListener('role-changed', onRole)
    return () => window.removeEventListener('role-changed', onRole)
  }, [])

  const bank = loadJSON(STORE_KEYS.bank, null)

  const saveProfile = () => {
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) return setMsg('Please enter a valid email.')
    if (profile.phone && !/^\+?\d[\d\s\-()]{6,}$/.test(profile.phone)) return setMsg('Please enter a valid phone.')
    localStorage.setItem('thexdate.profile', JSON.stringify(profile))
    setMsg('✅ Profile saved.')
    window.dispatchEvent(new Event('role-changed'))
  }

  return (
    <div className="pad">
      <div className="stack">
        <div className="card">
          <h3>Profile</h3>
          <div className="muted">Role: <strong>{role}</strong></div>
        </div>

        <div className="card">
          <h4 style={{margin:'0 0 10px'}}>Your info</h4>
          <div className="form">
            <div className="row">
              <label className="muted">Name</label>
              <input className="input" value={profile.displayName} onChange={e=>setProfile({...profile, displayName:e.target.value})} placeholder="Jane Doe"/>
            </div>
            <div className="row">
              <label className="muted">Email</label>
              <input className="input" type="email" value={profile.email} onChange={e=>setProfile({...profile, email:e.target.value})} placeholder="jane@example.com"/>
            </div>
            <div className="row">
              <label className="muted">Phone</label>
              <input className="input" inputMode="tel" value={profile.phone} onChange={e=>setProfile({...profile, phone:e.target.value})} placeholder="+1 415 555 1234"/>
            </div>
            {msg && <div className="muted" style={{color: msg.startsWith('✅') ? '#065f46' : '#b91c1c'}}>{msg}</div>}
            <div className="row h">
              <button className="btn" onClick={saveProfile}>Save</button>
              <button className="btn secondary" onClick={()=>{ setProfile({displayName:'', email:'', phone:''}); setMsg(''); }}>Clear</button>
            </div>
          </div>
        </div>

        <div className="card stack">
          <button className="btn block" onClick={()=>nav('/payments')}>Payment methods</button>
          <button className="btn secondary block" onClick={()=>nav('/refunds')}>Refunds</button>
        </div>

        {role === 'vendor' && (
          <div className="card stack">
            <button className="btn secondary block" onClick={()=>nav('/vendor-payout')}>Vendor payout account</button>
            {bank && <div className="muted">Linked bank: ••{String(bank.account).slice(-4)}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
