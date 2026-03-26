import './WaterProgress.css'

const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * Circular progress ring showing today's water intake vs. the daily goal.
 */
export function WaterProgress({ todayTotal, goalMl }) {
  const pct        = Math.min(todayTotal / goalMl, 1)
  const offset     = CIRCUMFERENCE * (1 - pct)
  const goalMet    = todayTotal >= goalMl
  const remaining  = Math.max(goalMl - todayTotal, 0)

  return (
    <div className="water-progress">
      <div className="ring-wrapper">
        <svg
          className="ring"
          viewBox="0 0 200 200"
          aria-label={`${todayTotal} of ${goalMl} ml logged today`}
        >
          {/* Track */}
          <circle
            className="ring-track"
            cx="100" cy="100"
            r={RADIUS}
            fill="none"
            strokeWidth="14"
          />
          {/* Fill */}
          <circle
            cx="100" cy="100"
            r={RADIUS}
            fill="none"
            strokeWidth="14"
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
            style={{
              stroke: goalMet ? 'var(--color-success)' : 'var(--color-primary)',
              strokeDasharray: CIRCUMFERENCE,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
            }}
          />
        </svg>

        <div className="ring-center">
          <span className="ring-value">{(todayTotal / 1000).toFixed(2)}L</span>
          <span className="ring-label">of {goalMl / 1000}L goal</span>
        </div>
      </div>

      {goalMet ? (
        <p className="goal-message goal-message--done">Goal reached! 🎉</p>
      ) : (
        <p className="goal-message">{remaining} ml to go</p>
      )}
    </div>
  )
}