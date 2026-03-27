import { useEffect } from 'react'
import './ChallengeToast.css'

/**
 * Slide-up toast shown briefly when a challenge is completed.
 * Auto-dismisses after 2.5 seconds.
 */
export function ChallengeToast({ challenge, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2500)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="challenge-toast" onClick={onDone}>
      <span className="challenge-toast-icon">🏆</span>
      <div className="challenge-toast-text">
        <span className="challenge-toast-title">Challenge Complete!</span>
        <span className="challenge-toast-name">{challenge.title}</span>
      </div>
      <span className="challenge-toast-xp">+{challenge.xp_reward} XP</span>
    </div>
  )
}