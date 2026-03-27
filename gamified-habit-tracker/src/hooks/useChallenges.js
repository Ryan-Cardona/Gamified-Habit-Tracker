import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { todayString } from '../utils/streaks'

/**
 * Manages daily challenge assignment and progress for the current user.
 * On mount, ensures every active challenge has a user_challenges row for today.
 */
export function useChallenges(userId) {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading]       = useState(true)

  const fetchChallenges = useCallback(async () => {
    if (!userId) return
    const today = todayString()

    // Fetch today's assigned user_challenges with challenge details
    const { data, error } = await supabase
      .from('user_challenges')
      .select('*, challenge:challenges(*)')
      .eq('user_id', userId)
      .eq('assigned_date', today)

    if (error) { console.error('Failed to fetch challenges:', error.message); return }

    // Check if any active challenges are missing for today
    const { data: allChallenges } = await supabase
      .from('challenges')
      .select('*')
      .eq('active', true)

    const assignedIds = (data || []).map(uc => uc.challenge_id)
    const missing = (allChallenges || []).filter(c => !assignedIds.includes(c.id))

    if (missing.length > 0) {
      await supabase.from('user_challenges').insert(
        missing.map(c => ({ user_id: userId, challenge_id: c.id, assigned_date: today }))
      )
      // Re-fetch after inserting
      const { data: refreshed } = await supabase
        .from('user_challenges')
        .select('*, challenge:challenges(*)')
        .eq('user_id', userId)
        .eq('assigned_date', today)
      setChallenges(refreshed || [])
    } else {
      setChallenges(data || [])
    }

    setLoading(false)
  }, [userId])

  useEffect(() => { fetchChallenges() }, [fetchChallenges])

  /**
   * Called after every water log.
   * Updates progress for all incomplete challenges and returns newly completed ones.
   *
   * @param {number} amount_ml - ml just logged
   * @param {number} newStreak - user's streak after this log
   */
  const updateProgress = useCallback(async ({ amount_ml, newStreak }) => {
    const incomplete = challenges.filter(uc => !uc.completed)
    if (incomplete.length === 0) return []

    const newlyCompleted = []

    for (const uc of incomplete) {
      const { metric, target_value } = uc.challenge
      let newProgress = uc.progress

      if (metric === 'ml_logged')   newProgress += amount_ml
      if (metric === 'log_count')   newProgress += 1
      if (metric === 'single_log')  newProgress = Math.max(newProgress, amount_ml)
      if (metric === 'streak_days') newProgress = newStreak

      const justCompleted = !uc.completed && newProgress >= target_value

      await supabase
        .from('user_challenges')
        .update({
          progress:     newProgress,
          completed:    newProgress >= target_value,
          completed_at: justCompleted ? new Date().toISOString() : null,
        })
        .eq('id', uc.id)

      if (justCompleted) newlyCompleted.push({ ...uc, progress: newProgress })
    }

    await fetchChallenges()
    return newlyCompleted
  }, [challenges, fetchChallenges])

  return { challenges, loading, updateProgress }
}
