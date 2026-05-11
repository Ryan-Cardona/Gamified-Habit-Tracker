import { useState } from 'react'
import './WelcomeModal.css'

const STEPS = [
  {
    icon: '🙏',
    title: 'A quick note before you begin',
    content: [
      'Thank you for taking part in this research study! For the results to be meaningful, please log your water intake as accurately and honestly as possible.',
      'Every log you make contributes to real data — your honesty makes a difference.',
    ],
  },
  {
    icon: '💧',
    title: 'Stay on top of your hydration',
    content: [
      'Use the log-water button on the home screen to record every drink throughout your day.',
      'The hydration ring drains over time if you stop logging — keep topping it up to maintain your level and keep your pet healthy!',
    ],
  },
  {
    icon: '🐾',
    title: 'Meet your hydration buddy',
    content: [
      "Your virtual pet's mood reflects how well you're hydrating — keep them happy by hitting your daily goal!",
      'Level up to unlock new pets and give yours a custom name.',
    ],
  },
  {
    icon: '⭐',
    title: 'Earn XP & level up',
    content: [
      'Every water log earns you XP. Watch the bar at the top fill up and level up over time.',
      'Higher levels unlock new pets and boost your leaderboard standing.',
    ],
  },
  {
    icon: '🏆',
    title: 'Take on challenges',
    content: [
      'Head to the Challenges tab for daily and long-term goals — complete them for bonus XP.',
      'Keeping your streak alive unlocks harder challenges with bigger rewards.',
    ],
  },
  {
    icon: '🥇',
    title: 'Climb the leaderboard',
    content: [
      'See how you rank against other users in the Leaderboard tab.',
      "Stay consistent, maintain your streak, and rise to the top — you've got this!",
    ],
  },
]

export function WelcomeModal({ onAccept }) {
  const [step, setStep] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  function goTo(next) {
    setStep(next)
    setAnimKey(k => k + 1)
  }

  return (
    <div className="welcome-overlay">
      <div className="welcome-card">
        <div className="welcome-step-content" key={animKey}>
          <div className="welcome-icon">{current.icon}</div>
          <h2 className="welcome-title">{current.title}</h2>
          {current.content.map((text, i) => (
            <p key={i} className="welcome-body">{text}</p>
          ))}
        </div>

        <div className="welcome-dots">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`welcome-dot${i === step ? ' welcome-dot--active' : ''}`}
            />
          ))}
        </div>

        <div className="welcome-actions">
          {step > 0 ? (
            <button
              className="welcome-btn welcome-btn--secondary"
              onClick={() => goTo(step - 1)}
            >
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            className="welcome-btn"
            onClick={isLast ? onAccept : () => goTo(step + 1)}
          >
            {isLast ? "Let's go! 🚀" : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}