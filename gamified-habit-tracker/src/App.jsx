import { useState } from 'react'
import { useUser } from './hooks/useUser'
import { useWaterLog } from './hooks/useWaterLog'
import { WaterProgress } from './components/water/WaterProgress'
import { WaterLogger } from './components/water/WaterLogger'
import { XPBar } from './components/ui/XPBar'
import { LevelUpToast } from './components/ui/LevelUpToast'
import { xpForLog, levelFromXP } from './utils/xp'
import './App.css'

function App() {
  const { user, loading: userLoading, error: userError, updateUser } = useUser()
  const { todayTotal, loading: logsLoading, logging, logWater } = useWaterLog(user?.id)
  const [levelUp, setLevelUp] = useState(null) // holds the new level number when levelling up

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

  async function handleLogWater(amount_ml) {
    const success = await logWater(amount_ml)
    if (!success) return

    const earned   = xpForLog(amount_ml)
    const newXP    = user.xp + earned
    const newLevel = levelFromXP(newXP)

    if (newLevel > user.level) {
      setLevelUp(newLevel)
    }

    await updateUser({ xp: newXP, level: newLevel })
  }

  return (
    <div className="app-shell">
      {levelUp && (
        <LevelUpToast
          level={levelUp}
          onDone={() => setLevelUp(null)}
        />
      )}

      <header className="app-header">
        <span className="header-title">💧 HydroQuest</span>
        <span className="header-user">{user.username}</span>
      </header>

      <div className="xp-bar-row">
        <XPBar xp={user.xp} level={user.level} />
      </div>

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
            onLog={handleLogWater}
            disabled={logging}
          />
        </section>
      </main>
    </div>
  )
}

export default App
