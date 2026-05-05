import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { todayString } from '../utils/streaks'

function effectiveTarget(challenge, dailyGoalMl) {
  if (challenge.target_multiplier != null && dailyGoalMl != null) {
    return Math.round(dailyGoalMl * challenge.target_multiplier)
  }
  return challenge.target_value
}

function enrichChallenge(uc, dailyGoalMl) {
  return {
    ...uc,
    challenge: {
      ...uc.challenge,
      effective_target: effectiveTarget(uc.challenge, dailyGoalMl),
    },
  }
}

/**
 * Manages daily challenge assignment and progress for the current user.
 * On mount, ensures every active challenge has a user_challenges row for today.
 */
export function useChallenges(userId, dailyGoalMl) {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading]       = useState(true)

  const fetchChallenges = useCallback(async () => {
    if (!userId) return
    const today = todayString()

    const { data, error } = await supabase
      .from('user_challenges')
      .select('*, challenge:challenges(*)')
      .eq('user_id', userId)
      .eq('assigned_date', today)

    if (error) { console.error('Failed to fetch challenges:', error.message); return }

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
      const { data: refreshed } = await supabase
        .from('user_challenges')
        .select('*, challenge:challenges(*)')
        .eq('user_id', userId)
        .eq('assigned_date', today)
      setChallenges((refreshed || []).map(uc => enrichChallenge(uc, dailyGoalMl)))
    } else {
      setChallenges((data || []).map(uc => enrichChallenge(uc, dailyGoalMl)))
    }

    setLoading(false)
  }, [userId, dailyGoalMl])

  useEffect(() => { fetchChallenges() }, [fetchChallenges])

  const updateProgress = useCallback(async ({ amount_ml, newStreak }) => {
    const incomplete = challenges.filter(uc => !uc.completed)
    if (incomplete.length === 0) return []

    const newlyCompleted = []

    for (const uc of incomplete) {
      const { metric, effective_target } = uc.challenge
      let newProgress = uc.progress

      if (metric === 'ml_logged')   newProgress += amount_ml
      if (metric === 'log_count')   newProgress += 1
      if (metric === 'single_log')  newProgress = Math.max(newProgress, amount_ml)
      if (metric === 'streak_days') newProgress = newStreak

      const justCompleted = newProgress >= effective_target

      await supabase
        .from('user_challenges')
        .update({
          progress:     newProgress,
          completed:    justCompleted,
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