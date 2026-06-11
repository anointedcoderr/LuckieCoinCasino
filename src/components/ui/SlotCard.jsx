import { Play, Smartphone } from 'lucide-react'
import { getTheme } from './gameThemes'
import Badge from './Badge'
import Button from './Button'
import ProgressBar from './ProgressBar'
import LcAmount from './LcAmount'
import cx from '@/lib/cx'

export default function SlotCard({ slot, onPlay, onDemo }) {
  const { Icon, gradient } = getTheme(slot.theme)
  const disabled = slot.status === 'Maintenance'

  return (
    <div className="group glass-dark overflow-hidden rounded-3xl border border-white/10 shadow-card transition hover:border-primary/45">
      <div className={cx('relative aspect-[16/10] bg-gradient-to-br', gradient)}>
        <div className="grid-bg absolute inset-0 opacity-40" />
        <Icon
          className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-white/90 drop-shadow-[0_0_18px_rgba(212,175,55,0.45)] transition duration-500 group-hover:scale-110"
          strokeWidth={1.4}
        />
        <div className="absolute left-3 top-3">
          <Badge status={slot.status} />
        </div>
        {slot.mobileReady && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-deep/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary-light">
            <Smartphone className="h-3 w-3" />
            Mobile
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-ink">{slot.name}</h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">{slot.type}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{slot.blurb}</p>
        <div className="mt-4">
          <ProgressBar value={slot.popularity} label="Popularity" showPct tone="gold" />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Min Bet</p>
            <LcAmount value={slot.minLC} className="text-primary" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => onDemo?.(slot)}>
              Free Play
            </Button>
            <Button size="sm" icon={Play} disabled={disabled} onClick={() => onPlay?.(slot)}>
              {disabled ? 'Paused' : 'Play'}
            </Button>
          </div>
        </div>
        {disabled && (
          <p className="mt-3 text-xs text-warn">
            This reel is resting for resort maintenance. Check back soon.
          </p>
        )}
      </div>
    </div>
  )
}
