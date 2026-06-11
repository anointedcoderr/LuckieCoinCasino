import cx from '@/lib/cx'
import { formatLC } from '@/lib/format'

// The single source for rendering LC figures, always in tabular mono so columns align.
export default function LcAmount({ value, showCode = true, signed = false, className }) {
  const n = Number(value) || 0
  const tone = signed ? (n > 0 ? 'text-accent' : n < 0 ? 'text-danger' : 'text-ink') : ''
  return (
    <span className={cx('tabular font-mono font-semibold', tone, className)}>
      {formatLC(value, { showCode, signed })}
    </span>
  )
}
