import { useState, useEffect, useRef } from 'react'

const GRACE_MINUTES      = 60           // no decay for the first hour
const DECAY_ML_PER_MIN   = 150 / 60     // 150 ml/hr = 2.5 ml/min
const HYDRATION_MAX      = 1000         // 1 L = 100%
const STORAGE_KEY        = 'slurp_hydration'

// ── Restore / persist hydration state across page reloads ──────────────────
function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null
  } catch {
    return null
  }
}
function saveState(peak, timestamp) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ peak, timestamp }))
}

function computeDecayed(peak, timestamp) {
  if (!timestamp) return 0
  const minutes = (Date.now() - new Date(timestamp).getTime()) / 60_000
  if (minutes <= GRACE_MINUTES) return peak
  return Math.max(0, peak - DECAY_ML_PER_MIN * (minutes - GRACE_MINUTES))
}

/**
 * Tracks a hydration level (0–1000 ml) that:
 *  - increases by the newly logged amount when water is logged
 *  - decays gradually when no water is logged
 *  - persists across page reloads via localStorage
 *
 * @param {number} todayTotal   - actual ml logged today (from Supabase)
 * @param {string} lastLogTime  - ISO timestamp of the most recent log
 */
export function useHydrationDecay(todayTotal, lastLogTime, loading = false) {
  // peak = hydration level at the moment of last log; decays from there
  const [peak, setPeak]         = useState(() => {
    const stored = loadState()
    return stored?.peak ?? Math.min(todayTotal, HYDRATION_MAX)
  })
  const [timestamp, setTimestamp] = useState(() => {
    const stored = loadState()
    return stored?.timestamp ?? lastLogTime
  })

  const prevTotalRef = useRef(null) // null = not yet seeded after load
  const loadedRef    = useRef(false)
  const peakRef      = useRef(peak)
  const tsRef        = useRef(timestamp)

  // Keep refs in sync
  useEffect(() => { peakRef.current = peak },     [peak])
  useEffect(() => { tsRef.current   = timestamp }, [timestamp])

  // Detect a new water log — ignore the initial fetch from Supabase
  useEffect(() => {
    if (loading) return

    if (!loadedRef.current) {
      // First time loading completes: seed the ref with the real total, no-op
      loadedRef.current      = true
      prevTotalRef.current   = todayTotal
      return
    }

    const added = todayTotal - prevTotalRef.current
    prevTotalRef.current = todayTotal
    if (added <= 0) return

    // Add logged amount to current decayed level (don't reset to full total)
    const currentLevel = computeDecayed(peakRef.current, tsRef.current)
    const newPeak      = Math.min(currentLevel + added, HYDRATION_MAX)
    const now          = new Date().toISOString()

    saveState(newPeak, now)
    setPeak(newPeak)
    setTimestamp(now)
  }, [todayTotal, loading])

  // Live display value — recomputed every second (debug) / minute (prod)
  const [displayed, setDisplayed] = useState(() =>
    Math.round(computeDecayed(peak, timestamp))
  )

  useEffect(() => {
    function tick() {
      setDisplayed(Math.round(computeDecayed(peakRef.current, tsRef.current)))
    }
    tick()
    const id = setInterval(tick, 60_000) // update every minute
    return () => clearInterval(id)
  }, [peak, timestamp])

  return displayed
}
