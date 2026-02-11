interface Props {
  title: string
  value: string | number
}

export default function StatsCard({ title, value }: Props) {
  return (
    <div style={{
      background: "#1e293b",
      color: "white",
      padding: 20,
      borderRadius: 10,
      width: 200
    }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  )
}
