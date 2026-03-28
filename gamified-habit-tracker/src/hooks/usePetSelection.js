import { useState } from 'react'
import { DEFAULT_PET } from '../config/pets'

const STORAGE_KEY = 'hydroquest_pet'

/**
 * Persists the user's chosen pet in localStorage.
 */
export function usePetSelection() {
  const [petId, setPetId] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? DEFAULT_PET
  )

  function selectPet(id) {
    localStorage.setItem(STORAGE_KEY, id)
    setPetId(id)
  }

  return { petId, selectPet }
}
