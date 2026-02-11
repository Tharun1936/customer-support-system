interface Props {
  role: "user" | "assistant"
  content: string
}

export default function MessageBubble({ role, content }: Props) {
  return (
    <div
      style={{
        alignSelf: role === "user" ? "flex-end" : "flex-start",
        background: role === "user" ? "#3b82f6" : "#e5e7eb",
        color: role === "user" ? "white" : "black",
        padding: 10,
        borderRadius: 10,
        maxWidth: "70%",
        marginBottom: 10
      }}
    >
      {content}
    </div>
  )
}
