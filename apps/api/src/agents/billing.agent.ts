import { generateText, tool } from "ai"
import { model } from "../lib/ai"
import { getInvoicesByEmail, getInvoiceById } from "../tools/billing.tools"
import { z } from "zod"

export async function billingAgent(userMessage: string) {
  const result = await generateText({
    model,
    system: `
You are a Billing Support Agent.

You help customers with:
- Invoice lookup
- Payment status
- Billing questions

If email is required and missing, ask the user to provide it.
Never call tools with undefined values.
`,
    prompt: userMessage,
    tools: ({
      getInvoicesByEmail: (tool as any)({
        description: "Fetch all invoices for a user using email",
        parameters: z.object({
          email: z.string()
        }),
        execute: async (args: { email: string }) => {
          return await getInvoicesByEmail(args.email)
        }
      }),

      getInvoiceById: (tool as any)({
        description: "Fetch invoice using invoice ID",
        parameters: z.object({
          invoiceId: z.string()
        }),
        execute: async (args: { invoiceId: string }) => {
          return await getInvoiceById(args.invoiceId)
        }
      })
    } as unknown as any)
  })

  return result.text
}
