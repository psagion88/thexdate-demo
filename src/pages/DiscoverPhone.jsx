import React, { useMemo, useState } from 'react'
import MapView from '../components/MapView.jsx'
import sampleData from '../data/sampleDeals.json'

export default function DiscoverPhone() {
  const [mode, setMode] = useState('map')
  const [q, setQ] = useState('')
  const [diet, setDiet] = useState('any')

  const items = useMemo(() => {
    let data = sampleData
    if (diet !== 'any') data = data.filter(d => d.diet?.includes(diet))
    if (q) {
      const s = q.toLowerCase()
      data = data.filter(d => d.title.toLowerCase().includes(s) || d.vendor.toLowerCase().includes(s))
    }
    return data
  }, [diet, q])

  return (
    <div style={{display:'grid', gridTemplateRows:'auto 1fr', height:'100%'}}>
      <div className="pad">
        <div className="stack">
          <div className="tabs">
            <button className="btn" onClick={()=>setMode('map')} aria-pressed={mode==='map'}>Map</button>
            <button className="btn secondary" onClick={()=>setMode('list')} aria-pressed={mode==='list'}>List</button>
          </div>
          <input placeholder="Search items or vendors" value={q}
            onChange={e=>setQ(e.target.value)}
            style={{padding:'10px',border:'1px solid #e6e6e6',borderRadius:'12px'}} />
          <select value={diet} onChange={e=>setDiet(e.target.value)}
            style={{padding:'10px',border:'1px solid #e6e6e6',borderRadius:'12px'}}>
            <option value="any">Any</option>
            <option value="veg">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
          <div className="muted">Page 3: Map or List (like website)</div>
        </div>
      </div>

      {mode === 'map' ? (
        <MapView items={items} />
      ) : (
        <div className="pad">
          <div className="list">
            {items.map(item => (
              <div className="list-item" key={item.id}>
                <div>
                  <div><strong>{item.title}</strong> — ${item.price.toFixed(2)} <span className="muted">({item.vendor})</span></div>
                  <div className="muted">Expires {new Date(item.expiry).toLocaleString()} • {item.distance_km} km away</div>
                </div>
                <a className="btn" href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`} target="_blank" rel="noreferrer">Directions</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
