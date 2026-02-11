import { generateText, tool } from "ai"
import { model } from "../lib/ai"
import { getOrdersByEmail, getOrderByTrackingNumber } from "../tools/order.tools"
import { z } from "zod"

export async function orderAgent(userMessage: string) {
  const result = await generateText({
    model,
    system: `
You are an Order Support Agent.
You help customers with:
- Order status
- Tracking details
- Delivery date
Always use tools when data is required.
`,
    prompt: userMessage,
    tools: ({
  getOrdersByEmail: (tool as any)({
        description: "Fetch all orders for a user using email",
        parameters: z.object({
          email: z.string()
        }),
        execute: async (args: { email: string }) => {
          const orders = await getOrdersByEmail(args.email)
          return orders
        }
      }),

  getOrderByTrackingNumber: (tool as any)({
        description: "Fetch order using tracking number",
        parameters: z.object({
          trackingNumber: z.string()
        }),
        execute: async (args: { trackingNumber: string }) => {
          const order = await getOrderByTrackingNumber(args.trackingNumber)
          return order
        }
      })
    } as unknown as any)
  })

  return result.text
}

