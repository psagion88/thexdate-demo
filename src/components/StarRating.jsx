import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import StarRating from './StarRating.jsx'
import { getVendorRating } from '../utils/ratings.js'

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
})

export default function MapView({ items = [], onBuy }) {
  const center = items.length ? [items[0].lat, items[0].lng] : [37.7749, -122.4194]

  return (
    <div style={{height:'100%', minHeight:360}}>
      <MapContainer center={center} zoom={12} style={{height:'100%', width:'100%'}}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {items.map(it => {
          const r = getVendorRating(it.vendor)
          return (
            <Marker key={it.id} position={[it.lat, it.lng]} icon={icon}>
              <Popup>
                <div style={{display:'grid', gap:6, maxWidth:240}}>
                  <strong>{it.title}</strong>
                  <div>${Number(it.price).toFixed(2)} {it.originalPrice ? <span className="muted">(was ${Number(it.originalPrice).toFixed(2)})</span> : null}</div>
                  <div className="muted">{it.vendor}</div>
                  {r.count ? <StarRating value={r.avg} count={r.count} /> : <span className="muted">No reviews yet</span>}
                  <button className="btn small" onClick={()=>onBuy?.(it)}>Buy</button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
