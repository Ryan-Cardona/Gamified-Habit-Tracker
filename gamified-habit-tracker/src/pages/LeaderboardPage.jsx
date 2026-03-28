import { useLeaderboard } from '../hooks/useLeaderboard'
import './LeaderboardPage.css'

const RANK_MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

export function LeaderboardPage({ userId }) {
  const { entries, loading } = useLeaderboard(userId)

  if (loading) {
    return <div className="leaderboard-loading">Loading leaderboard…</div>
  }

  if (entries.length === 0) {
    return <div className="leaderboard-empty">No players yet. Be the first! 💧</div>
  }

  return (
    <div className="leaderboard">
      <h2 className="leaderboard-title">🏆 Leaderboard</h2>

      <ol className="leaderboard-list">
        {entries.map((entry, i) => {
          const rank    = i + 1
          const isMe    = entry.id === userId
          const medal   = RANK_MEDALS[rank]

          return (
            <li
              key={entry.id}
              className={`leaderboard-row ${isMe ? 'leaderboard-row--me' : ''}`}
            >
              <span className="leaderboard-rank">
                {medal ?? rank}
              </span>

              <div className="leaderboard-info">
                <span className="leaderboard-username">
                  {entry.username}{isMe && <span className="leaderboard-you"> (you)</span>}
                </span>
                <span className="leaderboard-meta">
                  Lv.{entry.level} · {entry.xp} XP · 🔥 {entry.streak_current}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}