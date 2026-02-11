
"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 12, width: '100%'}}>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <div style={{width:36,height:36,borderRadius:8,background:'var(--accent)'}} />
        <div style={{fontWeight:600}}>Swades Support</div>
      </div>

      <div style={{flex:1}} />

      <input className="search" placeholder="Search conversations, orders..." />

      <div style={{width:40}} />
    </div>
  )
}
