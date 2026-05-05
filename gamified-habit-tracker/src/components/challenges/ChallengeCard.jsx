import './ChallengeCard.css'

function formatProgress(metric, progress, target) {
  if (metric === 'ml_logged')   return `${progress} / ${target} ml`
  if (metric === 'log_count')   return `${progress} / ${target} logs`
  if (metric === 'single_log')  return progress >= target ? '✓' : `Best: ${progress} ml`
  if (metric === 'streak_days') return `${progress} / ${target} days`
  return `${progress} / ${target}`
}

/**
 * Displays a single challenge with a progress bar and XP reward.
 */
export function ChallengeCard({ userChallenge }) {
  const { challenge, progress, completed } = userChallenge
  const target = challenge.effective_target ?? challenge.target_value
  const pct = Math.min(progress / target, 1)

  return (
    <div className={`challenge-card card ${completed ? 'challenge-card--done' : ''}`}>
      <div className="challenge-header">
        <span className="challenge-title">{challenge.title}</span>
        <span className="challenge-xp">+{challenge.xp_reward} XP</span>
      </div>
      <p className="challenge-desc">{challenge.description}</p>

      <div className="challenge-footer">
        <div className="challenge-track">
          <div
            className="challenge-fill"
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        <span className="challenge-progress">
          {completed
            ? '✓ Done'
            : formatProgress(challenge.metric, progress, target)
          }
        </span>
      </div>
    </div>
  )
}