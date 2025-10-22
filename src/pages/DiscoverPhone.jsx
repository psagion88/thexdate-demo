import React, { useEffect, useMemo, useState } from 'react'
import MapView from '../components/MapView.jsx'
import sampleData from '../data/sampleDeals.json'
import StarRating from '../components/StarRating.jsx'
import { getVendorRating } from '../utils/ratings.js'

const itemsKey = 'thexdate.vendorItems'
const profileKey = 'thexdate.vendorProfile'

function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v ?? fallback } catch { return fallback }
}
function haversineKm(a, b) {
  const toRad = (x)=>x*Math.PI/180
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s1 = Math.sin(dLat/2)**2
  const s2 = Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2
  return 2*R*Math.asin(Math.sqrt(s1+s2))
}

export default function DiscoverPhone() {
  const [mode, setMode] = useState('map')
  const [q, setQ] = useState('')
  const [diet, setDiet] = useState('any')
  const [userLoc, setUserLoc] = useState(null)
  const [vendorItems, setVendorItems] = useState([])

  useEffect(() => {
    const handler = () => setVendorItems(loadJSON(itemsKey, []))
    handler()
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLoc(null),
        { enableHighAccuracy: true, timeout: 5000 }
      )
    }
  }, [])

  const items = useMemo(() => {
    const now = Date.now()
    const vendorProfile = loadJSON(profileKey, null)
    const vItems = (vendorItems || []).map(d => ({
      ...d,
      vendor: d.vendor || vendorProfile?.storeName || 'My Store',
      image: d.image || d.img || ''
    }))

    let data = [...sampleData, ...vItems].filter(d => {
      if (d.soldOut) return false
      const exp = new Date(d.expiry).getTime()
      return isFinite(exp) ? exp > now : true
    })

    if (diet !== 'any') data = data.filter(d => d.diet?.includes(diet))
    if (q) {
      const s = q.toLowerCase()
      data = data.filter(d => d.title.toLowerCase().includes(s) || d.vendor.toLowerCase().includes(s))
    }

    if (userLoc) {
      data = data.map(d => ({ ...d, distance_km: haversineKm(userLoc, { lat: d.lat, lng: d.lng }) }))
      data.sort((a,b) => a.distance_km - b.distance_km)
    } else {
      data.sort((a,b) => new Date(a.expiry) - new Date(b.expiry))
    }

    return data
  }, [diet, q, userLoc, vendorItems])

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not available')
    navigator.geolocation.getCurrentPosition(
      (pos)=>setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()=>alert('Could not get your location'),
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }

  const goCheckout = (item) => {
    try { sessionStorage.setItem('thexdate.checkoutItem', JSON.stringify(item)) } catch {}
    location.hash = '#/checkout'
  }

  return (
    <div style={{display:'grid', gridTemplateRows:'auto 1fr', height:'100%'}}>
      <div className="pad">
        <div className="stack">
          <div className="tabs">
            <button className="btn" onClick={()=>setMode('map')} aria-pressed={mode==='map'}>Map</button>
            <button className="btn secondary" onClick={()=>setMode('list')} aria-pressed={mode==='list'}>List</button>
          </div>

          <div className="stack">
            <input className="input" placeholder="Search items or vendors" value={q} onChange={e=>setQ(e.target.value)} />
            <div className="row h">
              <select className="select" value={diet} onChange={e=>setDiet(e.target.value)}>
                <option value="any">Any</option>
                <option value="veg">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
              <button className="btn secondary" onClick={useMyLocation}>Use my location</button>
            </div>
            <div className="muted">Page 3: Map or List {userLoc ? '• using your location' : '• default city'}</div>
          </div>
        </div>
      </div>

      {mode === 'map' ? (
        <MapView items={items} onBuy={goCheckout} />
      ) : (
        <div style={{height:'100%', overflow:'auto', padding:'0 16px 90px 16px', boxSizing:'border-box'}}>
          <div className="list">
            {items.map(item => {
              const r = getVendorRating(item.vendor)
              return (
                <div className="list-item" key={item.id}>
                  <img className="thumb" src={item.image || `https://picsum.photos/seed/${encodeURIComponent(item.title)}/160/110`} alt="" />
                  <div>
                    <div style={{display:'flex', alignItems:'center', gap:6, flexWrap:'wrap'}}>
                      <strong style={{fontSize:14}}>{item.title}</strong>
                      <span className="muted">({item.vendor})</span>
                    </div>
                    <div style={{fontSize:14}}>${Number(item.price).toFixed(2)} {item.originalPrice ? <span className="muted"> (was ${Number(item.originalPrice).toFixed(2)})</span> : null}</div>
                    <div className="muted" style={{fontSize:12}}>
                      Expires {new Date(item.expiry).toLocaleString()}
                      {typeof item.distance_km === 'number' ? ` • ${item.distance_km.toFixed(1)} km away` : ''}
                    </div>
                    <div style={{marginTop:6}}>
                      {r.count ? <StarRating value={r.avg} count={r.count} /> : <span className="muted">No reviews yet</span>}
                      <div style={{marginTop:4}}>
                        <button className="btn small" onClick={()=>goCheckout(item)}>Buy</button>
                      </div>
                    </div>
                  </div>
                  <a className="btn secondary small" href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`} target="_blank" rel="noreferrer">Go</a>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
