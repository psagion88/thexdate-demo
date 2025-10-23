import React, { useEffect, useMemo, useState } from 'react'

const STORE_KEY = 'thexdate.vendor.store'
const ITEMS_KEY = 'thexdate.vendor.items'

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback } catch { return fallback }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const data = await res.json()
    return data?.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`
  } catch {
    return `${lat.toFixed(5)}, ${lon.toFixed(5)}`
  }
}

export default function Vendor() {
  const [store, setStore] = useState(load(STORE_KEY, {
    name: 'My Store',
    address: '',
    phone: '',
    lat: null,
    lon: null
  }))
  const [items, setItems] = useState(load(ITEMS_KEY, []))
  const [form, setForm] = useState({
    description: '',
    imageFile: null,
    title: '',
    qty: 1,
    price: '',
    originalPrice: '',
    expiry: '' // date only
  })
  const [msg, setMsg] = useState('')

  useEffect(() => save(STORE_KEY, store), [store])
  useEffect(() => save(ITEMS_KEY, items), [items])

  const publishEnabled = useMemo(() =>
    form.title && Number(form.qty) > 0 && Number(form.price) > 0 && form.expiry, [form])

  const useMyLocation = () => {
    setMsg('')
    if (!('geolocation' in navigator)) {
      setMsg('Geolocation not supported.')
      return
    }
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      const addr = await reverseGeocode(lat, lon)
      setStore(s => ({ ...s, lat, lon, address: addr }))
      setMsg('Location captured and address filled.')
    }, err => {
      setMsg('Location error: ' + (err?.message || 'permission denied'))
    }, { enableHighAccuracy: true, timeout: 9000 })
  }

  const publish = () => {
    const id = `v_${Date.now()}`
    const reader = new FileReader()
    reader.onload = () => {
      const newItem = {
        id,
        vendor: store.name || 'My Store',
        title: form.title,
        type: guessType(form.title),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        qty: Number(form.qty),
        expiry: form.expiry, // date only
        image: reader.result || '',
        lat: store.lat ?? 37.7749,
        lng: store.lon ?? -122.4194
      }
      const next = [newItem, ...items]
      setItems(next)
      setForm({ description: '', imageFile: null, title: '', qty: 1, price: '', originalPrice: '', expiry: '' })
      alert('Item published! It now appears on Discover.')
    }
    if (form.imageFile) reader.readAsDataURL(form.imageFile)
    else reader.onload({ target: { result: '' } })
  }

  const guessType = (title) => {
    const t = title.toLowerCase()
    if (t.includes('bagel') || t.includes('bread') || t.includes('loaf') || t.includes('bakery')) return 'Bakery'
    if (t.includes('wrap') || t.includes('sandwich')) return 'Deli'
    if (t.includes('salad')) return 'Salad'
    if (t.includes('pasta') || t.includes('italian')) return 'Italian'
    if (t.includes('bowl')) return 'Bowl'
    if (t.includes('sushi')) return 'Sushi'
    if (t.includes('fruit') || t.includes('veggie') || t.includes('box') || t.includes('produce')) return 'Produce'
    return 'Other'
  }

  return (
    <div className="pad">
      <div className="stack">

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Store profile</h3>
          <div className="form">
            <div className="row">
              <label className="muted">Store name</label>
              <input className="input" value={store.name} onChange={e => setStore({ ...store, name: e.target.value })} />
            </div>
            <div className="row">
              <label className="muted">Address</label>
              <input className="input" value={store.address} onChange={e => setStore({ ...store, address: e.target.value })} placeholder="123 Main St, City" />
            </div>
            <div className="row h">
              <div className="row">
                <label className="muted">Phone</label>
                <input className="input" value={store.phone} onChange={e => setStore({ ...store, phone: e.target.value })} placeholder="(555) 123-4567" />
              </div>
              <div className="row">
                <label className="muted">Actions</label>
                <button className="btn secondary" onClick={useMyLocation}>📍 Use my location</button>
              </div>
            </div>
            <div className="row h">
              <button className="btn" onClick={() => { save(STORE_KEY, store); setMsg('Store saved.'); }}>Save Profile</button>
              <button className="btn secondary" onClick={() => { setStore({ name: 'My Store', address: '', phone: '', lat: null, lon: null }); setMsg('Profile cleared.'); }}>Reset</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Post an item</h3>
          <div className="form">
            <div className="row">
              <label className="muted">Description</label>
              <textarea className="textarea" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description…" />
            </div>
            <div className="row">
              <label className="muted">Image</label>
              <input type="file" accept="image/*" className="input" onChange={e => setForm({ ...form, imageFile: e.target.files?.[0] || null })} />
            </div>
            <div className="row h">
              <div className="row">
                <label className="muted">Title</label>
                <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Turkey Sandwich" />
              </div>
              <div className="row">
                <label className="muted">Qty</label>
                <input className="input" inputMode="numeric" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
              </div>
            </div>
            <div className="row h">
              <div className="row">
                <label className="muted">Price</label>
                <input className="input" inputMode="decimal" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="row">
                <label className="muted">Original (optional)</label>
                <input className="input" inputMode="decimal" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} />
              </div>
            </div>
            <div className="row">
              <label className="muted">Expiry date</label>
              <input className="input" type="date" value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} />
            </div>
            <div className="row h">
              <button className="btn" disabled={!publishEnabled} onClick={publish}>Publish</button>
              <button className="btn secondary" onClick={() => setForm({ description: '', imageFile: null, title: '', qty: 1, price: '', originalPrice: '', expiry: '' })}>Clear</button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>My Items</h3>
          <div className="list">
            {items.length === 0 && <div className="muted">No items posted yet.</div>}
            {items.map(it => (
              <div key={it.id} className="list-item" style={{ gridTemplateColumns: '72px 1fr auto' }}>
                <img className="thumb" alt="" src={it.image || 'https://images.unsplash.com/photo-1505575972945-280f1b9cf63a?q=80&w=600&auto=format&fit=crop'} />
                <div>
                  <div><strong>{it.title}</strong> <span className="muted">• {it.type}</span></div>
                  <div className="muted">Qty {it.qty} • ${Number(it.price).toFixed(2)}</div>
                  <div className="muted">Expiry {it.expiry}</div>
                </div>
                <button className="btn small" onClick={() => {
                  setItems(items.filter(x => x.id !== it.id))
                }}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        {msg && <div className="muted" style={{ color: '#065f46' }}>{msg}</div>}
      </div>
    </div>
  )
}
