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

const ANDROID_STEPS = [
  'Open this app in Chrome.',
  'Tap the three-dot menu (⋮) in the top-right corner.',
  'Tap "Add to Home screen".',
  'Tap "Add" to confirm.',
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

        <FaqItem question="How do I add this app to my home screen on Apple devices?">
          {isInstalled ? (
            <p className="faq-installed">
              ✅ Slurp is already installed on your device!
            </p>
          ) : (
            <div className="faq-ios">
              <p>Follow these steps in <strong>Safari</strong>:</p>
              <ol className="faq-steps">
                {IOS_STEPS.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </FaqItem>

        <FaqItem question="How do I add this app to my home screen on Android?">
          {isInstalled ? (
            <p className="faq-installed">
              ✅ Slurp is already installed on your device!
            </p>
          ) : canInstall ? (
            <div className="faq-android">
              <p>Tap the button below to install Slurp on your home screen:</p>
              <button className="install-btn" onClick={triggerInstall}>
                📲 Install App
              </button>
            </div>
          ) : (
            <div className="faq-android">
              <p>Follow these steps in <strong>Chrome</strong>:</p>
              <ol className="faq-steps">
                {ANDROID_STEPS.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </FaqItem>

        {/* Add more FAQ items here later */}

      </div>
    </div>
  )
}
