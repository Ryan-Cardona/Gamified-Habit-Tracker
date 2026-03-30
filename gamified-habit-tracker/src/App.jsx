import { useState } from 'react'
import { useUser } from './hooks/useUser'
import { useWaterLog } from './hooks/useWaterLog'
import { useTheme } from './hooks/useTheme'
import { WaterProgress } from './components/water/WaterProgress'
import { WaterLogger } from './components/water/WaterLogger'
import { GoalSetter } from './components/water/GoalSetter'
import { WelcomeModal } from './components/ui/WelcomeModal'
import { BottomNav } from './components/layout/BottomNav'
import { HelpPage } from './pages/HelpPage'
import './App.css'

function App() {
  const { user, loading: userLoading, error: userError, updateUser } = useUser()
  const { todayTotal, loading: logsLoading, logging, logWater } = useWaterLog(user?.id)
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('home')
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

      <div className="app-topbar">
        <header className="app-header">
          <span className="header-title">💧 HydroQuest</span>
        </header>
      </div>

      <main className="app-main">
        {activeTab === 'home' && (
          <>
            <div className="home-top-row">
              <button
                className={`theme-toggle theme-toggle--${theme}`}
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>

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
              <GoalSetter
                currentGoal={user.daily_goal_ml}
                onGoalChange={(ml) => updateUser({ daily_goal_ml: ml })}
              />
            </section>

            <section className="home-section">
              <WaterLogger
                onLog={logWater}
                disabled={logging}
              />
            </section>
          </>
        )}

        {activeTab === 'help' && (
          <HelpPage />
        )}
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}

export default App
