import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconUrl from 'leaflet/dist/images/marker-icon.png?url'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png?url'
const DefaultIcon = L.icon({ iconUrl, shadowUrl })
L.Marker.prototype.options.icon = DefaultIcon

export default function MapView({ items }) {
  const [center, setCenter] = useState([34.0522, -118.2437]) // LA default
  const [zoom] = useState(12)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
        () => {},
        { enableHighAccuracy: true, timeout: 5000 }
      )
    }
  }, [])
  const openDirections = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    window.open(url, '_blank')
  }
  return (
    <div style={{height:'100%'}}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {items.map(item => (
          <Marker key={item.id} position={[item.lat, item.lng]}>
            <Popup>
              <div style={{minWidth: 180}}>
                <strong>{item.title}</strong><br/>
                ${item.price.toFixed(2)} — <span style={{color:'#666'}}>{item.vendor}</span><br/>
                <small>Expires {new Date(item.expiry).toLocaleString()}</small><br/>
                <button className="btn" style={{marginTop:8}} onClick={()=>openDirections(item.lat, item.lng)}>Directions</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}