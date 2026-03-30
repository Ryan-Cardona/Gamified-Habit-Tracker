import { PETS } from '../../config/pets'
import './PetSelector.css'

export function PetSelector({ activePetId, onSelect }) {
  return (
    <div className="pet-selector">
      <span className="pet-selector-label">Choose your pet</span>
      <div className="pet-selector-options">
        {Object.values(PETS).map((pet) => (
          <button
            key={pet.id}
            className={`pet-option ${activePetId === pet.id ? 'pet-option--active' : ''}`}
            onClick={() => onSelect(pet.id)}
            aria-label={pet.name}
          >
            <span className="pet-option-icon">{pet.icon}</span>
            <span className="pet-option-name">{pet.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
