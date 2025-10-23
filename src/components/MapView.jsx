import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import StarRating from './StarRating.jsx'
import { getVendorRating } from '../utils/ratings.js'
import { placeholderForItem } from '../utils/placeholders.js'

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
})

export default function MapView({ items = [], onBuy, center }) {
  const fallback = items.length ? [items[0].lat, items[0].lng] : [37.7749, -122.4194]
  const mapRef = useRef(null)

  useEffect(() => {
    if (center && mapRef.current) {
      mapRef.current.setView(center, 13, { animate: true })
    }
  }, [center])

  return (
    <div style={{ height: '100%', minHeight: 360 }}>
      <MapContainer
        center={center || fallback}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(m) => (mapRef.current = m)}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {items.map(it => {
          const r = getVendorRating(it.vendor)
          const img = it.image || placeholderForItem(it)
          return (
            <Marker key={it.id} position={[it.lat, it.lng]} icon={icon}>
              <Popup>
                <div style={{ display: 'grid', gap: 8, maxWidth: 260 }}>
                  <img
                    alt=""
                    src={img}
                    loading="lazy"
                    style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                    onError={(e) => { e.currentTarget.src = placeholderForItem(it) }}
                  />
                  <strong>{it.title}</strong>
                  <div>${Number(it.price).toFixed(2)} {it.originalPrice ? <span className="muted">(was ${Number(it.originalPrice).toFixed(2)})</span> : null}</div>
                  <div className="muted">{it.vendor} • {it.type}</div>
                  {r.count ? <StarRating value={r.avg} count={r.count} /> : <span className="muted">No reviews yet</span>}
                  <button className="btn small" onClick={() => onBuy?.(it)}>Buy</button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
