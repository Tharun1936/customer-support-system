import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { prisma } from './lib/prisma'

const app = new Hono()

app.get('/health', (c) => {
  return c.json({ status: 'OK' })
})

app.get('/test-db', async (c) => {
  const users = await prisma.user.findMany()
  return c.json(users)
})

serve({
  fetch: app.fetch,
  port: 3000
})
console.log('Server running at http://localhost:3000')