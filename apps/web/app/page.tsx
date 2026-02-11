export default function Dashboard() {
  return (
    <div className="card">
      <h1 style={{ marginTop: 0, marginBottom: 12 }}>Support Overview</h1>
      <p className="small" style={{ marginBottom: 20 }}>
        Multi‑agent customer support dashboard. Jump into chat, review orders, or check billing and tracking.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <div className="small">Live AI Chat</div>
          <div style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>Router + 3 Agents</div>
          <div className="small" style={{ marginTop: 8, opacity: 0.8 }}>
            Order, billing, and general support agents coordinated by a router.
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div className="small">Sample Data</div>
          <div style={{ fontSize: 20, fontWeight: 600, marginTop: 4 }}>Seeded PostgreSQL</div>
          <div className="small" style={{ marginTop: 8, opacity: 0.8 }}>
            Includes a demo user, orders, invoices, and conversation history.
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div className="small">Quick Links</div>
          <ul className="small" style={{ marginTop: 8, paddingLeft: 18 }}>
            <li>Use Chat for multi‑agent routing.</li>
            <li>Orders shows API‑backed sample orders.</li>
            <li>Billing / Support / Tracking are overview screens.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
