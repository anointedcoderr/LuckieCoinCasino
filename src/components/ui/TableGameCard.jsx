import { Play, Users, Smartphone } from 'lucide-react'
import { getTheme } from './gameThemes'
import Badge from './Badge'
import Button from './Button'
import LcAmount from './LcAmount'
import cx from '@/lib/cx'

export default function TableGameCard({ game, onPlay, onDemo }) {
  const { Icon, gradient } = getTheme(game.theme)

  return (
    <div className="group glass-dark overflow-hidden rounded-3xl border border-white/10 shadow-card transition hover:border-primary/45">
      <div className={cx('relative aspect-[16/10] bg-gradient-to-br', gradient)}>
        <div className="felt-bg absolute inset-0 opacity-30" />
        <Icon
          className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-white/90 drop-shadow-[0_0_18px_rgba(212,175,55,0.45)] transition duration-500 group-hover:scale-110"
          strokeWidth={1.4}
        />
        <div className="absolute left-3 top-3">
          <Badge status={game.status} dot />
        </div>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-deep/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary-light">
          <Users className="h-3 w-3" />
          {game.seats} seats
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-ink">{game.name}</h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">{game.type} table</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{game.blurb}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-white/[0.03] p-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Min</p>
            <LcAmount value={game.minLC} className="text-primary" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Max</p>
            <LcAmount value={game.maxLC} className="text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          {game.mobileReady && (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-accent">
              <Smartphone className="h-3.5 w-3.5" />
              Mobile ready
            </span>
          )}
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => onDemo?.(game)}>
              Free Play
            </Button>
            <Button size="sm" icon={Play} onClick={() => onPlay?.(game)}>
              Play
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
