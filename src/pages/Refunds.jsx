import React, { useEffect, useState } from 'react'
import { STORE_KEYS, loadJSON, saveJSON } from '../utils/payments.js'

export default function Refunds() {
  const [orders, setOrders] = useState(loadJSON(STORE_KEYS.orders, []))
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const t = setInterval(() => setOrders(loadJSON(STORE_KEYS.orders, [])), 1000)
    return () => clearInterval(t)
  }, [])

  const startRefund = (id, to = 'original') => {
    setMsg('')
    const copy = orders.map(o => o.id === id ? { ...o, refund: { to, status: 'started', startedAt: Date.now() } } : o)
    setOrders(copy); saveJSON(STORE_KEYS.orders, copy)
    setTimeout(()=>updateStatus(id,'in_progress'), 700)
    setTimeout(()=>updateStatus(id,'completed'), 1600)
  }

  const updateStatus = (id, status) => {
    const copy = loadJSON(STORE_KEYS.orders, []).map(o =>
      o.id === id && o.refund ? { ...o, refund: { ...o.refund, status } } : o
    )
    setOrders(copy); saveJSON(STORE_KEYS.orders, copy)
    if (status==='completed') setMsg('✅ Refund completed.')
  }

  return (
    <div className="pad">
      <div className="stack">
        <div className="card">
          <h3>Refunds</h3>
          <div className="muted">Choose refund destination and see status.</div>
        </div>

        {orders.length === 0 ? (
          <div className="card"><div className="muted">No orders yet. Make a purchase first.</div></div>
        ) : (
          <div className="list">
            {orders.map(o => (
              <div className="list-item" key={o.id} style={{gridTemplateColumns:'1fr auto'}}>
                <div>
                  <strong>{o.title}</strong> <span className="muted">({o.vendor})</span>
                  <div className="muted">${Number(o.amount).toFixed(2)} • {o.methodLabel}</div>
                  {o.refund ? (
                    <div className="muted">Refund: {o.refund.to} • {o.refund.status.replace('_',' ')}</div>
                  ) : (
                    <div className="row h" style={{marginTop:8}}>
                      <button className="btn secondary" onClick={()=>startRefund(o.id,'account_credit')}>Account credit</button>
                      <button className="btn secondary" onClick={()=>startRefund(o.id,'original')}>Original method</button>
                    </div>
                  )}
                </div>
                <div className="muted" title={new Date(o.createdAt).toLocaleString()}>
                  {new Date(o.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {msg && <div className="muted" style={{color:'#065f46'}}>{msg}</div>}
      </div>
    </div>
  )
}
