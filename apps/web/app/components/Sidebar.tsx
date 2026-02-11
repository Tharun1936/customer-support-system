"use client"

import Link from "next/link"

export default function Sidebar() {
  return (
    <div>
      <h2>Support System</h2>

      <nav className="nav-list">
        <Link href="/">Dashboard</Link>
        <Link href="/chat">Chat</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/billing">Billing</Link>
        <Link href="/support">Support</Link>
        <Link href="/tracking">Tracking</Link>
      </nav>
    </div>
  )
}
