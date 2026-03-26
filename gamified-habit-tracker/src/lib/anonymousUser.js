import { supabase } from './supabase'

const STORAGE_KEY = 'hydroquest_user_id'

const ADJECTIVES = [
  'Swift', 'Calm', 'Bold', 'Bright', 'Cool', 'Crisp', 'Deep', 'Epic',
  'Fast', 'Fierce', 'Fresh', 'Grand', 'Happy', 'Icy', 'Keen', 'Lively',
  'Mighty', 'Noble', 'Pure', 'Quick', 'Rare', 'Sly', 'Tidy', 'Vast',
  'Wise', 'Zany', 'Aqua', 'Brisk', 'Chill', 'Dewy',
]

const ANIMALS = [
  'Otter', 'Seal', 'Whale', 'Dolphin', 'Frog', 'Newt', 'Crab', 'Gull',
  'Heron', 'Ibis', 'Koi', 'Loon', 'Mink', 'Newt', 'Pike', 'Quail',
  'Raven', 'Swan', 'Teal', 'Vole', 'Wolf', 'Lynx', 'Bear', 'Hawk',
]

function generateUsername() {
  const adj    = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  const num    = Math.floor(Math.random() * 99) + 1
  return `${adj}${animal}${num}`
}

function getStoredUserId() {
  return localStorage.getItem(STORAGE_KEY)
}

function storeUserId(id) {
  localStorage.setItem(STORAGE_KEY, id)
}

/**
 * Returns the current user record from Supabase.
 * - If a UUID exists in localStorage, fetches that user.
 * - If not, generates a new UUID + username and inserts a new row.
 */
export async function initAnonymousUser() {
  let userId = getStoredUserId()

  // Returning visitor — fetch existing record
  if (userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (data && !error) return data

    // Row missing (e.g. DB was reset) — fall through to create a new one
  }

  // New visitor — create a fresh identity
  userId = crypto.randomUUID()
  const username = generateUsername()

  const { data, error } = await supabase
    .from('users')
    .insert({ id: userId, username })
    .select()
    .single()

  if (error) throw new Error(`Failed to create user: ${error.message}`)

  storeUserId(userId)
  return data
}
