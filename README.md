Customer Support System – Multi‑Agent Chat

A full‑stack demo of a multi‑agent customer support platform:

- Router agent that classifies intent into `ORDER`, `BILLING`, or `SUPPORT`
- Specialized sub‑agents for each domain (order, billing, general support)
- PostgreSQL + Prisma for users, orders, invoices, and conversations
- Hono (TypeScript) backend API
- Next.js dashboard with a clean dark UI and AI chat

---

Features

- **Multi‑Agent Routing** – Router LLM chooses the right agent for each message.
- **Domain Agents**
  - **Order Agent** – order status, tracking, delivery date.
  - **Billing Agent** – invoices, payment status, refunds.
  - **Support Agent** – general questions, conversation history, escalations.
- **Database‑Backed Tools** – Agents call typed tools that query PostgreSQL via Prisma.
- **Conversation Persistence** – User / assistant messages stored per conversation.
- **Modern UI** – Next.js app with sidebar, dashboard, and an AI chat interface.

---

## Tech Stack

- **Frontend**: Next.js, React
- **Backend**: Hono (Node), TypeScript
- **Database**: PostgreSQL + Prisma
- **AI**: Groq models via `@ai-sdk/groq` / `ai`
- **Tooling**: Turborepo, TypeScript, ESLint, Prettier

---

Monorepo Structure

<img width="728" height="817" alt="Screenshot 2026-02-11 212926" src="https://github.com/user-attachments/assets/30c8bc03-3f57-40d5-ac03-d58f50c2aee0" />


Setup :-

1. Prerequisites

- Node.js **18+**
- npm **10+**
- Running **PostgreSQL**
- **Groq API key** for the LLM

---

2. Clone & Install

git clone <https://github.com/Tharun1936/customer-support-system.git>.git
cd customer-support-system

# Install root + all workspace deps
npm install

3. Backend

DATABASE_URL="postgresql://postgres:Tharungowda@19@localhost:5432/support_system"
GROQ_API_KEY="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"

   Migration and seed:
   
   cd apps/api
   npx prisma migrate deploy
   npx prisma db seed

   Run API:
   # from apps/api
   # Windows PowerShell
   $env:PORT=4000; npm run dev
   # Bash / WSL / macOS (alternative)
   # PORT=4000 npm run dev

4. Frontend:

  cd ../web
  npm install          # if needed
  npm run dev          # Next.js dev server (see port in console, e.g. 3001)



   

