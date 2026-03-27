/**
 * Streak utilities — pure functions, no side effects.
 * All dates are handled in the user's local timezone.
 */

/** Returns today's date as a "YYYY-MM-DD" string in local time. */
export function todayString() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const dd   = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/** Returns yesterday's date as a "YYYY-MM-DD" string in local time. */
export function yesterdayString() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const yyyy = d.getFullYear()
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const dd   = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Given the current streak state and whether today's goal was just met,
 * returns the new { streak_current, streak_longest, streak_last_date } values.
 *
 * Call this only when today's total has just crossed the daily goal.
 */
export function computeStreakUpdate(streakCurrent, streakLongest, lastDate) {
  const today     = todayString()
  const yesterday = yesterdayString()

  // Goal already counted today — no change
  if (lastDate === today) {
    return null
  }

  let newCurrent
  if (lastDate === yesterday) {
    // Continued the streak
    newCurrent = streakCurrent + 1
  } else {
    // Missed at least one day — start fresh
    newCurrent = 1
  }

  const newLongest = Math.max(newCurrent, streakLongest)

  return {
    streak_current:   newCurrent,
    streak_longest:   newLongest,
    streak_last_date: today,
  }
}

/**
 * Call on app load. If the last recorded streak date is before yesterday,
 * the streak has been broken and should reset to 0.
 * Returns streak_current = 0 if broken, otherwise null (no change needed).
 */
export function checkStreakExpiry(streakCurrent, lastDate) {
  if (!lastDate || streakCurrent === 0) return null
  const yesterday = yesterdayString()
  // If last date is today or yesterday, streak is still alive
  if (lastDate >= yesterday) return null
  // Streak broken
  return { streak_current: 0 }
}
