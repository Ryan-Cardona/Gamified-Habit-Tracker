import { useState } from 'react'
import { DualWheel } from './DualWheel'
import './WaterLogger.css'

const GOAL_AMOUNTS = Array.from({ length: 96 }, (_, i) => (i + 5) * 50) // 250–5000 ml

function formatGoal(ml) {
  return ml >= 1000 ? `${(ml / 1000).toFixed(1)} L` : `${ml} ml`
}

export function GoalSetter({ currentGoal, onGoalChange }) {
  const [showWheel, setShowWheel] = useState(false)

  function handleConfirm(ml) {
    onGoalChange(ml)
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
            <DualWheel
              amounts={GOAL_AMOUNTS}
              defaultValue={currentGoal}
              onConfirm={handleConfirm}
              confirmLabel={(ml) => `Set Goal: ${formatGoal(ml)}`}
            />
          </div>
        </div>
      )}
    </div>
  )
}
