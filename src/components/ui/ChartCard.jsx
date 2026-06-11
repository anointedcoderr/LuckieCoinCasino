import { ResponsiveContainer } from 'recharts'
import cx from '@/lib/cx'

// Wraps a recharts chart with a fixed pixel height so the responsive container
// always has a real size to measure.
export default function ChartCard({
  title,
  subtitle,
  height = 288,
  headerRight,
  children,
  className,
}) {
  return (
    <div className={cx('glass rounded-3xl p-5 shadow-card sm:p-6', className)}>
      {(title || headerRight) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            {title && <h3 className="font-display text-base font-semibold text-ink">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
          </div>
          {headerRight}
        </div>
      )}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
