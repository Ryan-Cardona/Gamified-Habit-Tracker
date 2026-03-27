import './BottomNav.css'

const TABS = [
  { id: 'home',       label: 'Home',       icon: '💧' },
  { id: 'challenges', label: 'Challenges', icon: '🏆' },
]

/**
 * Fixed bottom navigation bar for switching between app sections.
 */
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
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
