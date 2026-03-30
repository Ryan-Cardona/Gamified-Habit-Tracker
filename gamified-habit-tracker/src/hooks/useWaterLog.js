import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

function getTodayRange() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return { start: start.toISOString(), end: end.toISOString() }
}

/**
 * Manages water logs for the current user.
 * Fetches today's logs on mount and after every new entry.
 */
export function useWaterLog(userId) {
  const [logs, setLogs]           = useState([])
  const [todayTotal, setTotal]    = useState(0)
  const [loading, setLoading]     = useState(true)
  const [logging, setLogging]     = useState(false)

  const fetchTodayLogs = useCallback(async () => {
    if (!userId) return
    const { start, end } = getTodayRange()
    const { data, error } = await supabase
      .from('water_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', start)
      .lte('logged_at', end)
      .order('logged_at', { ascending: false })

    if (!error && data) {
      setLogs(data)
      setTotal(data.reduce((sum, row) => sum + row.amount_ml, 0))
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchTodayLogs()
  }, [fetchTodayLogs])

  const logWater = useCallback(async (amount_ml) => {
    if (!userId || logging) return false
    setLogging(true)
    const { error } = await supabase
      .from('water_logs')
      .insert({ user_id: userId, amount_ml })

    setLogging(false)
    if (error) {
      console.error('Failed to log water:', error.message)
      return false
    }
    await fetchTodayLogs()
    return true
  }, [userId, logging, fetchTodayLogs])

  const lastLogTime = logs[0]?.logged_at ?? null

  return { logs, todayTotal, lastLogTime, loading, logging, logWater }
}