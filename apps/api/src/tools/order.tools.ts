import { prisma } from "../lib/prisma"

export async function getOrdersByEmail(email?: string) {
  const e = (email ?? "").trim()
  if (!e) {
    return { error: "Email is required" }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: e },
      include: { orders: true }
    })

    if (!user) return { error: "User not found" }

    return user.orders
  } catch (err) {
    console.error("getOrdersByEmail error:", err)
    return { error: "Database error", details: String(err) }
  }
}


export async function getOrderByTrackingNumber(trackingNumber?: string) {
  const t = (trackingNumber ?? "").trim()
  if (!t) return { error: "Tracking number is required" }

  try {
    const order = await prisma.order.findFirst({
      where: { trackingNumber: t }
    })

    if (!order) return { error: "Order not found" }

    return order
  } catch (err) {
    console.error("getOrderByTrackingNumber error:", err)
    return { error: "Database error", details: String(err) }
  }
}
