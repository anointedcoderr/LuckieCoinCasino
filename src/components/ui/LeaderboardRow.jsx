import Avatar from './Avatar'
import RankPill from './RankPill'
import LcAmount from './LcAmount'
import cx from '@/lib/cx'

const metricValue = {
  lcWon: (r) => <LcAmount value={r.lcWon} showCode={false} className="text-primary" />,
  tournamentsWon: (r) => <span className="font-mono font-semibold text-primary">{r.tournamentsWon}</span>,
  slotWins: (r) => <span className="font-mono font-semibold text-primary">{r.slotWins}</span>,
  blackjackWins: (r) => <span className="font-mono font-semibold text-primary">{r.blackjackWins}</span>,
  baccaratWins: (r) => <span className="font-mono font-semibold text-primary">{r.baccaratWins}</span>,
}

export default function LeaderboardRow({ row, rank, metric, showMetric, highlight, compact }) {
  return (
    <tr
      className={cx(
        'border-b border-white/5 transition last:border-0',
        highlight ? 'bg-primary/10' : 'hover:bg-white/[0.03]',
      )}
    >
      <td className="px-4 py-3">
        <RankPill rank={rank} movement={row.rankMovement} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={row.player} size={36} ring={rank <= 3 ? 'gold' : 'none'} />
          <div>
            <p className={cx('font-medium', highlight ? 'text-primary' : 'text-ink')}>
              {row.player}
              {highlight && (
                <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-primary/70">You</span>
              )}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{row.resortBadge}</p>
          </div>
        </div>
      </td>
      {!compact && (
        <td className="px-4 py-3 text-right">
          <LcAmount value={row.lcPlayed} showCode={false} className="font-medium text-muted" />
        </td>
      )}
      <td className="px-4 py-3 text-right">
        <LcAmount value={row.lcWon} showCode={false} className="text-ink" />
      </td>
      {showMetric && (
        <td className="px-4 py-3 text-right">{(metricValue[metric] || metricValue.lcWon)(row)}</td>
      )}
    </tr>
  )
}
