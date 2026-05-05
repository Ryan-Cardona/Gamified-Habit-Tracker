import { levelProgress, xpToNextLevel } from '../../utils/xp'
import './XPBar.css'

/**
 * Compact XP bar showing current level and progress to the next.
 */
export function XPBar({ xp, level }) {
  const progress   = levelProgress(xp)
  const toNext     = xpToNextLevel(xp)

  return (
    <div className="xp-bar-wrapper" title={`${toNext} XP to next level`}>
      <span className="xp-level">Lv.{level}</span>
      <div className="xp-track">
        <div
          className="xp-fill"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="xp-label">{xp} XP</span>
    </div>
  )
}
