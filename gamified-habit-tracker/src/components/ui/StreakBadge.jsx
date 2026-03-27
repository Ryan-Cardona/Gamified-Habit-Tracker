import './StreakBadge.css'

/**
 * Compact flame badge showing the current streak count.
 */
export function StreakBadge({ streak }) {
  const isActive = streak > 0

  return (
    <div className={`streak-badge ${isActive ? 'streak-badge--active' : ''}`} title={`${streak} day streak`}>
      <span className={`streak-flame ${!isActive ? 'streak-flame--inactive' : ''}`}>🔥</span>
      <span className="streak-count">{streak}</span>
    </div>
  )
}
