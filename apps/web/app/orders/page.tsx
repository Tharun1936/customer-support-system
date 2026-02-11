"use client"

import { useEffect, useState } from "react"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    const endpoint = `${API_BASE.replace(/\/$/, '')}/api/debug-orders`

    let mounted = true

    const load = async () => {
      try {
        const res = await fetch(endpoint)
        if (!res.ok) {
          const text = await res.text().catch(() => res.statusText)
          throw new Error(text || `HTTP ${res.status}`)
        }
        const data = await res.json()
        if (mounted) setOrders(data.orders ?? [])
      } catch (err) {
        console.error('Failed to load orders', err)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div>
      <h1>Orders</h1>
      <pre>{JSON.stringify(orders, null, 2)}</pre>
    </div>
  )
}
