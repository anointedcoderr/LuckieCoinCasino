import { Link } from 'react-router-dom'
import { ArrowUpRight, Users } from 'lucide-react'
import LcAmount from './LcAmount'
import cx from '@/lib/cx'

// Category tile for the games lobby: type, LC use, active players, and a clear route.
export default function GameCard({
  title,
  type,
  icon: Icon,
  blurb,
  minLC,
  activePlayers,
  to,
  gradient = 'from-[#2a2010] via-[#161019] to-[#0c0a10]',
}) {
  return (
    <Link
      to={to}
      className="group glass-dark lift-on-hover relative block overflow-hidden rounded-3xl border border-white/10 p-6 shadow-card transition hover:border-primary/45"
    >
      <div className={cx('absolute inset-0 -z-10 bg-gradient-to-br opacity-60', gradient)} />
      <div className="grid-bg absolute inset-0 -z-10 opacity-20" />
      <div className="flex items-start justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary shadow-coin-soft">
          {Icon && <Icon className="h-6 w-6" strokeWidth={2} />}
        </span>
        <ArrowUpRight className="h-5 w-5 text-muted transition group-hover:text-primary" />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-primary/80">{type}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{blurb}</p>
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
          <Users className="h-4 w-4 text-accent" />
          {activePlayers} playing
        </span>
        <span className="text-sm text-muted">
          From <LcAmount value={minLC} className="text-primary" />
        </span>
      </div>
    </Link>
  )
}
