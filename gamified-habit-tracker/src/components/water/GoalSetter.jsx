import { useState, useRef, useEffect } from 'react'
import './WaterLogger.css'

const GOAL_AMOUNTS = Array.from({ length: 96 }, (_, i) => (i + 5) * 50) // 250–5000 ml
const ITEM_HEIGHT  = 56
const PAD_COUNT    = 2

function formatGoal(ml) {
  return ml >= 1000 ? `${(ml / 1000).toFixed(1)} L` : `${ml} ml`
}

export function GoalSetter({ currentGoal, onGoalChange }) {
  const [showWheel, setShowWheel] = useState(false)
  const [selected, setSelected]   = useState(currentGoal)
  const wheelRef   = useRef(null)
  const scrollTimer = useRef(null)

  useEffect(() => {
    if (!showWheel || !wheelRef.current) return
    const index = GOAL_AMOUNTS.indexOf(currentGoal)
    const safeIndex = index >= 0 ? index : 0
    wheelRef.current.scrollTop = safeIndex * ITEM_HEIGHT
    setSelected(GOAL_AMOUNTS[safeIndex])
  }, [showWheel])

  function handleScroll() {
    clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => {
      if (!wheelRef.current) return
      const raw     = Math.round(wheelRef.current.scrollTop / ITEM_HEIGHT)
      const clamped = Math.max(0, Math.min(raw, GOAL_AMOUNTS.length - 1))
      wheelRef.current.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' })
      setSelected(GOAL_AMOUNTS[clamped])
    }, 80)
  }

  function handleConfirm() {
    onGoalChange(selected)
    setShowWheel(false)
  }

  return (
    <div className="water-logger">
      <button
        className="wheel-open-btn"
        onClick={() => setShowWheel(true)}
      >
        🎯 Daily Goal: {formatGoal(currentGoal)}
      </button>

      {showWheel && (
        <div className="wheel-backdrop" onClick={() => setShowWheel(false)}>
          <div className="wheel-sheet" onClick={(e) => e.stopPropagation()}>
            <p className="wheel-title">Set Daily Goal</p>

            <div className="wheel-container">
              <div className="wheel-highlight" />
              <ul className="wheel-list" ref={wheelRef} onScroll={handleScroll}>
                {Array.from({ length: PAD_COUNT }).map((_, i) => <li key={`p${i}`} className="wheel-pad" />)}
                {GOAL_AMOUNTS.map((ml) => (
                  <li key={ml} className={`wheel-item ${ml === selected ? 'wheel-item--selected' : ''}`}>
                    {formatGoal(ml)}
                  </li>
                ))}
                {Array.from({ length: PAD_COUNT }).map((_, i) => <li key={`p2${i}`} className="wheel-pad" />)}
              </ul>
            </div>

            <button className="wheel-log-btn" onClick={handleConfirm}>
              Set Goal: {formatGoal(selected)}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}