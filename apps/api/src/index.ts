import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { prisma } from './lib/prisma'
import { handleUserMessage } from "./services/chat.service"


const app = new Hono()

// Simple CORS middleware for dev: allow requests from the web dev server.
app.use('*', async (c, next) => {
  await next()
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
})

app.get('/', (c) => {
  return c.json({ message: 'Hello World' })
})

// Health
app.get('/api/health', (c) => {
  return c.json({ status: 'OK' })
})

// Chat: send a message to the system
app.post('/api/chat/messages', async (c) => {
  try {
    const body = await c.req.json()

    if (!body.message) {
      return c.json({ error: 'Message is required' }, 400)
    }

    const reply = await handleUserMessage(body.message)

    return c.json({ reply })
  } catch (error) {
    console.error('Error in /api/chat/messages:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})


// Streaming chat: Server-Sent Events with a typing indicator
app.post('/api/chat/stream', async (c) => {
  try {
    const body = await c.req.json()
    if (!body.message) return c.json({ error: 'Message is required' }, 400)

    // Get the full reply first (can be replaced with real streaming from model)
    const reply = await handleUserMessage(body.message)

    const encoder = new TextEncoder()

    function chunkString(str: string, size = 60) {
      const chunks: string[] = []
      for (let i = 0; i < str.length; i += size) {
        chunks.push(str.slice(i, i + size))
      }
      return chunks
    }

    const stream = new ReadableStream({
      async start(controller) {
        // Send typing on
        controller.enqueue(encoder.encode('event: typing\ndata: true\n\n'))

        // Stream chunks with small pauses to simulate streaming
        const chunks = chunkString(reply, 60)
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
          // small delay so client can render progressively
          await new Promise((r) => setTimeout(r, 40))
        }

        // Send typing off and done
        controller.enqueue(encoder.encode('event: typing\ndata: false\n\n'))
        controller.enqueue(encoder.encode('event: done\ndata: true\n\n'))
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    })
  } catch (err) {
  console.error('Error in /api/chat/stream:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
  }
})

// Conversations: list by user email
app.get('/api/conversations', async (c) => {
  const email = c.req.query('email')
  if (!email) return c.json({ error: 'email query required' }, 400)

  const user = await prisma.user.findUnique({ where: { email: String(email) } })
  if (!user) return c.json({ error: 'User not found' }, 404)

  const convs = await prisma.conversation.findMany({
    where: { userId: user.id },
    include: { messages: true }
  })

  return c.json(convs)
})

app.get('/api/conversations/:id', async (c) => {
  const id = c.req.param('id')
  const conv = await prisma.conversation.findUnique({ where: { id }, include: { messages: true } })
  if (!conv) return c.json({ error: 'Conversation not found' }, 404)
  return c.json(conv)
})

app.delete('/api/conversations/:id', async (c) => {
  const id = c.req.param('id')
  try {
    await prisma.conversation.delete({ where: { id } })
    return c.json({ ok: true })
  } catch (err) {
    return c.json({ error: 'Delete failed' }, 500)
  }
})

// Create conversation and persist messages
app.post('/api/conversations', async (c) => {
  try {
    const body = await c.req.json()
    const { email, message, reply } = body
    if (!email || !message) return c.json({ error: 'email and message required' }, 400)

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return c.json({ error: 'User not found' }, 404)

    const conv = await prisma.conversation.create({
      data: {
        userId: user.id,
        messages: {
          create: [
            { role: 'user', content: message },
            ...(reply ? [{ role: 'assistant', content: reply }] : [])
          ]
        }
      },
      include: { messages: true }
    })

    return c.json(conv)
  } catch (err) {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }
})

// Agents: list and capabilities
app.get('/api/agents', (c) => {
  const agents = [
    { type: 'ORDER', name: 'Order Agent' },
    { type: 'BILLING', name: 'Billing Agent' },
    { type: 'SUPPORT', name: 'Support Agent' }
  ]
  return c.json(agents)
})

app.get('/api/agents/:type/capabilities', (c) => {
  const t = c.req.param('type')
  const caps: Record<string, string[]> = {
    ORDER: ['order status', 'tracking', 'delivery date'],
    BILLING: ['invoice lookup', 'payment status', 'refunds'],
    SUPPORT: ['general help', 'conversation history', 'escalation']
  }
  return c.json({ type: t, capabilities: caps[t.toUpperCase()] ?? [] })
})

// Debug orders endpoint used by the web app during development
app.get('/api/debug-orders', (c) => {
  const sample = {
    orders: [
      { id: 'order_1', status: 'shipped', total: 49.99, items: [{ sku: 'sku-1', qty: 1 }] },
      { id: 'order_2', status: 'processing', total: 19.99, items: [{ sku: 'sku-2', qty: 2 }] }
    ]
  }
  return c.json(sample)
})

// Default API port is 4000 to avoid clashing with Next.js dev (3000)
const port = process.env.PORT ? Number(process.env.PORT) : 6000
serve({ fetch: app.fetch, port })
console.log(`Server running at http://localhost:${port}`)