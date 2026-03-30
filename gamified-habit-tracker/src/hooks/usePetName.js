import { useState } from 'react'

const STORAGE_KEY = 'hydroquest_pet_name'

export function usePetName() {
  const [petName, setPetName] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? ''
  )

  function updatePetName(name) {
    const trimmed = name.trim()
    localStorage.setItem(STORAGE_KEY, trimmed)
    setPetName(trimmed)
  }

  return { petName, updatePetName }
}
