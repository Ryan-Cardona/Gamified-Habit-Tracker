import { useEffect } from 'react'
import './LevelUpToast.css'

/**
 * Full-screen celebration overlay shown briefly when the user levels up.
 * Auto-dismisses after 2.5 seconds.
 */
export function LevelUpToast({ level, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2500)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="levelup-overlay" onClick={onDone}>
      <div className="levelup-card">
        <div className="levelup-star">⭐</div>
        <p className="levelup-title">Level Up!</p>
        <p className="levelup-level">Level {level}</p>
        <p className="levelup-hint">Tap to continue</p>
      </div>
    </div>
  )
}
