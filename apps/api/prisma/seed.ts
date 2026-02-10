import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create a Sample User
  const user = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      name: 'Jane Doe',
    },
  });

  // 2. Create Sample Orders for the Order Agent [cite: 24, 30]
  const order1 = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'SHIPPED',
      trackingNumber: 'TRK123456789',
      totalAmount: 150.00,
      items: 'Mechanical Keyboard, USB-C Cable',
    },
  });

  // 3. Create Sample Invoices for the Billing Agent [cite: 26, 30]
  await prisma.invoice.create({
  data: {
    userId: user.id,
    amount: 150.00,
    status: 'PAID',
    issuedDate: new Date(),
  },
});

  // 4. Create an initial Conversation for context [cite: 31, 35]
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
            content: 'I would be happy to help! Which order are you referring to?',
          },
        ],
      },
    },
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });