import cx from '@/lib/cx'

const tones = {
  gold: 'bg-primary/15 text-primary border-primary/30',
  emerald: 'bg-accent/15 text-accent border-accent/35',
  purple: 'bg-accent-2/20 text-accent-2-light border-accent-2/45',
  neutral: 'bg-white/5 text-muted border-white/10',
  warn: 'bg-warn/15 text-warn border-warn/35',
  danger: 'bg-danger/15 text-danger border-danger/40',
}

const statusTone = {
  Active: 'emerald',
  Live: 'emerald',
  New: 'gold',
  Maintenance: 'warn',
  Open: 'emerald',
  Filling: 'gold',
  Closed: 'neutral',
  Pending: 'warn',
  Approved: 'gold',
  Paid: 'emerald',
  Rejected: 'danger',
  Completed: 'emerald',
  Confirmed: 'gold',
  Suspended: 'danger',
  Online: 'emerald',
  Offline: 'neutral',
}

export function toneForStatus(status) {
  return statusTone[status] || 'neutral'
}

export default function Badge({ tone, status, icon: Icon, dot = false, className, children }) {
  const resolved = tone || (status ? toneForStatus(status) : 'neutral')
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider',
        tones[resolved] || tones.neutral,
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {Icon && <Icon className="h-3 w-3" strokeWidth={2.4} />}
      {children || status}
    </span>
  )
}
