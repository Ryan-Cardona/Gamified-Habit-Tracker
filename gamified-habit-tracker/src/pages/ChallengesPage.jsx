import { ChallengeCard } from '../components/challenges/ChallengeCard'
import { PETS, isPetUnlocked } from '../config/pets'
import './ChallengesPage.css'

function PetUnlockCard({ pet, userLevel, userStreak, userLongestStreak = 0 }) {
  const unlocked = isPetUnlocked(pet, { userLevel, userStreak, userLongestStreak })

  let pct, progressLabel, badgeLabel, description

  if (pet.unlockStreak != null) {
    const bestStreak = Math.max(userStreak, userLongestStreak)
    pct          = Math.min(bestStreak / pet.unlockStreak, 1)
    progressLabel = unlocked ? '✓ Unlocked' : `${bestStreak} / ${pet.unlockStreak} days`
    badgeLabel   = `${pet.unlockStreak}🔥`
    description  = unlocked
      ? 'Unlocked and ready to use!'
      : `Keep a ${pet.unlockStreak}-day streak to unlock this pet.`
  } else {
    pct          = Math.min(userLevel / pet.unlockLevel, 1)
    progressLabel = unlocked ? '✓ Unlocked' : `Lv.${userLevel} / ${pet.unlockLevel}`
    badgeLabel   = `Lv.${pet.unlockLevel}`
    description  = unlocked
      ? 'Unlocked and ready to use!'
      : `Reach level ${pet.unlockLevel} to unlock this pet.`
  }

  return (
    <div className={`challenge-card card ${unlocked ? 'challenge-card--done' : ''}`}>
      <div className="challenge-header">
        <span className="challenge-title">{pet.icon} {pet.name}</span>
        <span className="pet-unlock-level">{badgeLabel}</span>
      </div>
      <p className="challenge-desc">{description}</p>
      <div className="challenge-footer">
        <div className="challenge-track">
          <div className="challenge-fill" style={{ width: `${pct * 100}%` }} />
        </div>
        <span className="challenge-progress">{progressLabel}</span>
      </div>
    </div>
  )
}

export function ChallengesPage({ challenges, loading, userLevel, userStreak, userLongestStreak = 0 }) {
  const done    = challenges.filter(uc => uc.completed)
  const pending = challenges.filter(uc => !uc.completed)

  const pets         = Object.values(PETS)
  const lockedPets   = pets.filter(p => !isPetUnlocked(p, { userLevel, userStreak, userLongestStreak }))
  const unlockedPets = pets.filter(p =>  isPetUnlocked(p, { userLevel, userStreak, userLongestStreak }))

  return (
    <div className="challenges-page">
      <div className="challenges-page-header">
        <h1 className="challenges-page-title">🎖️ Today's Challenges</h1>
        <p className="challenges-page-sub">
          {done.length} / {challenges.length} completed
        </p>
      </div>

      {loading ? (
        <p className="challenges-loading">Loading challenges…</p>
      ) : (
        <div className="challenges-page-list">
          {pending.map(uc => (
            <ChallengeCard key={uc.id} userChallenge={uc} />
          ))}
          {done.length > 0 && (
            <>
              <p className="challenges-divider">Completed</p>
              {done.map(uc => (
                <ChallengeCard key={uc.id} userChallenge={uc} />
              ))}
            </>
          )}
        </div>
      )}

      <div className="challenges-page-list">
        <p className="challenges-divider">Pet Unlocks</p>
        {lockedPets.map(pet => (
          <PetUnlockCard key={pet.id} pet={pet} userLevel={userLevel} userStreak={userStreak} userLongestStreak={userLongestStreak} />
        ))}
        {unlockedPets.map(pet => (
          <PetUnlockCard key={pet.id} pet={pet} userLevel={userLevel} userStreak={userStreak} userLongestStreak={userLongestStreak} />
        ))}
      </div>
    </div>
  )
}
