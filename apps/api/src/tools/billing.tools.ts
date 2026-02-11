import { prisma } from "../lib/prisma"

export async function getInvoicesByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { invoices: true }
  })

  if (!user) return { error: "User not found" }

  return user.invoices
}

export async function getInvoiceStatus(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId }
  })

  if (!invoice) return { error: "Invoice not found" }

  return invoice
}

// Backwards-compatible alias expected by agents
export async function getInvoiceById(invoiceId: string) {
  return getInvoiceStatus(invoiceId)
}
