import { Clock, Trophy } from 'lucide-react'
import Badge from './Badge'
import Button from './Button'
import ProgressBar from './ProgressBar'
import LcAmount from './LcAmount'
import { timeUntil, formatDateTime } from '@/lib/format'

export default function TournamentCard({ tournament: t, onRegister }) {
  const full = t.seats.filled >= t.seats.total

  return (
    <div className="glass-dark flex flex-col rounded-3xl border border-white/10 p-6 shadow-card transition hover:border-primary/45">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-primary/80">{t.tag}</p>
          <h3 className="mt-1 font-display text-lg font-semibold text-ink">{t.title}</h3>
        </div>
        <Badge status={t.status} dot={t.status === 'Live'} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Buy in</p>
          {t.buyInLC === 0 ? (
            <span className="font-mono font-semibold text-accent">Free entry</span>
          ) : (
            <LcAmount value={t.buyInLC} className="text-primary" />
          )}
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Prize pool</p>
          <LcAmount value={t.prizePool} className="text-primary-light" />
        </div>
      </div>

      <div className="mt-5">
        <ProgressBar
          value={t.seats.filled}
          max={t.seats.total}
          tone="emerald"
          label={`Seats ${t.seats.filled} of ${t.seats.total}`}
        />
      </div>

      <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted">
        <Clock className="h-4 w-4 text-primary" />
        {timeUntil(t.startTime)}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="text-xs text-muted">{formatDateTime(t.startTime)}</span>
        <Button
          size="sm"
          icon={Trophy}
          onClick={() => onRegister?.(t)}
          disabled={full && t.status !== 'Live'}
        >
          {t.status === 'Live' ? 'View Table' : full ? 'Seats Full' : 'Register'}
        </Button>
      </div>
    </div>
  )
}
