import cx from '@/lib/cx'

// Filter toggles. These switch the visible set in place rather than swapping tab
// panels, so they use aria-pressed rather than the tablist and tab roles.
export default function Tabs({ tabs = [], value, onChange, variant = 'pill', className }) {
  if (variant === 'underline') {
    return (
      <div className={cx('flex flex-wrap gap-6 border-b border-divider', className)}>
        {tabs.map((t) => {
          const active = t.key === value
          return (
            <button
              key={t.key}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(t.key)}
              className={cx(
                'relative -mb-px pb-3 text-sm font-medium transition',
                active ? 'text-primary' : 'text-muted hover:text-ink',
              )}
            >
              {t.label}
              {t.count != null && <span className="ml-1.5 text-xs text-muted">{t.count}</span>}
              {active && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gold-sheen" />}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cx('flex flex-wrap gap-2', className)}>
      {tabs.map((t) => {
        const active = t.key === value
        return (
          <button
            key={t.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(t.key)}
            className={cx(
              'magnetic-btn rounded-full px-4 py-2 text-sm font-medium transition',
              active ? 'bg-gold-sheen text-deep shadow-coin-soft' : 'glass text-muted hover:text-ink',
            )}
          >
            {t.label}
            {t.count != null && (
              <span className={cx('ml-1.5 text-xs', active ? 'text-deep/70' : 'text-muted')}>{t.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
