import cx from '@/lib/cx'

export default function EmptyState({ icon: Icon, title, message, action, className }) {
  return (
    <div
      className={cx(
        'flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center',
        className,
      )}
    >
      {Icon && (
        <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-7 w-7" strokeWidth={1.8} />
        </span>
      )}
      {title && <p className="font-display text-lg font-semibold text-ink">{title}</p>}
      {message && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
