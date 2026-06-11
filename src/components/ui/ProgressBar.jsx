import cx from '@/lib/cx'

const tones = {
  gold: 'bg-gold-sheen',
  emerald: 'bg-accent',
  purple: 'bg-accent-2-light',
}

export default function ProgressBar({ value = 0, max = 100, tone = 'gold', showPct = false, label, className }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  return (
    <div className={cx('w-full', className)}>
      {(label || showPct) && (
        <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-muted">
          {label && <span>{label}</span>}
          {showPct && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={cx('h-full rounded-full transition-all duration-700', tones[tone] || tones.gold)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
