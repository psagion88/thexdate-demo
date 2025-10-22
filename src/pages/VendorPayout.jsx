import React, { useState } from 'react'
import { STORE_KEYS, loadJSON, saveJSON, validateRouting, validateAccount } from '../utils/payments.js'

export default function VendorPayout() {
  const [bank, setBank] = useState(loadJSON(STORE_KEYS.bank, null) || { routing:'', account:'', name:'' })
  const [msg, setMsg] = useState('')

  const save = () => {
    setMsg('')
    if (!validateRouting(bank.routing)) return setMsg('Invalid routing number.')
    if (!validateAccount(bank.account)) return setMsg('Invalid account number.')
    saveJSON(STORE_KEYS.bank, bank)
    setMsg('✅ Bank linked successfully.')
  }

  const unlink = () => {
    localStorage.removeItem(STORE_KEYS.bank)
    setBank({ routing:'', account:'', name:'' })
    setMsg('Bank link removed.')
  }

  return (
    <div className="pad">
      <div className="stack">
        <div className="card">
          <h3>Payout account</h3>
          <div className="muted">Link your business checking account to receive payments.</div>
        </div>

        <div className="card">
          <div className="form">
            <div className="row">
              <label className="muted">Account holder name</label>
              <input className="input" placeholder="Acme Foods LLC" value={bank.name} onChange={e=>setBank({...bank, name:e.target.value})}/>
            </div>
            <div className="row h">
              <div>
                <label className="muted">Routing number</label>
                <input className="input" inputMode="numeric" placeholder="123456789" value={bank.routing} onChange={e=>setBank({...bank, routing:e.target.value})}/>
              </div>
              <div>
                <label className="muted">Account number</label>
                <input className="input" inputMode="numeric" placeholder="000123456789" value={bank.account} onChange={e=>setBank({...bank, account:e.target.value})}/>
              </div>
            </div>
            {msg && <div className="muted" style={{color: msg.startsWith('✅') ? '#065f46' : '#b91c1c'}}>{msg}</div>}
            <div className="row h">
              <button className="btn" onClick={save}>Save</button>
              <button className="btn secondary" onClick={unlink}>Unlink</button>
            </div>
          </div>
        </div>

        {bank?.routing && bank?.account && (
          <div className="card">
            <div><strong>Linked bank:</strong> ••{String(bank.account).slice(-4)} (routing ••{String(bank.routing).slice(-2)})</div>
            <div className="muted">Shown on your vendor profile as your payout destination.</div>
          </div>
        )}
      </div>
    </div>
  )
}
