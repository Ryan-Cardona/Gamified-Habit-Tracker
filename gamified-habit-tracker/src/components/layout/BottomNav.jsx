import './BottomNav.css'

const TABS = [
  { id: 'home',        label: 'Home',        iconSrc: '/icons/nav/home.svg' },
  { id: 'challenges',  label: 'Challenges',  iconSrc: '/icons/nav/challenges.svg' },
  { id: 'leaderboard', label: 'Leaderboard', iconSrc: '/icons/nav/leaderboard.svg' },
  { id: 'help',        label: 'Help',        iconSrc: '/icons/nav/help.svg' },
]

export function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`bottom-nav-tab ${active === tab.id ? 'bottom-nav-tab--active' : ''}`}
          onClick={() => onChange(tab.id)}
          aria-label={tab.label}
        >
          {tab.iconSrc ? (
            <span
              className="tab-icon tab-icon--img"
              style={{ WebkitMaskImage: `url(${tab.iconSrc})`, maskImage: `url(${tab.iconSrc})` }}
            />
          ) : (
            <span className="tab-icon">{tab.icon}</span>
          )}
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
