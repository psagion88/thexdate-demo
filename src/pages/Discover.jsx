import React, { useMemo, useState } from 'react'
import MapView from '../components/MapView.jsx'
import sampleData from '../data/sampleDeals.json'
export default function Discover() {
  const [mode, setMode] = useState('map')
  const [sort, setSort] = useState('distance')
  const [q, setQ] = useState('')
  const [diet, setDiet] = useState('any')
  const items = useMemo(() => {
    let data = sampleData
    if (diet !== 'any') data = data.filter(d => d.diet?.includes(diet))
    if (q) { const s = q.toLowerCase(); data = data.filter(d => d.title.toLowerCase().includes(s) || d.vendor.toLowerCase().includes(s)) }
    if (sort === 'price') data = [...data].sort((a,b)=>a.price-b.price)
    if (sort === 'expiry') data = [...data].sort((a,b)=> new Date(a.expiry)-new Date(b.expiry))
    return data
  }, [diet, sort, q])
  return (
    <div className="container">
      <div className="controls" role="region" aria-label="Discover controls">
        <input placeholder="Search items or vendors" value={q} onChange={e=>setQ(e.target.value)} />
        <select value={diet} onChange={e=>setDiet(e.target.value)}>
          <option value="any">Any</option>
          <option value="veg">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="distance">Sort: Distance (mock)</option>
          <option value="price">Sort: Price</option>
          <option value="expiry">Sort: Expiry</option>
        </select>
        <button className="btn secondary" onClick={()=>setMode('map')} aria-pressed={mode==='map'}>Map</button>
        <button className="btn secondary" onClick={()=>setMode('list')} aria-pressed={mode==='list'}>List</button>
      </div>
      {mode === 'map' ? (
        <MapView items={items} />
      ) : (
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
      )}
    </div>
  )
}