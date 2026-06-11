import cx from '@/lib/cx'

const accentMap = {
  primary: 'text-primary bg-primary/10',
  emerald: 'text-accent bg-accent/12',
  purple: 'text-accent-2-light bg-accent-2/18',
}

export default function StatCard({
  label,
  value,
  valueNode,
  delta,
  deltaTone = 'accent',
  icon: Icon,
  accent = 'primary',
  className,
}) {
  return (
    <div className={cx('glass rounded-3xl p-5 shadow-card', className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{label}</p>
        {Icon && (
          <span className={cx('grid h-9 w-9 place-items-center rounded-xl', accentMap[accent] || accentMap.primary)}>
            <Icon className="h-5 w-5" strokeWidth={2.2} />
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">{valueNode || value}</p>
      {delta && (
        <p className={cx('mt-1 font-mono text-xs', deltaTone === 'danger' ? 'text-danger' : 'text-accent')}>
          {delta}
        </p>
      )}
    </div>
  )
}
