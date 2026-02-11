import { generateText, tool } from "ai"
import { model } from "../lib/ai"
import { getConversationHistory } from "../tools/support.tools"
import { z } from "zod"

export async function supportAgent(userMessage: string) {
  const result = await generateText({
    model,
    system: `
You are a General Support Agent.

You handle:
- General questions
- Conversation history
- Escalation requests

Use tools if data retrieval is required.
`,
    prompt: userMessage,
    tools: ({
      getConversationHistory: (tool as any)({
        description: "Fetch user conversation history using email",
        parameters: z.object({
          email: z.string()
        }),
        execute: async (args: { email: string }) => {
          return await getConversationHistory(args.email)
        }
      })
    } as unknown as any)
  })

  return result.text
}
