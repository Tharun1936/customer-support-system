import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import "./globals.css"

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          <aside className="sidebar">
            <Sidebar />
          </aside>

          <div className="main-column">
            <header className="topbar">
              <Navbar />
            </header>

            <main className="content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}

