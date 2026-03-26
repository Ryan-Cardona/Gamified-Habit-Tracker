import { useUser } from './hooks/useUser'
import './App.css'

function App() {
  const { user, loading, error } = useUser()

  if (loading) {
    return (
      <div className="app-shell">
        <div className="splash">
          <div className="splash-drop">💧</div>
          <p className="splash-text">Loading HydroQuest…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-shell">
        <div className="splash">
          <p className="splash-error">Could not connect to the server. Check your internet connection and try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        <div className="placeholder-screen">
          <div className="drop-icon">💧</div>
          <h1>HydroQuest</h1>
          <div className="user-card card">
            <p className="user-label">You are playing as</p>
            <p className="user-name">{user.username}</p>
            <p className="user-id">ID: {user.id.slice(0, 8)}…</p>
          </div>
          <p className="hint">Step 2 complete — anonymous user system working.</p>
        </div>
      </main>
    </div>
  )
}

export default App
