import { getTab } from '@/lib/leaderboard'
import LeaderboardRow from './LeaderboardRow'

export default function LeaderboardTable({ rows = [], tab = 'overall', highlightId, compact = false }) {
  const cfg = getTab(tab)
  const showMetric = cfg.metric !== 'lcWon'

  return (
    <div className="glass overflow-x-auto rounded-3xl border border-white/10">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 font-mono text-[11px] uppercase tracking-wider text-muted">
            <th className="px-4 py-3.5 font-medium">Rank</th>
            <th className="px-4 py-3.5 font-medium">Player</th>
            {!compact && <th className="px-4 py-3.5 text-right font-medium">LC Played</th>}
            <th className="px-4 py-3.5 text-right font-medium">LC Won</th>
            {showMetric && <th className="px-4 py-3.5 text-right font-medium">{cfg.metricLabel}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <LeaderboardRow
              key={row.id}
              row={row}
              rank={row.displayRank || row.rank || i + 1}
              metric={cfg.metric}
              showMetric={showMetric}
              highlight={row.id === highlightId}
              compact={compact}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
