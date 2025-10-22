import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { STORE_KEYS, loadJSON, saveJSON } from '../utils/payments.js'

export default function Checkout() {
  const nav = useNavigate()
  const [item, setItem] = useState(null)
  const [cards] = useState(loadJSON(STORE_KEYS.payments, []))
  const [preferredId] = useState(localStorage.getItem(STORE_KEYS.preferred) || '')
  const [methodId, setMethodId] = useState(preferredId || (cards[0]?.id || ''))
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    try { const raw = sessionStorage.getItem('thexdate.checkoutItem'); if (raw) setItem(JSON.parse(raw)) } catch {}
  }, [])

  const selected = useMemo(()=> cards.find(c=>c.id===methodId) || null, [cards, methodId])

  const placeOrder = () => {
    if (!item || !selected) return alert('Please add/select a payment method.')
    setStatus('processing')
    setTimeout(() => {
      const orders = loadJSON(STORE_KEYS.orders, [])
      const id = `ord_${Date.now()}`
      orders.push({
        id, title: item.title, vendor: item.vendor, amount: item.price,
        methodLabel: `${selected.brand} ${selected.label}`, status: 'paid', createdAt: Date.now(),
      })
      saveJSON(STORE_KEYS.orders, orders)
      setStatus('done')
      alert('Order placed! Manage refunds under Profile → Refunds.')
      nav('/discover')
    }, 600)
  }

  return (
    <div className="pad">
      <div className="stack">
        <div className="card">
          <h3>Checkout</h3>
          {item ? (
            <>
              <div><strong>{item.title}</strong> <span className="muted">({item.vendor})</span></div>
              <div><strong>${Number(item.price).toFixed(2)}</strong></div>
            </>
          ) : <div className="muted">No item selected.</div>}
        </div>

        <div className="card">
          <div className="stack">
            <div style={{fontWeight:700, marginBottom:4}}>Payment method</div>
            {cards.length === 0 ? (
              <>
                <div className="muted">No saved cards. Add one first.</div>
                <a className="btn secondary" href="#/payments">Add a card</a>
              </>
            ) : (
              <div className="list">
                {cards.map(c => (
                  <label key={c.id} className="list-item" style={{gridTemplateColumns:'auto 1fr auto'}}>
                    <input type="radio" name="pm" checked={methodId===c.id} onChange={()=>setMethodId(c.id)} />
                    <div>
                      <strong>{c.brand}</strong> <span className="muted">({c.label})</span>
                      <div className="muted">Exp {c.exp}</div>
                    </div>
                    {c.id === preferredId ? <span className="muted">Preferred</span> : null}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="btn" disabled={!item || status==='processing'} onClick={placeOrder}>
          {status==='processing' ? 'Processing…' : 'Pay now'}
        </button>
      </div>
    </div>
  )
}
