import React, { useMemo, useState } from 'react'
import { STORE_KEYS, loadJSON, saveJSON, luhnCheck, detectBrand, validateExpiry, validateCVC, maskCard } from '../utils/payments.js'

export default function Payments() {
  const [cards, setCards] = useState(loadJSON(STORE_KEYS.payments, []))
  const [preferredId, setPreferredId] = useState(localStorage.getItem(STORE_KEYS.preferred) || '')
  const [form, setForm] = useState({ number:'', name:'', exp:'', cvc:'', save:true })
  const [err, setErr] = useState('')

  const sorted = useMemo(() => {
    const arr = [...cards]; arr.sort((a,b) => (a.priority ?? 999) - (b.priority ?? 999)); return arr
  }, [cards])

  const addCard = () => {
    setErr('')
    const num = form.number.replace(/\s|-/g,'')
    const brand = detectBrand(num)
    if (!luhnCheck(num)) return setErr('Please enter a valid card number.')
    if (!validateExpiry(form.exp)) return setErr('Invalid expiry (use MM/YY, not expired).')
    if (!validateCVC(form.cvc, brand)) return setErr(`Invalid CVC for ${brand}.`)
    const last4 = num.slice(-4)
    const id = `${brand}-${last4}-${Date.now()}`
    const next = [...cards, { id, brand, last4, label: maskCard(num), exp: form.exp, priority: (cards.length? Math.max(...cards.map(c=>c.priority??0))+1 : 1) }]
    setCards(next); saveJSON(STORE_KEYS.payments, next)
    if (form.save) { localStorage.setItem(STORE_KEYS.preferred, id); setPreferredId(id) }
    setForm({ number:'', name:'', exp:'', cvc:'', save:true })
  }

  const removeCard = (id) => {
    const next = cards.filter(c => c.id !== id)
    setCards(next); saveJSON(STORE_KEYS.payments, next)
    if (preferredId === id) { localStorage.removeItem(STORE_KEYS.preferred); setPreferredId('') }
  }

  const setPreferred = (id) => { localStorage.setItem(STORE_KEYS.preferred, id); setPreferredId(id) }

  const move = (id, dir) => {
    const idx = cards.findIndex(c => c.id === id)
    if (idx < 0) return
    const copy = [...cards]
    const j = dir === 'up' ? idx - 1 : idx + 1
    if (j < 0 || j >= copy.length) return
    const tmp = copy[idx]; copy[idx] = copy[j]; copy[j] = tmp
    copy.forEach((c,i)=> c.priority = i+1)
    setCards(copy); saveJSON(STORE_KEYS.payments, copy)
  }

  return (
    <div className="pad">
      <div className="stack">
        <div className="card">
          <h3>Preferred payment method</h3>
          {sorted.length === 0 ? (
            <div className="muted">No cards yet. Add one below.</div>
          ) : (
            <div className="list">
              {sorted.map(c => (
                <div key={c.id} className="list-item" style={{gridTemplateColumns:'1fr auto auto auto'}}>
                  <div>
                    <strong>{c.brand}</strong> <span className="muted">({c.label})</span>
                    <div className="muted">Exp {c.exp}</div>
                    {preferredId === c.id && <div className="muted">• Preferred</div>}
                  </div>
                  <button className="iconbtn" onClick={()=>move(c.id,'up')}>⬆️</button>
                  <button className="iconbtn" onClick={()=>move(c.id,'down')}>⬇️</button>
                  <div style={{display:'grid', gap:6}}>
                    <button className="btn secondary" onClick={()=>setPreferred(c.id)}>Make Preferred</button>
                    <button className="btn secondary" onClick={()=>removeCard(c.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3>Add a card</h3>
          <div className="form">
            <div className="row">
              <label className="muted">Card number</label>
              <input className="input" inputMode="numeric" placeholder="4242 4242 4242 4242" value={form.number} onChange={(e)=>setForm({...form, number:e.target.value})}/>
            </div>
            <div className="row">
              <label className="muted">Name on card</label>
              <input className="input" placeholder="JANE DOE" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/>
            </div>
            <div className="row h">
              <div>
                <label className="muted">Expiry (MM/YY)</label>
                <input className="input" inputMode="numeric" placeholder="12/29" value={form.exp} onChange={(e)=>setForm({...form, exp:e.target.value})}/>
              </div>
              <div>
                <label className="muted">CVC</label>
                <input className="input" inputMode="numeric" placeholder="123" value={form.cvc} onChange={(e)=>setForm({...form, cvc:e.target.value})}/>
              </div>
            </div>
            <label className="toggle"><input type="checkbox" checked={form.save} onChange={e=>setForm({...form, save:e.target.checked})}/> Save as preferred</label>
            {err && <div className="muted" style={{color:'#b91c1c'}}>{err}</div>}
            <button className="btn" onClick={addCard}>Add card</button>
          </div>
        </div>
      </div>
    </div>
  )
}
