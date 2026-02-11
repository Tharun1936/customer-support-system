import { prisma } from "../lib/prisma"

export async function saveConversation(email: string, userMessage: string, assistantReply: string) {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) return

  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      messages: {
        create: [
          {
            role: "user",
            content: userMessage
          },
          {
            role: "assistant",
            content: assistantReply
          }
        ]
      }
    }
  })

  return conversation
}
