import { useState, useEffect } from 'react'
import { useUser } from './hooks/useUser'
import { useWaterLog } from './hooks/useWaterLog'
import { useChallenges } from './hooks/useChallenges'
import { WaterProgress } from './components/water/WaterProgress'
import { WaterLogger } from './components/water/WaterLogger'
import { GoalSetter } from './components/water/GoalSetter'
import { XPBar } from './components/ui/XPBar'
import { LevelUpToast } from './components/ui/LevelUpToast'
import { StreakToast } from './components/ui/StreakToast'
import { StreakBadge } from './components/ui/StreakBadge'
import { WelcomeModal } from './components/ui/WelcomeModal'
import { InAppBrowserModal, isInAppBrowser } from './components/ui/InAppBrowserModal'
import { ChallengeToast } from './components/ui/ChallengeToast'
import { VirtualPet, PetBubble, getMoodFromProgress } from './components/pet/VirtualPet'
import { PetSelector } from './components/pet/PetSelector'
import { usePetSelection } from './hooks/usePetSelection'
import { usePetName } from './hooks/usePetName'
import { BottomNav } from './components/layout/BottomNav'
import { ChallengesPage } from './pages/ChallengesPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { HelpPage } from './pages/HelpPage'
import { supabase } from './lib/supabase'
import { useTheme } from './hooks/useTheme'
import { xpForLog, levelFromXP } from './utils/xp'
import { computeStreakUpdate, checkStreakExpiry } from './utils/streaks'
import { useHydrationDecay } from './hooks/useHydrationDecay'
import { usePetSound } from './hooks/usePetSound'
import './App.css'

function App() {
  const { user, loading: userLoading, error: userError, updateUser } = useUser()
  const { todayTotal, lastLogTime, loading: logsLoading, logging, logWater } = useWaterLog(user?.id)
  const decayedTotal = useHydrationDecay(todayTotal, lastLogTime, logsLoading)
  const { challenges, loading: challengesLoading, updateProgress } = useChallenges(user?.id, user?.daily_goal_ml)

  const { playLogSound } = usePetSound()
  const { petId, selectPet } = usePetSelection()
  const { petName, updatePetName } = usePetName()
  const { theme, toggleTheme } = useTheme()

  const [activeTab, setActiveTab]           = useState('home')
  const [levelUp, setLevelUp]               = useState(null)
  const [streakHit, setStreakHit]           = useState(null)
  const [challengeDone, setChallengeDone]   = useState(null)
  const [showWelcome, setShowWelcome]       = useState(
    () => !localStorage.getItem('slurp_welcomed')
  )
  const [showInAppWarning, setShowInAppWarning] = useState(() => isInAppBrowser())

  useEffect(() => {
    if (!user) return
    const expiry = checkStreakExpiry(user.streak_current, user.streak_last_date)
    if (expiry) updateUser(expiry)
  }, [user?.id])

  // Keep-alive ping — prevents Supabase free tier from pausing the project.
  // Runs once on mount; a lightweight query is enough to count as activity.
  useEffect(() => {
    supabase.from('users').select('id').limit(1).then(() => {})
  }, [])

  if (userLoading) {
    return (
      <div className="app-shell">
        <div className="splash">
          <div className="splash-drop">💧</div>
          <p className="splash-text">Loading Slurp…</p>
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

    playLogSound()

    const updates = {}

    // XP & level
    const earned   = xpForLog(amount_ml)
    let   newXP    = user.xp + earned
    let   newLevel = levelFromXP(newXP)
    if (newLevel > user.level) setLevelUp(newLevel)

    // Streak
    const newTotal = todayTotal + amount_ml
    let newStreak = user.streak_current
    if (newTotal >= user.daily_goal_ml) {
      const streakUpdate = computeStreakUpdate(
        user.streak_current,
        user.streak_longest,
        user.streak_last_date,
      )
      if (streakUpdate) {
        Object.assign(updates, streakUpdate)
        setStreakHit(streakUpdate.streak_current)
        newStreak = streakUpdate.streak_current
      }
    }

    // Challenges
    const completed = await updateProgress({ amount_ml, newStreak })
    if (completed.length > 0) {
      const bonusXP = completed.reduce((sum, uc) => sum + uc.challenge.xp_reward, 0)
      newXP   += bonusXP
      newLevel = levelFromXP(newXP)
      if (newLevel > user.level) setLevelUp(newLevel)
      setChallengeDone(completed[0].challenge)
    }

    updates.xp    = newXP
    updates.level = newLevel

    // Update pet mood
    const newMood = getMoodFromProgress(todayTotal + amount_ml)
    updates.pet_state = { mood: newMood, last_fed: new Date().toISOString() }

    await updateUser(updates)
  }

  return (
    <div className="app-shell">
      {showInAppWarning && (
        <InAppBrowserModal onDismiss={() => setShowInAppWarning(false)} />
      )}
      {showWelcome && (
        <WelcomeModal onAccept={() => {
          localStorage.setItem('slurp_welcomed', 'true')
          setShowWelcome(false)
        }} />
      )}
      {levelUp && (
        <LevelUpToast level={levelUp} onDone={() => setLevelUp(null)} />
      )}
      {streakHit && (
        <StreakToast streak={streakHit} onDone={() => setStreakHit(null)} />
      )}
      {challengeDone && (
        <ChallengeToast challenge={challengeDone} onDone={() => setChallengeDone(null)} />
      )}

      <div className="app-topbar">
        <header className="app-header">
          <span className="header-title">💧 Slurp</span>
          <div className="header-right">
            <StreakBadge streak={user.streak_current} />
            <span className="header-user">{user.username}</span>
          </div>
        </header>
        <div className="xp-bar-row">
          <XPBar xp={user.xp} level={user.level} />
        </div>
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
                  todayTotal={decayedTotal}
                  actualTotal={todayTotal}
                  goalMl={user.daily_goal_ml}
                  petName={petName}
                  onNameChange={updatePetName}
                  centerContent={
                    <VirtualPet
                      todayTotal={decayedTotal}
                      goalMl={user.daily_goal_ml}
                      petId={petId}
                      compact
                    />
                  }
                />
              )}
            </section>

            <section className="home-section">
              <PetBubble todayTotal={decayedTotal} goalMl={user.daily_goal_ml} />
            </section>

            <section className="home-section">
              <PetSelector activePetId={petId} onSelect={selectPet} userLevel={user.level} userStreak={user.streak_current} userLongestStreak={user.streak_longest} />
            </section>

            <section className="home-section">
              <GoalSetter
                currentGoal={user.daily_goal_ml}
                onGoalChange={(ml) => updateUser({ daily_goal_ml: ml })}
              />
            </section>

            <section className="home-section">
              <WaterLogger onLog={handleLogWater} disabled={logging} />
            </section>
          </>
        )}

        {activeTab === 'challenges' && (
          <ChallengesPage
            challenges={challenges}
            loading={challengesLoading}
            userLevel={user.level}
            userStreak={user.streak_current}
            userLongestStreak={user.streak_longest}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardPage userId={user.id} />
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
