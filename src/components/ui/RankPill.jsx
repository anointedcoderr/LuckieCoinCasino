import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import cx from '@/lib/cx'

export default function RankPill({ rank, movement = 0, className }) {
  const podium = rank <= 3
  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <span
        className={cx(
          'grid h-9 w-9 place-items-center rounded-xl font-display text-sm font-bold',
          podium
            ? 'bg-gold-sheen text-deep shadow-coin-soft'
            : 'border border-white/10 bg-white/5 text-ink',
        )}
      >
        {rank}
      </span>
      {movement > 0 && (
        <span className="inline-flex items-center font-mono text-[11px] text-accent">
          <ArrowUp className="h-3 w-3" />
          {movement}
        </span>
      )}
      {movement < 0 && (
        <span className="inline-flex items-center font-mono text-[11px] text-danger">
          <ArrowDown className="h-3 w-3" />
          {Math.abs(movement)}
        </span>
      )}
      {movement === 0 && <Minus className="h-3 w-3 text-muted" />}
    </span>
  )
}
