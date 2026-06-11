import LcCoin from './LcCoin'
import LcAmount from './LcAmount'
import RankPill from './RankPill'
import cx from '@/lib/cx'

export default function LcBalanceCard({
  balance = 0,
  bonusLc = 0,
  rank,
  rankMovement = 0,
  tier,
  avatarName,
  compact = false,
  className,
}) {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-3xl border border-primary/25 p-6 shadow-card-gold',
        className,
      )}
      style={{
        background: 'linear-gradient(135deg, rgba(212,175,55,0.13), rgba(27,24,31,0.6) 55%)',
      }}
    >
      <div className="grid-bg absolute inset-0 opacity-30" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-wider text-primary/80">
            {compact ? 'Your club balance' : `${avatarName ? avatarName + ', ' : ''}your LuckieCoin balance`}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <LcCoin size={42} glow="strong" />
            <LcAmount value={balance} className="text-glow-gold text-3xl text-ink sm:text-4xl" />
          </div>
        </div>
        {tier && (
          <span className="shrink-0 rounded-full border border-primary/30 bg-deep/40 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-primary-light">
            {tier}
          </span>
        )}
      </div>
      <div className="relative mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Bonus LC from bookings</p>
          <LcAmount value={bonusLc} className="mt-0.5 text-accent" />
        </div>
        {rank != null && (
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted">Leaderboard rank</p>
            <RankPill rank={rank} movement={rankMovement} />
          </div>
        )}
      </div>
    </div>
  )
}
