import { useState } from 'react'
import './WaterProgress.css'

const RADIUS = 80
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const HYDRATION_MAX_ML = 1000

export function WaterProgress({ todayTotal, actualTotal, goalMl, centerContent, petName, onNameChange }) {
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState(petName)

  const displayed    = actualTotal ?? todayTotal
  const hydrationPct = Math.min(todayTotal / HYDRATION_MAX_ML, 1)
  const offset       = CIRCUMFERENCE * (1 - hydrationPct)
  const goalMet      = displayed >= goalMl
  const remaining    = Math.max(goalMl - displayed, 0)

  function handleSubmit(e) {
    e.preventDefault()
    onNameChange(draft)
    setEditing(false)
  }

  function handleBlur() {
    onNameChange(draft)
    setEditing(false)
  }

  return (
    <div className="water-progress">
      {/* ── Pet name above ring ── */}
      {editing ? (
        <form onSubmit={handleSubmit} className="pet-name-form">
          <input
            className="pet-name-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleBlur}
            maxLength={20}
            placeholder="Name your pet…"
            autoFocus
          />
        </form>
      ) : (
        <button className="pet-name-btn" onClick={() => { setDraft(petName); setEditing(true) }}>
          <span className="pet-name-label">{petName || 'Name your pet'}</span>
          <span className="pet-name-edit">✏️</span>
        </button>
      )}

      <div className="ring-wrapper">
        <svg
          className="ring"
          viewBox="0 0 200 200"
          aria-label={`${displayed} of ${goalMl} ml logged today`}
        >
          <circle className="ring-track" cx="100" cy="100" r={RADIUS} fill="none" strokeWidth="14" />
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
