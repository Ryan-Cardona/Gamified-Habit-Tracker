import { useRef, useCallback } from 'react'

const LOG_SOUND = '/sounds/water-log.wav'

export function usePetSound() {
  const audioCache = useRef({})

  const playLogSound = useCallback(() => {
    try {
      if (!audioCache.current.log) audioCache.current.log = new Audio(LOG_SOUND)
      const audio = audioCache.current.log
      audio.currentTime = 0
      audio.play().catch(() => {})
    } catch {
      // Audio not supported or file missing — fail silently
    }
  }, [])

  return { playLogSound }
}
