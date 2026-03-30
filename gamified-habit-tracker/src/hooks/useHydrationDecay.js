import { useState, useEffect, useRef } from 'react'

const GRACE_MINUTES = 0.1  // DEBUG: ~6 seconds grace
const DECAY_MINUTES = 1    // DEBUG: full decay over ~1 minute
const HYDRATION_MAX = 1000 // 1 L = 100%
const STORAGE_KEY   = 'hydroquest_hydration'

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

function computeFactor(timestamp) {
  if (!timestamp) return 0
  const minutes = (Date.now() - new Date(timestamp).getTime()) / 60_000
  if (minutes <= GRACE_MINUTES) return 1
  return Math.max(0, 1 - (minutes - GRACE_MINUTES) / DECAY_MINUTES)
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
export function useHydrationDecay(todayTotal, lastLogTime) {
  // peak = hydration level at the moment of last log; decays from there
  const [peak, setPeak]         = useState(() => {
    const stored = loadState()
    return stored?.peak ?? Math.min(todayTotal, HYDRATION_MAX)
  })
  const [timestamp, setTimestamp] = useState(() => {
    const stored = loadState()
    return stored?.timestamp ?? lastLogTime
  })

  const prevTotalRef = useRef(todayTotal)
  const peakRef      = useRef(peak)
  const tsRef        = useRef(timestamp)

  // Keep refs in sync
  useEffect(() => { peakRef.current = peak },     [peak])
  useEffect(() => { tsRef.current   = timestamp }, [timestamp])

  // Detect a new water log
  useEffect(() => {
    const added = todayTotal - prevTotalRef.current
    prevTotalRef.current = todayTotal
    if (added <= 0) return

    // Add logged amount to current decayed level (don't reset to full total)
    const currentLevel = peakRef.current * computeFactor(tsRef.current)
    const newPeak      = Math.min(currentLevel + added, HYDRATION_MAX)
    const now          = new Date().toISOString()

    saveState(newPeak, now)
    setPeak(newPeak)
    setTimestamp(now)
  }, [todayTotal])

  // Live display value — recomputed every second (debug) / minute (prod)
  const [displayed, setDisplayed] = useState(() =>
    Math.round(peak * computeFactor(timestamp))
  )

  useEffect(() => {
    function tick() {
      setDisplayed(Math.round(peakRef.current * computeFactor(tsRef.current)))
    }
    tick()
    const id = setInterval(tick, 1_000) // DEBUG: 1s — change to 60_000 for prod
    return () => clearInterval(id)
  }, [peak, timestamp])

  return displayed
}
