import { PETS, DEFAULT_PET } from '../../config/pets'
import './VirtualPet.css'

const MOODS = {
  thirsty:  { label: 'Thirsty',  message: 'I really need water...'      },
  neutral:  { label: 'Okay',     message: 'A little more water please.' },
  happy:    { label: 'Happy',    message: 'Feeling good, keep it up!'   },
  thriving: { label: 'Thriving', message: 'Fully hydrated, thank you!'  },
}

export function getMoodFromProgress(todayTotal, goalMl) {
  const pct = todayTotal / goalMl
  if (pct <= 0)  return 'thirsty'
  if (pct < 0.5) return 'neutral'
  if (pct < 1.0) return 'happy'
  return 'thriving'
}

/**
 * compact={true} — image only, for inside the progress ring.
 * default         — image + speech bubble.
 */
export function VirtualPet({ todayTotal, goalMl, petId = DEFAULT_PET, compact = false }) {
  const moodKey   = getMoodFromProgress(todayTotal, goalMl)
  const petConfig = PETS[petId] ?? PETS[DEFAULT_PET]
  const src       = petConfig.moodImages[moodKey]

  if (compact) {
    return (
      <img
        src={src}
        alt={`${petConfig.name} is ${MOODS[moodKey].label}`}
        className={`pet-img pet-img--compact virtual-pet--${moodKey}`}
      />
    )
  }

  return (
    <div className={`virtual-pet virtual-pet--${moodKey}`}>
      <div className="pet-asset">
        <img
          src={src}
          alt={`${petConfig.name} is ${MOODS[moodKey].label}`}
          className="pet-img"
        />
      </div>
      <div className="pet-bubble">
        <span className="pet-message">{MOODS[moodKey].message}</span>
      </div>
    </div>
  )
}

export function PetBubble({ todayTotal, goalMl }) {
  const moodKey = getMoodFromProgress(todayTotal, goalMl)
  return (
    <div className="pet-bubble">
      <span className="pet-message">{MOODS[moodKey].message}</span>
    </div>
  )
}
