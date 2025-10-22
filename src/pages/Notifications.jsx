import React, { useEffect, useState } from 'react'

const KEY = 'thexdate.notifications'

// defaults based on stories
const defaults = {
  platform: 'ios',      // 'ios' | 'android' | 'vendor'
  dealsEnabled: false,  // “nearby deal notifications”
  dealsRadiusKm: 5,
  transactEnabled: false, // “transaction notifications”
  vendorEnabled: false,   // vendor purchase alerts
  osGranted: 'default'    // 'default' | 'granted' | 'denied'
}

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') || defaults } catch { return defaults }
}
function save(v) { localStorage.setItem(KEY, JSON.stringify(v)) }

export default function Notifications() {
  const [prefs, setPrefs] = useState(load())
  const [msg, setMsg] = useState('')

  useEffect(() => {
    save(prefs)
  }, [prefs])

  useEffect(() => {
    if ('Notification' in window) {
      setPrefs(p => ({ ...p, osGranted: Notification.permission })) // sync current browser permission
    }
  }, [])

  const requestOSPermission = async () => {
    if (!('Notification' in window)) {
      setMsg('Your browser does not support Notifications API.')
      return
    }
    try {
      const perm = await Notification.requestPermission()
      setPrefs(p => ({ ...p, osGranted: perm }))
      setMsg(perm === 'granted' ? '✅ Notifications allowed.' : 'Notifications not allowed.')
    } catch {
      setMsg('Failed to request permission.')
    }
  }

  const testDeal = () => {
    if (prefs.osGranted !== 'granted') return setMsg('Allow notifications first.')
    new Notification('Nearby deal', { body: `New discount within ${prefs.dealsRadiusKm} km` })
    setMsg('Deal test sent (browser notification).')
  }
  const testTransaction = () => {
    if (prefs.osGranted !== 'granted') return setMsg('Allow notifications first.')
    new Notification('Payment successful', { body: 'Your purchase was completed.' })
    setMsg('Transaction test sent.')
  }
  const testVendor = () => {
    if (prefs.osGranted !== 'granted') return setMsg('Allow notifications first.')
    new Notification('New order received', { body: 'Prepare item #123 for pickup.' })
    setMsg('Vendor test sent.')
  }

  return (
    <div className="pad">
      <div className="stack">

        <div className="card">
          <h3>Notifications</h3>
          <div className="muted">Control alerts per platform and scenario.</div>
        </div>

        <div className="card">
          <div className="form">
            <div className="row">
              <label className="muted">Device platform</label>
              <select
                className="select"
                value={prefs.platform}
                onChange={e=>setPrefs({...prefs, platform:e.target.value})}
              >
                <option value="ios">iPhone (iOS)</option>
                <option value="android">Android</option>
                <option value="vendor">Vendor device</option>
              </select>
            </div>

            <div className="row">
              <label className="muted">OS permission</label>
              <div className="row h">
                <input className="input" disabled value={`Current: ${prefs.osGranted}`} />
                <button className="btn secondary" onClick={requestOSPermission}>Allow notifications</button>
              </div>
              <div className="muted">Browser permission simulates native push opt-in.</div>
            </div>
          </div>
        </div>

        {/* Nearby Deals (iOS + Android) */}
        <div className="card">
          <h4 style={{margin:'0 0 8px'}}>Nearby deal notifications</h4>
          <div className="form">
            <label className="toggle">
              <input
                type="checkbox"
                checked={prefs.dealsEnabled}
                onChange={e=>setPrefs({...prefs, dealsEnabled: e.target.checked})}
              />
              Enable deal notifications near me
            </label>
            <div className="row">
              <label className="muted">Radius (km)</label>
              <input
                className="input"
                inputMode="numeric"
                value={prefs.dealsRadiusKm}
                onChange={e=>setPrefs({...prefs, dealsRadiusKm: Number(e.target.value || 0) })}
              />
            </div>
            <div className="row h">
              <button className="btn" onClick={()=>setMsg('✅ Saved nearby deals preferences.')}>Save</button>
              <button className="btn secondary" onClick={testDeal}>Test nearby deal</button>
            </div>
            <div className="muted">Maps to stories: “Ability to Receive Deal Notifications (iPhone/Android)”.</div>
          </div>
        </div>

        {/* Transaction Success (iOS + Android) */}
        <div className="card">
          <h4 style={{margin:'0 0 8px'}}>Transaction notifications</h4>
          <div className="form">
            <label className="toggle">
              <input
                type="checkbox"
                checked={prefs.transactEnabled}
                onChange={e=>setPrefs({...prefs, transactEnabled: e.target.checked})}
              />
              Notify me when purchases succeed
            </label>
            <div className="row h">
              <button className="btn" onClick={()=>setMsg('✅ Saved transaction preferences.')}>Save</button>
              <button className="btn secondary" onClick={testTransaction}>Test transaction</button>
            </div>
            <div className="muted">Maps to stories: “Enable Transaction Notifications (iPhone/Android)”.</div>
          </div>
        </div>

        {/* Vendor purchase alerts */}
        <div className="card">
          <h4 style={{margin:'0 0 8px'}}>Vendor purchase alerts</h4>
          <div className="form">
            <label className="toggle">
              <input
                type="checkbox"
                checked={prefs.vendorEnabled}
                onChange={e=>setPrefs({...prefs, vendorEnabled: e.target.checked})}
              />
              Alert vendor device when an order is placed
            </label>
            <div className="row h">
              <button className="btn" onClick={()=>setMsg('✅ Saved vendor alert preferences.')}>Save</button>
              <button className="btn secondary" onClick={testVendor}>Test vendor alert</button>
            </div>
            <div className="muted">Maps to story: “Notification Of Purchase Requested (Vendor)”.</div>
          </div>
        </div>

        {msg && <div className="muted" style={{color:'#065f46'}}>{msg}</div>}
      </div>
    </div>
  )
}
