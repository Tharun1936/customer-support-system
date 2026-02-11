import { generateText } from "ai";
import { model } from "../lib/ai";

export async function routerAgent(userMessage: string) {
  const result = await generateText({
    model,
    system: `
You are a routing agent.

Decide which department should handle the user's request:

Return only one of:
- ORDER
- BILLING
- SUPPORT

Rules:
- Order status, tracking → ORDER
- Invoice, payment, refund → BILLING
- General help or conversation → SUPPORT
`,
    prompt: userMessage,
  });

  return result.text.trim();
}
