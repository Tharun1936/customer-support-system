"use client"

import { useState } from "react"

type ChatRole = "user" | "assistant"

interface ChatMessage {
  id: number
  role: ChatRole
  content: string
}

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async () => {
    if (!message.trim() || isSending) return

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    const endpoint = `${API_BASE.replace(/\/$/, '')}/api/chat/messages`

    const userText = message.trim()

    // Optimistically append user message
    setMessages(prev => [
      ...prev,
      { id: Date.now(), role: "user", content: userText }
    ])
    setMessage("")
    setIsSending(true)
    setError(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText)
        throw new Error(text || `HTTP ${res.status}`)
      }

      const data = await res.json()

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.reply ?? "No reply received."
        }
      ])
    } catch (err) {
      console.error('Failed to send message', err)
      setError('Failed to send message. Please try again.')
    }

    setIsSending(false)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <header style={{ marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>AI Support Chat</h1>
          <p className="small" style={{ marginTop: 4 }}>
            Ask about orders, billing, or any support question. The router will pick the right agent.
          </p>
        </header>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 12,
            borderRadius: 12,
            background: "rgba(15,23,42,0.75)",
            border: "1px solid rgba(148,163,184,0.25)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 12
          }}
        >
          {messages.length === 0 && (
            <div className="small" style={{ opacity: 0.75 }}>
              Start by saying something like “What is the status of my order with tracking TRK123...”
            </div>
          )}

          {messages.map(m => (
            <div
              key={m.id}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "70%",
                padding: "8px 12px",
                borderRadius: 12,
                background: m.role === "user" ? "#3b82f6" : "#0f172a",
                color: "#e5e7eb",
                fontSize: 14,
                lineHeight: 1.5
              }}
            >
              {m.content}
            </div>
          ))}

          {isSending && (
            <div
              className="small"
              style={{
                alignSelf: "flex-start",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(15,23,42,0.9)",
                border: "1px solid rgba(148,163,184,0.6)"
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "999px",
                  background: "var(--accent)",
                  boxShadow: "0 0 0 4px rgba(110,231,183,0.3)"
                }}
              />
              Thinking...
            </div>
          )}
        </div>

        {error && (
          <div
            className="small"
            style={{
              color: "#fecaca",
              background: "rgba(127,29,29,0.4)",
              borderRadius: 8,
              padding: "4px 8px",
              marginBottom: 8
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="search"
            style={{ flex: 1 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage()
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isSending}
            style={{
              padding: "0 18px",
              borderRadius: 999,
              border: "none",
              background: "var(--accent)",
              color: "#020617",
              fontWeight: 600,
              cursor: isSending ? "default" : "pointer",
              opacity: isSending ? 0.7 : 1
            }}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}
