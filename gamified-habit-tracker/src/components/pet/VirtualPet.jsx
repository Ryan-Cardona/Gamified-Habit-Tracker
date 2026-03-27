import './VirtualPet.css'

/**
 * Mood config — swap the emoji for a real image src later.
 * To use your own asset: replace the emoji string with an <img> tag
 * and put your file in /public/pet/
 */
const MOODS = {
  thirsty:  { emoji: '😓', label: 'Thirsty',  message: 'I really need water...'       },
  neutral:  { emoji: '😐', label: 'Okay',     message: 'A little more water please.'  },
  happy:    { emoji: '😊', label: 'Happy',    message: 'Feeling good, keep it up!'    },
  thriving: { emoji: '🥳', label: 'Thriving', message: 'Fully hydrated, thank you!'   },
}

/**
 * Derives the pet mood from today's hydration progress.
 */
export function getMoodFromProgress(todayTotal, goalMl) {
  const pct = todayTotal / goalMl
  if (pct <= 0)  return 'thirsty'
  if (pct < 0.5) return 'neutral'
  if (pct < 1.0) return 'happy'
  return 'thriving'
}

/**
 * Virtual pet display. Reacts to the user's hydration progress.
 *
 * To plug in your real pet asset later:
 * 1. Drop your image into /public/pet/ (e.g. pet.png)
 * 2. Replace the <span className="pet-emoji"> block with:
 *    <img src="/pet/pet.png" className="pet-image" alt="your pet" />
 */
export function VirtualPet({ todayTotal, goalMl }) {
  const moodKey = getMoodFromProgress(todayTotal, goalMl)
  const mood    = MOODS[moodKey]

  return (
    <div className={`virtual-pet virtual-pet--${moodKey}`}>
      {/* ── Pet asset slot ── */}
      <div className="pet-asset">
        <span className="pet-emoji">{mood.emoji}</span>
      </div>

      {/* ── Speech bubble ── */}
      <div className="pet-bubble">
        <span className="pet-message">{mood.message}</span>
      </div>
    </div>
  )
}