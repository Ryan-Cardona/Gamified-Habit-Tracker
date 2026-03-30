import { useState, useRef, useEffect } from 'react'
import './WaterLogger.css'

// 50 → 1000 in steps of 50
const WHEEL_AMOUNTS = Array.from({ length: 20 }, (_, i) => (i + 1) * 50)

const ITEM_HEIGHT = 56  // px — height of each wheel item

export function WaterLogger({ onLog, disabled }) {
  const [showWheel, setShowWheel]   = useState(false)
  const [selected, setSelected]     = useState(250)
  const wheelRef                    = useRef(null)
  const scrollTimer                 = useRef(null)

  // Scroll the wheel to the selected value on open
  useEffect(() => {
    if (!showWheel || !wheelRef.current) return
    const index = WHEEL_AMOUNTS.indexOf(selected)
    wheelRef.current.scrollTop = index * ITEM_HEIGHT
  }, [showWheel])

  function handleScroll() {
    clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => {
      if (!wheelRef.current) return
      const index = Math.round(wheelRef.current.scrollTop / ITEM_HEIGHT)
      const clamped = Math.max(0, Math.min(index, WHEEL_AMOUNTS.length - 1))
      // Snap to nearest item
      wheelRef.current.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' })
      setSelected(WHEEL_AMOUNTS[clamped])
    }, 80)
  }

  function handleLog() {
    onLog(selected)
    setShowWheel(false)
  }

  return (
    <div className="water-logger">
      <button
        className="wheel-open-btn"
        onClick={() => setShowWheel(true)}
        disabled={disabled}
      >
        💧 Log Water
      </button>

      {showWheel && (
        <div className="wheel-backdrop" onClick={() => setShowWheel(false)}>
          <div className="wheel-sheet" onClick={(e) => e.stopPropagation()}>

            <p className="wheel-title">Select amount</p>

            <div className="wheel-container">
              {/* highlight bar behind the center item */}
              <div className="wheel-highlight" />

              <ul
                className="wheel-list"
                ref={wheelRef}
                onScroll={handleScroll}
              >
                {/* padding items so first/last can center */}
                <li className="wheel-pad" />
                <li className="wheel-pad" />
                {WHEEL_AMOUNTS.map((ml) => (
                  <li
                    key={ml}
                    className={`wheel-item ${ml === selected ? 'wheel-item--selected' : ''}`}
                  >
                    {ml} ml
                  </li>
                ))}
                <li className="wheel-pad" />
                <li className="wheel-pad" />
              </ul>
            </div>

            <button
              className="wheel-log-btn"
              onClick={handleLog}
              disabled={disabled}
            >
              Log {selected} ml
            </button>

          </div>
        </div>
      )}
    </div>
  )
}