import { useState, useRef, useEffect } from 'react'

const ITEM_HEIGHT = 56
const PAD_COUNT   = 2

export function DualWheel({ amounts, defaultValue, onConfirm, confirmLabel, disabled }) {
  const startIdx    = Math.max(0, amounts.indexOf(defaultValue ?? amounts[0]))
  const [selected, setSelected] = useState(amounts[startIdx])

  const listRef  = useRef(null)
  const timer    = useRef(null)

  // Scroll to default on mount
  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = startIdx * ITEM_HEIGHT
  }, [])

  function handleScroll() {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      if (!listRef.current) return
      const raw     = Math.round(listRef.current.scrollTop / ITEM_HEIGHT)
      const clamped = Math.max(0, Math.min(raw, amounts.length - 1))
      listRef.current.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' })
      setSelected(amounts[clamped])
    }, 80)
  }

  return (
    <>
      <div className="dual-wheel">
        <div className="wheel-container">
          <div className="wheel-highlight" />
          <ul className="wheel-list" ref={listRef} onScroll={handleScroll}>
            {Array.from({ length: PAD_COUNT }).map((_, i) => <li key={`p${i}`} className="wheel-pad" />)}
            {amounts.map((val) => (
              <li key={val} className={`wheel-item ${val === selected ? 'wheel-item--selected' : ''}`}>
                {val} ml
              </li>
            ))}
            {Array.from({ length: PAD_COUNT }).map((_, i) => <li key={`p2${i}`} className="wheel-pad" />)}
          </ul>
        </div>
      </div>

      <button
        className="wheel-log-btn"
        onClick={() => onConfirm(selected)}
        disabled={disabled}
      >
        {confirmLabel(selected)}
      </button>
    </>
  )
}
