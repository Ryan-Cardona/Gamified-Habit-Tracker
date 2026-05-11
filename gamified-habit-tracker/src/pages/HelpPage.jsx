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

        <p className="faq-section-title">Hydration &amp; Tracking</p>

        <FaqItem question="How does the hydration ring work?">
          <p>The ring shows your current hydration level. It fills up as you log water and gradually drains over time if you stop logging.</p>
          <p>This decay mimics real-world dehydration — your body uses water continuously, so you need to keep topping it up throughout the day.</p>
        </FaqItem>

        <FaqItem question="Why is my ring draining even though I logged water?">
          <p>The ring slowly drains over time to reflect that your body is constantly using water — even after a log.</p>
          <p>Log regularly throughout the day to keep your hydration level high and your pet happy!</p>
        </FaqItem>

        <FaqItem question="How do I change my daily water goal?">
          <p>Use the goal setter on the home screen to adjust your target. A common recommendation is 2,000 ml per day, but this varies from person to person.</p>
        </FaqItem>

        <p className="faq-section-title">Gamification</p>

        <FaqItem question="How do I earn XP?">
          <p>You earn XP every time you log water — the more you log, the more you earn. Completing challenges gives bonus XP on top of that.</p>
        </FaqItem>

        <FaqItem question="How do streaks work?">
          <p>A streak counts the number of consecutive days you've met your daily water goal. Miss a day and your streak resets to zero.</p>
          <p>Your longest streak is always saved so you can always try to beat your personal best.</p>
        </FaqItem>

        <FaqItem question="How do I unlock new pets?">
          <p>New pets unlock as you level up. Keep logging water and earning XP to reach higher levels and discover new companions.</p>
        </FaqItem>

        <FaqItem question="What are challenges and how do I complete them?">
          <p>Challenges are goals such as logging water for several days in a row or hitting a high daily total. Head to the Challenges tab to see what's available.</p>
          <p>Completing a challenge earns bonus XP. Some challenges are locked until you reach a certain level or streak.</p>
        </FaqItem>

        <p className="faq-section-title">Leaderboard &amp; Data</p>

        <FaqItem question="How is my leaderboard score calculated?">
          <p>Your ranking is based on your total XP. The more you log and the more challenges you complete, the higher you'll climb.</p>
        </FaqItem>

        <FaqItem question="Is my data anonymous?">
          <p>Yes. You are identified by an auto-generated username — no real name or personal information is ever collected or stored.</p>
        </FaqItem>

        <FaqItem question="How is my data used in this study?">
          <p>Your water logs are used as anonymised research data to study hydration habits and the effect of gamification on behaviour.</p>
          <p>No personally identifiable information is collected at any point.</p>
        </FaqItem>

        <p className="faq-section-title">Technical</p>

        <FaqItem question="Does the app work offline?">
          <p>The app requires an internet connection to sync your logs and leaderboard data. Installing it to your home screen gives you the best experience, including faster load times.</p>
        </FaqItem>

        <FaqItem question="Why did my XP or streak reset?">
          <p>This can happen if you clear your browser data or switch to a different device or browser. Always use the same browser and device to keep your progress intact.</p>
        </FaqItem>

        <FaqItem question="How do I change my username?">
          <p>Usernames are automatically generated to keep the app fully anonymous. They cannot be changed at this time.</p>
        </FaqItem>

      </div>
    </div>
  )
}
