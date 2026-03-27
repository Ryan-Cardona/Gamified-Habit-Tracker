import { useEffect } from 'react'
import './StreakToast.css'

const FIREBALLS = [
  { left: '10%', delay: '0s',    size: '2.5rem' },
  { left: '25%', delay: '0.15s', size: '3.5rem' },
  { left: '42%', delay: '0.05s', size: '4rem'   },
  { left: '60%', delay: '0.2s',  size: '3rem'   },
  { left: '75%', delay: '0.1s',  size: '3.5rem' },
  { left: '88%', delay: '0.25s', size: '2.5rem' },
]

/**
 * Fire celebration overlay shown when the user earns or extends a streak.
 * Auto-dismisses after 2.8 seconds.
 */
export function StreakToast({ streak, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <div className="streak-overlay" onClick={onDone}>
      {/* Rising fireballs */}
      {FIREBALLS.map((f, i) => (
        <span
          key={i}
          className="fireball"
          style={{
            left:              f.left,
            fontSize:          f.size,
            animationDelay:    f.delay,
          }}
        >
          🔥
        </span>
      ))}

      {/* Central card */}
      <div className="streak-card">
        <div className="streak-icon">🔥</div>
        <p className="streak-title">Streak!</p>
        <p className="streak-number">{streak} {streak === 1 ? 'Day' : 'Days'}</p>
        <p className="streak-hint">Tap to continue</p>
      </div>
    </div>
  )
}