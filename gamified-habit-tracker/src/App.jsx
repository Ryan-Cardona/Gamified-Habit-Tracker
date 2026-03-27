import { useState } from 'react'
import { useUser } from './hooks/useUser'
import { useWaterLog } from './hooks/useWaterLog'
import { WaterProgress } from './components/water/WaterProgress'
import { WaterLogger } from './components/water/WaterLogger'
import { WelcomeModal } from './components/ui/WelcomeModal'
import './App.css'

function App() {
  const { user, loading: userLoading, error: userError } = useUser()
  const { todayTotal, loading: logsLoading, logging, logWater } = useWaterLog(user?.id)
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem('hydroquest_welcomed')
  )

  if (userLoading) {
    return (
      <div className="app-shell">
        <div className="splash">
          <div className="splash-drop">💧</div>
          <p className="splash-text">Loading HydroQuest…</p>
        </div>
      </div>
    )
  }

  if (userError) {
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
      {showWelcome && (
        <WelcomeModal onAccept={() => {
          localStorage.setItem('hydroquest_welcomed', 'true')
          setShowWelcome(false)
        }} />
      )}

      <header className="app-header">
        <span className="header-title">💧 HydroQuest</span>
        <span className="header-user">{user.username}</span>
      </header>

      <main className="app-main">
        <section className="home-section">
          {logsLoading ? (
            <div className="section-loading">Loading today's logs…</div>
          ) : (
            <WaterProgress
              todayTotal={todayTotal}
              goalMl={user.daily_goal_ml}
            />
          )}
        </section>

        <section className="home-section">
          <WaterLogger
            onLog={logWater}
            disabled={logging}
          />
        </section>
      </main>
    </div>
  )
}

export default App