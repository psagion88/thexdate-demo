import React, { useEffect, useMemo, useState } from 'react'

const profileKey = 'thexdate.vendorProfile'
const itemsKey = 'thexdate.vendorItems'

function loadJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key) || 'null'); return v ?? fallback } catch { return fallback }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export default function Vendor() {
  const [profile, setProfile] = useState(() => loadJSON(profileKey, {
    storeName: 'My Store', address: '', phone: '', lat: null, lng: null,
  }))
  const [msg, setMsg] = useState('')
  const [item, setItem] = useState({ title:'', description:'', price:'', originalPrice:'', qty:1, expiryDate:'', imageData:'' })
  const [items, setItems] = useState(() => loadJSON(itemsKey, []))

  useEffect(() => {
    const onChange = () => setItems(loadJSON(itemsKey, []))
    window.addEventListener('storage', onChange)
    return () => window.removeEventListener('storage', onChange)
  }, [])

  const hasCoords = useMemo(() => Number.isFinite(profile.lat) && Number.isFinite(profile.lng), [profile.lat, profile.lng])

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not available')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setProfile(p => ({ ...p, lat: pos.coords.latitude, lng: pos.coords.longitude }))
        setMsg('✅ Location captured.')
      },
      () => alert('Could not get your location'),
      { enableHighAccuracy: true, timeout: 5000 }
    )
  }

  const saveProfileClick = () => {
    if (!profile.storeName) return setMsg('Please enter your store name.')
    if (!profile.address) return setMsg('Please enter your store address.')
    if (profile.phone && !/^\+?\d[\d\s\-()]{6,}$/.test(profile.phone)) return setMsg('Please enter a valid phone.')
    saveJSON(profileKey, profile)
    setMsg('✅ Store profile saved.')
  }

  const onImageFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setItem(prev => ({ ...prev, imageData: reader.result }))
    reader.readAsDataURL(file)
  }

  const postItem = () => {
    setMsg('')
    if (!item.title) return setMsg('Please enter a title.')
    if (!item.price || isNaN(item.price)) return setMsg('Please enter a valid price.')
    if (!item.qty || isNaN(item.qty) || item.qty < 1) return setMsg('Please enter a valid quantity (>=1).')
    if (!item.expiryDate) return setMsg('Please choose an expiry date.')
    const [y,m,d] = item.expiryDate.split('-').map(Number)
    const expiry = new Date(y, m-1, d, 23, 59, 0)

    const newItem = {
      id: `v_${Date.now()}`,
      vendor: profile.storeName || 'My Store',
      address: profile.address || '',
      lat: hasCoords ? profile.lat : 37.7749,
      lng: hasCoords ? profile.lng : -122.4194,
      title: item.title,
      description: item.description || '',
      price: Number(item.price),
      originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
      qty: Number(item.qty),
      expiry: expiry.toISOString(),
      soldOut: false,
      image: item.imageData || '',
      diet: []
    }

    const next = [newItem, ...items]
    setItems(next); saveJSON(itemsKey, next)
    setItem({ title:'', description:'', price:'', originalPrice:'', qty:1, expiryDate:'', imageData:'' })
    setMsg('✅ Item posted to the map/list.')
  }

  const markSoldOut = (id) => {
    const next = items.map(it => it.id === id ? { ...it, soldOut: true } : it)
    setItems(next); saveJSON(itemsKey, next)
  }
  const removeItem = (id) => {
    const next = items.filter(it => it.id !== id)
    setItems(next); saveJSON(itemsKey, next)
  }

  return (
    <div className="pad">
      <div className="stack">

        <div className="card">
          <h3>Store profile</h3>
          <div className="form">
            <div className="row">
              <label className="muted">Store name</label>
              <input className="input" value={profile.storeName} onChange={e=>setProfile(p=>({...p, storeName:e.target.value}))} placeholder="My Store"/>
            </div>
            <div className="row">
              <label className="muted">Address</label>
              <input className="input" value={profile.address} onChange={e=>setProfile(p=>({...p, address:e.target.value}))} placeholder="123 Main St, City, State"/>
            </div>
            <div className="row">
              <label className="muted">Phone</label>
              <input className="input" inputMode="tel" value={profile.phone} onChange={e=>setProfile(p=>({...p, phone:e.target.value}))} placeholder="+1 415 555 1234"/>
            </div>
            <div className="row h">
              <button className="btn secondary" onClick={useMyLocation}>Use my location</button>
              <button className="btn" onClick={saveProfileClick}>Save profile</button>
            </div>
            <div className="muted">
              {hasCoords ? `Location set • ${profile.lat?.toFixed(4)}, ${profile.lng?.toFixed(4)}` : 'Tip: set your location so items appear on the map'}
            </div>
            {msg && <div className="muted" style={{color: msg.startsWith('✅') ? '#065f46' : '#b91c1c'}}>{msg}</div>}
          </div>
        </div>

        <div className="card">
          <h3>Post an item</h3>
          <div className="form">
            <div className="row">
              <label className="muted">Title</label>
              <input className="input" value={item.title} onChange={e=>setItem({...item, title:e.target.value})} placeholder="Sandwich combo"/>
            </div>

            <div className="row">
              <label className="muted">Description</label>
              <textarea className="textarea" value={item.description} onChange={e=>setItem({...item, description:e.target.value})} placeholder="Short description, ingredients, pickup window."/>
            </div>

            <div className="row">
              <label className="muted">Image</label>
              <input className="input" type="file" accept="image/*" onChange={e=>onImageFile(e.target.files?.[0])}/>
              {item.imageData && (
                <img src={item.imageData} alt="preview" style={{marginTop:8, width:'100%', height:140, objectFit:'cover', borderRadius:10, border:'1px solid var(--border)'}}/>
              )}
            </div>

            <div className="row h">
              <div>
                <label className="muted">Price</label>
                <input className="input" inputMode="decimal" value={item.price} onChange={e=>setItem({...item, price:e.target.value})} placeholder="4.99"/>
              </div>
              <div>
                <label className="muted">Was (optional)</label>
                <input className="input" inputMode="decimal" value={item.originalPrice} onChange={e=>setItem({...item, originalPrice:e.target.value})} placeholder="8.99"/>
              </div>
            </div>

            <div className="row h">
              <div>
                <label className="muted">Quantity</label>
                <input className="input" inputMode="numeric" value={item.qty} onChange={e=>setItem({...item, qty:e.target.value})}/>
              </div>
              <div>
                <label className="muted">Expiry (date)</label>
                <input className="input" type="date" value={item.expiryDate} onChange={e=>setItem({...item, expiryDate:e.target.value})}/>
              </div>
            </div>

            <button className="btn" onClick={postItem}>Post item</button>
          </div>
        </div>

        <div className="card">
          <h3>Your items</h3>
          {items.length === 0 ? (
            <div className="muted">No items yet. Post something above.</div>
          ) : (
            <div className="list">
              {items.map(it => (
                <div key={it.id} className="list-item">
                  <img className="thumb" src={it.image || `https://picsum.photos/seed/${encodeURIComponent(it.title)}/140/100`} alt="" />
                  <div>
                    <div style={{display:'flex', alignItems:'center', gap:6, flexWrap:'wrap'}}>
                      <strong style={{fontSize:14}}>{it.title}</strong>
                      <span className="muted">({it.qty} left)</span>
                    </div>
                    <div style={{fontSize:14}}>${Number(it.price).toFixed(2)} {it.originalPrice ? <span className="muted">(was ${Number(it.originalPrice).toFixed(2)})</span> : null}</div>
                    <div className="muted" style={{fontSize:12}}>
                      Expires {new Date(it.expiry).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{display:'grid', gap:6}}>
                    {!it.soldOut && <button className="btn small secondary" onClick={()=>markSoldOut(it.id)}>Sold out</button>}
                    <button className="btn small secondary" onClick={()=>removeItem(it.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
