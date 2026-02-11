import { prisma } from "../lib/prisma"

export async function getConversationByUser(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      conversations: {
        include: { messages: true }
      }
    }
  })

  if (!user) return { error: "User not found" }

  return user.conversations
}

export async function createConversation(userId: string, message: string) {
  return await prisma.conversation.create({
    data: {
      userId,
      messages: {
        create: [
          {
            role: "user",
            content: message
          }
        ]
      }
    }
  })
}

// Backwards-compatible alias
export async function getConversationHistory(email: string) {
  return getConversationByUser(email)
}
