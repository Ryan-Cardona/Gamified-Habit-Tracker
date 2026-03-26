import { useState, useEffect, useCallback } from 'react'
import { initAnonymousUser } from '../lib/anonymousUser'
import { supabase } from '../lib/supabase'

/**
 * Loads (or creates) the anonymous user on mount.
 * Returns the user record and a helper to update fields locally + in Supabase.
 */
export function useUser() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    initAnonymousUser()
      .then(setUser)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  /**
   * Update specific fields on the user record.
   * Merges changes locally (instant UI) then persists to Supabase.
   */
  const updateUser = useCallback(async (fields) => {
    if (!user) return
    setUser((prev) => ({ ...prev, ...fields }))
    const { error } = await supabase
      .from('users')
      .update(fields)
      .eq('id', user.id)
    if (error) console.error('Failed to update user:', error.message)
  }, [user])

  return { user, loading, error, updateUser }
}
