import './WelcomeModal.css'

/**
 * One-time welcome modal shown on first app launch.
 * Asks participants to log water honestly for study accuracy.
 */
export function WelcomeModal({ onAccept }) {
  return (
    <div className="welcome-overlay">
      <div className="welcome-card">
        <div className="welcome-icon">🙏</div>
        <h2 className="welcome-title">A quick note before you begin</h2>
        <p className="welcome-body">
          Thank you for taking part in this research study! For the results to be meaningful,
          please log your water intake as accurately and honestly as possible.
        </p>
        <p className="welcome-body">
          Every log you make contributes to real data — your honesty makes a difference. 🙏
        </p>
        <button className="welcome-btn" onClick={onAccept}>
          I understand — let's go!
        </button>
      </div>
    </div>
  )
}