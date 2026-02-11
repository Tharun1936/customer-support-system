import { routerAgent } from "../agents/router.agent"
import { orderAgent } from "../agents/order.agents"
import { billingAgent } from "../agents/billing.agent"
import { supportAgent } from "../agents/support.agent"
import { saveConversation } from "./conversation.service"

export async function handleUserMessage(message: string): Promise<string> {
  let normalized = 'SUPPORT'
  try {
    const routeRaw = await routerAgent(message)
    normalized = (routeRaw || 'SUPPORT').toUpperCase()
  } catch (err) {
    console.error('routerAgent failed, defaulting to SUPPORT', err)
    normalized = 'SUPPORT'
  }

  let reply = ''
  try {
    if (normalized.includes('ORDER')) {
      reply = await orderAgent(message)
    } else if (normalized.includes('BILLING')) {
      reply = await billingAgent(message)
    } else {
      // Fallback / default route
      reply = await supportAgent(message)
    }
  } catch (err) {
    console.error('agent failed to produce a reply', err)
    reply = "Sorry, something went wrong while processing your request. Please try again later."
  }

  // Extract email (temporary simple regex)
  try {
    const emailMatch = message.match(/\S+@\S+\.\S+/)
    const email = emailMatch ? emailMatch[0] : undefined

    if (email) {
      await saveConversation(email, message, reply).catch((e) => console.error('saveConversation error', e))
    }
  } catch (err) {
    console.error('Error extracting/saving conversation', err)
  }

  return reply
}


