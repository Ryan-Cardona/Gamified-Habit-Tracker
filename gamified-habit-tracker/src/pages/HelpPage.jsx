import { useState } from 'react'
import { usePWAInstall } from '../hooks/usePWAInstall'
import './HelpPage.css'

const IOS_STEPS = [
  'Open this app in Safari (not Chrome or Firefox).',
  'Tap the Share button at the bottom of the screen (the box with an arrow pointing up).',
  'Scroll down and tap "Add to Home Screen".',
  'Tap "Add" in the top right corner.',
  'The app will now appear on your home screen like a regular app.',
]

function FaqItem({ question, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(o => !o)}>
        <span>{question}</span>
        <span className="faq-chevron">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="faq-answer">{children}</div>}
    </div>
  )
}

export function HelpPage() {
  const { triggerInstall, canInstall, isInstalled, isIOS } = usePWAInstall()

  return (
    <div className="help-page">
      <h2 className="help-title">❓ Help & FAQ</h2>

      <div className="faq-list">

        <FaqItem question="How do I add this app to my home screen?">
          {isInstalled ? (
            <p className="faq-installed">
              ✅ Slurp is already installed on your device!
            </p>
          ) : isIOS ? (
            <div className="faq-ios">
              <p>Follow these steps in <strong>Safari</strong>:</p>
              <ol className="faq-steps">
                {IOS_STEPS.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          ) : canInstall ? (
            <div className="faq-android">
              <p>Tap the button below to install Slurp on your home screen:</p>
              <button className="install-btn" onClick={triggerInstall}>
                📲 Install App
              </button>
            </div>
          ) : (
            <p>
              Open this page in Chrome on Android, or Safari on iPhone/iPad,
              then use your browser's "Add to Home Screen" option.
            </p>
          )}
        </FaqItem>

        {/* Add more FAQ items here later */}

      </div>
    </div>
  )
}
