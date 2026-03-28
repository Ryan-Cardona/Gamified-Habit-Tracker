import { PETS, DEFAULT_PET } from '../../config/pets'
import './VirtualPet.css'

const MOODS = {
  thirsty:  { label: 'Thirsty',  message: 'I really need water...'      },
  neutral:  { label: 'Okay',     message: 'A little more water please.' },
  happy:    { label: 'Happy',    message: 'Feeling good, keep it up!'   },
  thriving: { label: 'Thriving', message: 'Fully hydrated, thank you!'  },
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
 * Builds the CSS background props to show the correct mood frame
 * from a sprite sheet. Handles non-square frames by scaling based
 * on the target display width while preserving aspect ratio.
 *
 * @param {object} petConfig    - entry from PETS registry
 * @param {string} moodKey      - 'thirsty' | 'neutral' | 'happy' | 'thriving'
 * @param {number} displayWidth - rendered width in px (height is derived from aspect ratio)
 */
function getSpriteStyle(petConfig, moodKey, displayWidth) {
  const { sprite, sheetWidth, sheetHeight, cols, rows, moodFrames } = petConfig
  const frame = moodFrames[moodKey]

  const frameW = sheetWidth  / cols   // 512
  const frameH = sheetHeight / rows   // 768

  const scale         = displayWidth / frameW
  const displayHeight = Math.round(frameH * scale)

  return {
    backgroundImage:    `url(${sprite})`,
    backgroundSize:     `${Math.round(sheetWidth * scale)}px ${Math.round(sheetHeight * scale)}px`,
    backgroundPosition: `-${frame.col * displayWidth}px -${frame.row * displayHeight}px`,
    backgroundRepeat:   'no-repeat',
    width:              displayWidth,
    height:             displayHeight,
  }
}

/**
 * Virtual pet display. Reacts to the user's hydration progress.
 *
 * Props:
 *   todayTotal  — ml logged today
 *   goalMl      — daily goal in ml
 *   petId       — key from the PETS registry (defaults to DEFAULT_PET)
 *   compact     — true = render just the sprite for inside the ring
 *                 false (default) = full card with wrapper circle + bubble
 */
export function VirtualPet({ todayTotal, goalMl, petId = DEFAULT_PET, compact = false }) {
  const moodKey   = getMoodFromProgress(todayTotal, goalMl)
  const petConfig = PETS[petId] ?? PETS[DEFAULT_PET]

  // compact: 150px wide → 225px tall (fills the ring; portrait frames are cropped by the circle)
  // full:    130px wide → 195px tall (inside the pet-asset circle wrapper)
  const spriteStyle = getSpriteStyle(petConfig, moodKey, compact ? 175 : 130)

  if (compact) {
    return (
      <div
        className={`pet-sprite pet-sprite--compact virtual-pet--${moodKey}`}
        style={{ ...spriteStyle, marginTop: '-10px',
                                  marginLeft: '-20px',}}
        role="img"
        aria-label={`${petConfig.name} is ${MOODS[moodKey].label}`}
      />
    )
  }

  return (
    <div className={`virtual-pet virtual-pet--${moodKey}`}>
      <div className="pet-asset">
        <div
          className="pet-sprite"
          style={spriteStyle}
          role="img"
          aria-label={`${petConfig.name} is ${MOODS[moodKey].label}`}
        />
      </div>

      <div className="pet-bubble">
        <span className="pet-message">{MOODS[moodKey].message}</span>
      </div>
    </div>
  )
}

/**
 * Just the speech bubble — rendered below the ring when the pet is in compact/center mode.
 */
export function PetBubble({ todayTotal, goalMl }) {
  const moodKey = getMoodFromProgress(todayTotal, goalMl)
  return (
    <div className="pet-bubble">
      <span className="pet-message">{MOODS[moodKey].message}</span>
    </div>
  )
}
