import React from 'react'

export default function StarRating({ value = 0, count = 0 }) {
  const stars = [1,2,3,4,5].map(i => (i <= Math.round(value) ? '★' : '☆')).join('')
  return (
    <span title={`${value.toFixed(1)} / 5 (${count})`} style={{fontSize:14}}>
      {stars} <span className="muted">({count})</span>
    </span>
  )
}
