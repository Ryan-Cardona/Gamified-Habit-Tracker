import { useState, useEffect } from 'react'
import { useUser } from './hooks/useUser'
import { useWaterLog } from './hooks/useWaterLog'
import { WaterProgress } from './components/water/WaterProgress'
import { WaterLogger } from './components/water/WaterLogger'
import { XPBar } from './components/ui/XPBar'
import { LevelUpToast } from './components/ui/LevelUpToast'
import { StreakToast } from './components/ui/StreakToast'
import { StreakBadge } from './components/ui/StreakBadge'
import { WelcomeModal } from './components/ui/WelcomeModal'
import { xpForLog, levelFromXP } from './utils/xp'
import { computeStreakUpdate, checkStreakExpiry } from './utils/streaks'
import './App.css'

function App() {
  const { user, loading: userLoading, error: userError, updateUser } = useUser()
  const { todayTotal, loading: logsLoading, logging, logWater } = useWaterLog(user?.id)
  const [levelUp, setLevelUp]     = useState(null)
  const [streakHit, setStreakHit] = useState(null)
  const [showWelcome, setShowWelcome] = useState(
    () => !localStorage.getItem('hydroquest_welcomed')
  )

  // On load: reset streak if the user missed yesterday
  useEffect(() => {
    if (!user) return
    const expiry = checkStreakExpiry(user.streak_current, user.streak_last_date)
    if (expiry) updateUser(expiry)
  }, [user?.id]) // run once when user first loads

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

    const updates = {}

    // XP & level
    const earned   = xpForLog(amount_ml)
    const newXP    = user.xp + earned
    const newLevel = levelFromXP(newXP)
    updates.xp    = newXP
    updates.level = newLevel

    if (newLevel > user.level) setLevelUp(newLevel)

    // Streak — check if this log pushed today's total to the daily goal
    const newTotal = todayTotal + amount_ml
    if (newTotal >= user.daily_goal_ml) {
      const streakUpdate = computeStreakUpdate(
        user.streak_current,
        user.streak_longest,
        user.streak_last_date,
      )
      if (streakUpdate) {
        Object.assign(updates, streakUpdate)
        setStreakHit(streakUpdate.streak_current)
      }
    }

    await updateUser(updates)
  }

  return (
    <div className="app-shell">
      {showWelcome && (
        <WelcomeModal onAccept={() => {
          localStorage.setItem('hydroquest_welcomed', 'true')
          setShowWelcome(false)
        }} />
      )}
      {levelUp && (
        <LevelUpToast
          level={levelUp}
          onDone={() => setLevelUp(null)}
        />
      )}
      {streakHit && (
        <StreakToast
          streak={streakHit}
          onDone={() => setStreakHit(null)}
        />
      )}

      <header className="app-header">
        <span className="header-title">💧 HydroQuest</span>
        <div className="header-right">
          <StreakBadge streak={user.streak_current} />
          <span className="header-user">{user.username}</span>
        </div>
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
