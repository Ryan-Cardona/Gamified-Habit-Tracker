import './WaterProgress.css'

const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * Circular progress ring. Accepts optional centerContent to render
 * inside the ring (e.g. the virtual pet). Water amount is shown below.
 */
const HYDRATION_MAX_ML = 1000 // 1 L = 100% hydration

export function WaterProgress({ todayTotal, actualTotal, goalMl, centerContent }) {
  const displayed   = actualTotal ?? todayTotal
  const hydrationPct = Math.min(todayTotal / HYDRATION_MAX_ML, 1) // ring fill
  const offset      = CIRCUMFERENCE * (1 - hydrationPct)
  const goalMet     = displayed >= goalMl
  const remaining   = Math.max(goalMl - displayed, 0)

  return (
    <div className="water-progress">
      <div className="ring-wrapper">
        <svg
          className="ring"
          viewBox="0 0 200 200"
          aria-label={`${displayed} of ${goalMl} ml logged today`}
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
              stroke: hydrationPct >= 1 ? 'var(--color-success)' : 'var(--color-primary)',
              strokeDasharray: CIRCUMFERENCE,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease',
            }}
          />
        </svg>

        <div className="ring-center">
          {centerContent || (
            <>
              <span className="ring-value">{(displayed / 1000).toFixed(2)}L</span>
              <span className="ring-label">of {goalMl / 1000}L goal</span>
            </>
          )}
        </div>
      </div>

      {/* Water amount shown below when pet occupies the centre */}
      {centerContent && (
        <div className="ring-stats">
          <span className="ring-stats-value">{(displayed / 1000).toFixed(2)}L</span>
          <span className="ring-stats-label">of {goalMl / 1000}L goal</span>
        </div>
      )}

      {goalMet ? (
        <p className="goal-message goal-message--done">Goal reached! 🎉</p>
      ) : (
        <p className="goal-message">{remaining} ml to go</p>
      )}
    </div>
  )
}
