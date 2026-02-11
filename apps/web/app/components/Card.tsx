export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#f5f5f5",
      padding: 20,
      borderRadius: 10,
      marginBottom: 20
    }}>
      {children}
    </div>
  )
}
