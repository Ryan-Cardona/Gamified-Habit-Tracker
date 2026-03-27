/**
 * XP & levelling utilities — pure functions, no side effects.
 */

// Cumulative XP required to reach each level (index = level - 1)
const LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  250,   // Level 3
  500,   // Level 4
  900,   // Level 5
  1400,  // Level 6
  2000,  // Level 7
  2800,  // Level 8
  3700,  // Level 9
  4800,  // Level 10
]

const MAX_DEFINED_LEVEL = LEVEL_THRESHOLDS.length

/**
 * XP earned for a single water log.
 * 1 XP per 10 ml, minimum 1 XP.
 */
export function xpForLog(amount_ml) {
  return Math.max(1, Math.floor(amount_ml / 10))
}

/**
 * Derives the level for a given total XP value.
 */
export function levelFromXP(totalXP) {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) level = i + 1
    else break
  }
  // Beyond the defined table: each extra level needs 1500 XP
  if (totalXP >= LEVEL_THRESHOLDS[MAX_DEFINED_LEVEL - 1]) {
    const extra = totalXP - LEVEL_THRESHOLDS[MAX_DEFINED_LEVEL - 1]
    level = MAX_DEFINED_LEVEL + Math.floor(extra / 1500)
  }
  return level
}

/**
 * XP needed to reach the next level from a given total XP.
 * Returns null if the player is beyond the defined table.
 */
export function xpToNextLevel(totalXP) {
  const level = levelFromXP(totalXP)
  const nextIndex = level // LEVEL_THRESHOLDS is 0-indexed, so level 1 = index 0, next = index 1
  if (nextIndex < LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[nextIndex] - totalXP
  }
  // Beyond the table
  const extra = totalXP - LEVEL_THRESHOLDS[MAX_DEFINED_LEVEL - 1]
  return 1500 - (extra % 1500)
}

/**
 * Progress (0–1) through the current level toward the next.
 */
export function levelProgress(totalXP) {
  const level = levelFromXP(totalXP)
  const currentIndex = level - 1
  const nextIndex = level

  let currentThreshold, nextThreshold

  if (nextIndex < LEVEL_THRESHOLDS.length) {
    currentThreshold = LEVEL_THRESHOLDS[currentIndex] ?? 0
    nextThreshold = LEVEL_THRESHOLDS[nextIndex]
  } else {
    // Beyond the table
    const extra = totalXP - LEVEL_THRESHOLDS[MAX_DEFINED_LEVEL - 1]
    currentThreshold = LEVEL_THRESHOLDS[MAX_DEFINED_LEVEL - 1] + Math.floor(extra / 1500) * 1500
    nextThreshold = currentThreshold + 1500
  }

  const range = nextThreshold - currentThreshold
  const progress = totalXP - currentThreshold
  return Math.min(progress / range, 1)
}
