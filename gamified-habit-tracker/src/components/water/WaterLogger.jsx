import { useState } from 'react'
import './WaterLogger.css'

const QUICK_AMOUNTS = [150, 250, 500, 750]

/**
 * Quick-log buttons and a custom amount input.
 * Calls onLog(amount_ml) when the user logs water.
 */
export function WaterLogger({ onLog, disabled }) {
  const [custom, setCustom]   = useState('')
  const [error, setError]     = useState('')

  function handleQuick(amount) {
    setError('')
    onLog(amount)
  }

  function handleCustomSubmit(e) {
    e.preventDefault()
    const amount = parseInt(custom, 10)
    if (!amount || amount <= 0 || amount > 5000) {
      setError('Enter a number between 1 and 5000 ml')
      return
    }
    setError('')
    setCustom('')
    onLog(amount)
  }

  return (
    <div className="water-logger">
      <p className="logger-label">Quick add</p>

      <div className="quick-grid">
        {QUICK_AMOUNTS.map((ml) => (
          <button
            key={ml}
            className="quick-btn"
            onClick={() => handleQuick(ml)}
            disabled={disabled}
          >
            <span className="quick-drop">💧</span>
            <span className="quick-ml">{ml} ml</span>
          </button>
        ))}
      </div>

      <form className="custom-form" onSubmit={handleCustomSubmit}>
        <p className="logger-label">Custom amount</p>
        <div className="custom-row">
          <input
            type="number"
            className="custom-input"
            placeholder="e.g. 330"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            min="1"
            max="5000"
            disabled={disabled}
            aria-label="Custom amount in ml"
          />
          <span className="custom-unit">ml</span>
          <button
            type="submit"
            className="custom-btn"
            disabled={disabled || !custom}
          >
            Log
          </button>
        </div>
        {error && <p className="custom-error">{error}</p>}
      </form>
    </div>
  )
}
