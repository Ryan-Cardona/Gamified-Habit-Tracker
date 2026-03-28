import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Fetches all users ranked by XP descending.
 * Re-fetches whenever the current user's ID changes.
 */
export function useLeaderboard(userId) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('id, username, xp, level, streak_current')
        .order('xp', { ascending: false })
        .limit(50)

      if (!error && data) setEntries(data)
      setLoading(false)
    }
    fetch()
  }, [userId])

  return { entries, loading }
}