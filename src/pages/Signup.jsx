import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const nav = useNavigate()
  return (
    <div className="pad">
      <div className="stack">
        <div className="card" style={{textAlign:'center'}}>
          <h2 style={{margin:'4px 0'}}>The X Date</h2>
          <div className="muted">Buy discounted food before it expires.</div>
        </div>

        <div className="card stack">
          <button className="btn block" onClick={()=>nav('/role')}>Continue</button>
          <div className="muted">Page 1: Signup → choose role</div>
        </div>
      </div>
    </div>
  )
}
