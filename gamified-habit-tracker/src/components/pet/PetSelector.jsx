import { PETS, isPetUnlocked } from '../../config/pets'
import './PetSelector.css'

function lockLabel(pet) {
  if (pet.unlockStreak != null) return `${pet.unlockStreak}🔥`
  return `Lv.${pet.unlockLevel}`
}

function lockAriaLabel(pet) {
  if (pet.unlockStreak != null) return `${pet.name} — unlocks at a ${pet.unlockStreak}-day streak`
  return `${pet.name} — unlocks at level ${pet.unlockLevel}`
}

export function PetSelector({ activePetId, onSelect, userLevel, userStreak, userLongestStreak = 0 }) {
  return (
    <div className="pet-selector">
      <span className="pet-selector-label">Choose your pet</span>
      <div className="pet-selector-options">
        {Object.values(PETS).map((pet) => {
          const locked = !isPetUnlocked(pet, { userLevel, userStreak, userLongestStreak })
          return (
            <button
              key={pet.id}
              className={`pet-option ${activePetId === pet.id ? 'pet-option--active' : ''} ${locked ? 'pet-option--locked' : ''}`}
              onClick={() => !locked && onSelect(pet.id)}
              aria-label={locked ? lockAriaLabel(pet) : pet.name}
              aria-disabled={locked}
            >
              {!locked && <span className="pet-option-icon">{pet.icon}</span>}
              {!locked && <span className="pet-option-name">{pet.name}</span>}
              {locked && (
                <span className="pet-option-lock">
                  <span className="pet-option-lock-icon" />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}