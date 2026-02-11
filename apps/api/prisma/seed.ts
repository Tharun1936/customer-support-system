import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create user (use upsert so seed can run multiple times safely)
  const user = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Jane Doe',
    },
  })

  // Create order
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'SHIPPED',
      trackingNumber: 'TRK123456789',
      totalAmount: 150.0,
      items: 'Mechanical Keyboard, USB-C Cable',
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  })

  // Create invoice
  await prisma.invoice.create({
    data: {
      userId: user.id,
      amount: 150.0,
      status: 'PAID',
      issuedDate: new Date(),
    },
  })

  // Create conversation with messages
  await prisma.conversation.create({
    data: {
      userId: user.id,
      messages: {
        create: [
          {
            role: 'user',
            content: 'Hello, I have a question about my recent order.',
          },
          {
            role: 'assistant',
            content: 'Sure! How can I help you with your order?',
          },
        ],
      },
    },
  })

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
