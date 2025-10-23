import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/MapView.jsx'
import dealsData from '../data/sampleDeals.json'
import StarRating from '../components/StarRating.jsx'
import { getVendorRating } from '../utils/ratings.js'

function fallbackThumb(item) {
  const seed = encodeURIComponent(`${item.type || 'food'}-${item.title || item.vendor || 'item'}`)
  return `https://picsum.photos/seed/${seed}/320/200`
}

export default function DiscoverPhone() {
  const nav = useNavigate()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [mode, setMode] = useState('map') // 'map' | 'list'
  const [userCenter, setUserCenter] = useState(null)
  const [msg, setMsg] = useState('')

  const types = useMemo(() => {
    const set = new Set(dealsData.map(d => d.type).filter(Boolean))
    return ['all', ...Array.from(set).sort()]
  }, [])

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return dealsData.filter(d => {
      const okType = type === 'all' || d.type === type
      const okQ = !q || d.title.toLowerCase().includes(q) || d.vendor.toLowerCase().includes(q)
      return okType && okQ
    })
  }, [query, type])

  const goCheckout = (item) => {
    try { sessionStorage.setItem('thexdate.checkoutItem', JSON.stringify(item)) } catch {}
    nav('/checkout')
  }

  const useMyLocation = () => {
    setMsg('')
    if (!('geolocation' in navigator)) {
      setMsg('Geolocation not supported in this browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const c = [pos.coords.latitude, pos.coords.longitude]
        setUserCenter(c)
        setMode('map')
        setMsg('Centered on your location.')
      },
      err => setMsg('Location error: ' + (err?.message || 'permission denied')),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  return (
    <div className="pad">
      <div className="stack">
        <div className="card">
          <div className="form">
            <div className="row h">
              <input
                className="input"
                placeholder="Search title or vendor…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select className="select" value={type} onChange={e => setType(e.target.value)}>
                {types.map(t => (
                  <option key={t} value={t}>
                    {t === 'all' ? 'All types' : t}
                  </option>
                ))}
              </select>
            </div>
            <div className="row h">
              <div className="tabs" style={{ width: '100%' }}>
                <button className={`btn ${mode === 'map' ? '' : 'secondary'}`} style={{ flex: 1 }} onClick={() => setMode('map')}>Map</button>
                <button className={`btn ${mode === 'list' ? '' : 'secondary'}`} style={{ flex: 1 }} onClick={() => setMode('list')}>List</button>
              </div>
              <button className="btn secondary" onClick={useMyLocation}>📍 Use my location</button>
            </div>
            {msg && <div className="muted">{msg}</div>}
          </div>
        </div>

        {mode === 'map' ? (
          <div className="card" style={{ padding: 0 }}>
            <div style={{ height: 420 }}>
              <MapView items={items} onBuy={goCheckout} center={userCenter} />
            </div>
          </div>
        ) : (
          <div className="list">
            {items.map(item => {
              const r = getVendorRating(item.vendor)
              const img = item.image || fallbackThumb(item)
              return (
                <div key={item.id} className="list-item" style={{ gridTemplateColumns: '72px 1fr auto' }}>
                  <img
                    className="thumb"
                    alt=""
                    src={img}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = fallbackThumb(item) }}
                  />
                  <div>
                    <div><strong>{item.title}</strong> <span className="muted">• {item.type}</span></div>
                    <div className="muted">{item.vendor}</div>
                    {r.count ? <StarRating value={r.avg} count={r.count} /> : <span className="muted">No reviews yet</span>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div><strong>${Number(item.price).toFixed(2)}</strong></div>
                    <button className="btn small" onClick={() => goCheckout(item)} style={{ marginTop: 6 }}>Buy</button>
                  </div>
                </div>
              )
            })}
            {items.length === 0 && (
              <div className="muted" style={{ padding: 8 }}>No results. Try “All types” or clear the search.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
