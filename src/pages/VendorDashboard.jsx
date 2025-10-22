import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import sampleData from '../data/sampleDeals.json'
const KEY = 'thexdate.items'
const loadItems = () => { try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s) } catch {} return sampleData }
const saveItems = (items) => localStorage.setItem(KEY, JSON.stringify(items))
export default function VendorDashboard() {
  const { user } = useAuth()
  const [items, setItems] = useState(loadItems())
  const [form, setForm] = useState({ title:'', vendor:'My Store', price:5, qty:5, expiry: new Date(Date.now()+2*3600*1000).toISOString().slice(0,16), lat:34.0522, lng:-118.2437, diet:'any' })
  useEffect(()=>saveItems(items), [items])
  const addItem = () => {
    const id = Math.random().toString(36).slice(2)
    const newItem = { id, title:form.title, vendor:form.vendor, price:parseFloat(form.price), qty:parseInt(form.qty,10), expiry:new Date(form.expiry).toISOString(), lat:parseFloat(form.lat), lng:parseFloat(form.lng), diet: form.diet==='any'?['any']:[form.diet], distance_km:1.0 }
    setItems([newItem, ...items]); setForm({...form, title:''})
  }
  const markSoldOut = (id) => setItems(items.filter(i=>i.id!==id))
  const exportCSV = () => {
    const headers = ['id','title','vendor','price','expiry','lat','lng','qty']
    const rows = [headers.join(',')].concat(items.map(i => [i.id,i.title,i.vendor,i.price,i.expiry,i.lat,i.lng,i.qty].join(',')))
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' }); const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'vendor_items.csv'; a.click(); URL.revokeObjectURL(url)
  }
  return (
    <div className="list">
      <h2>Vendor Dashboard {user ? <span className="muted">(signed in as {user.provider})</span> : <span className="muted">(demo mode)</span>}</h2>
      <div className="list-item" style={{display:'block'}}>
        <h3>Create Item</h3>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:12}}>
          <label>Title<br/><input value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/></label>
          <label>Vendor<br/><input value={form.vendor} onChange={e=>setForm({...form, vendor:e.target.value})}/></label>
          <label>Price<br/><input type="number" step="0.01" value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/></label>
          <label>Quantity<br/><input type="number" value={form.qty} onChange={e=>setForm({...form, qty:e.target.value})}/></label>
          <label>Expiry<br/><input type="datetime-local" value={form.expiry} onChange={e=>setForm({...form, expiry:e.target.value})}/></label>
          <label>Lat<br/><input type="number" step="0.0001" value={form.lat} onChange={e=>setForm({...form, lat:e.target.value})}/></label>
          <label>Lng<br/><input type="number" step="0.0001" value={form.lng} onChange={e=>setForm({...form, lng:e.target.value})}/></label>
          <label>Diet<br/>
            <select value={form.diet} onChange={e=>setForm({...form, diet:e.target.value})}>
              <option value="any">Any</option><option value="veg">Vegetarian</option><option value="vegan">Vegan</option>
            </select>
          </label>
        </div>
        <div style={{marginTop:12}}>
          <button className="btn" onClick={addItem} disabled={!form.title}>Create</button>
          <span className="muted" style={{marginLeft:8}}>Appears on Discover immediately (local demo)</span>
        </div>
      </div>
      <div className="list-item" style={{display:'block'}}>
        <h3>Items</h3>
        <button className="btn secondary" onClick={exportCSV}>Export CSV</button>
        <div className="list" style={{maxHeight:360}}>
          {items.map(i=>(
            <div className="list-item" key={i.id}>
              <div>
                <strong>{i.title}</strong> — ${i.price.toFixed(2)} <span className="muted">({i.vendor})</span><br/>
                <span className="muted">Expires {new Date(i.expiry).toLocaleString()} • ({i.lat.toFixed(3)}, {i.lng.toFixed(3)})</span>
              </div>
              <button className="btn secondary" onClick={()=>markSoldOut(i.id)}>Mark sold out</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}