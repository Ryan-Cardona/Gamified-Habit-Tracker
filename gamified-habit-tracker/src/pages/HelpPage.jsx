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

        <p className="faq-section-title">Hydration &amp; Tracking</p>

        <FaqItem question="How does the hydration ring work?">
          <p>The ring shows your current hydration level. It fills up as you log water and gradually drains over time if you stop logging.</p>
          <p>This decay reflects that your body uses water continuously throughout the day — log regularly to keep it topped up.</p>
        </FaqItem>

        <FaqItem question="Why is my ring draining even though I logged water?">
          <p>The ring slowly drains over time to reflect that your body is constantly using water — even after a recent log.</p>
          <p>Try to log water regularly throughout the day rather than all at once to keep your hydration level steady.</p>
        </FaqItem>

        <FaqItem question="How do I change my daily water goal?">
          <p>Use the goal setter on the home screen to adjust your target. A common recommendation is 2,000 ml per day, but this varies from person to person.</p>
        </FaqItem>

        <p className="faq-section-title">Data &amp; Privacy</p>

        <FaqItem question="Is my data anonymous?">
          <p>Yes. You are identified by an auto-generated username — no real name or personal information is ever collected or stored.</p>
        </FaqItem>

        <FaqItem question="How is my data used in this study?">
          <p>Your water logs are used as anonymised research data to study hydration habits. No personally identifiable information is collected at any point.</p>
        </FaqItem>

        <p className="faq-section-title">Technical</p>

        <FaqItem question="Does the app work offline?">
          <p>The app requires an internet connection to sync your logs. Installing it to your home screen gives you the best experience, including faster load times.</p>
        </FaqItem>

        <FaqItem question="Why did my data reset?">
          <p>This can happen if you clear your browser data or switch to a different device or browser. Always use the same browser and device to keep your logs intact.</p>
        </FaqItem>

        <FaqItem question="How do I change my username?">
          <p>Usernames are automatically generated to keep the app fully anonymous. They cannot be changed at this time.</p>
        </FaqItem>

      </div>
    </div>
  )
}
