import { ChallengeCard } from '../components/challenges/ChallengeCard'
import './ChallengesPage.css'

/**
 * Full challenges page — shows all of today's challenges.
 */
export function ChallengesPage({ challenges, loading }) {
  const done    = challenges.filter(uc => uc.completed)
  const pending = challenges.filter(uc => !uc.completed)

  return (
    <div className="challenges-page">
      <div className="challenges-page-header">
        <h1 className="challenges-page-title">🏆 Today's Challenges</h1>
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
    </div>
  )
}