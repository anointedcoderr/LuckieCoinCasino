import cx from '@/lib/cx'

const toneMap = {
  emerald: 'bg-accent',
  gold: 'bg-primary',
  danger: 'bg-danger',
  neutral: 'bg-muted',
}

export default function StatusDot({ tone = 'emerald', label, pulse = true, className }) {
  return (
    <span className={cx('inline-flex items-center gap-2', className)}>
      <span className={cx('h-2 w-2 rounded-full', toneMap[tone] || toneMap.emerald, pulse && 'ring-pulse')} />
      {label && (
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{label}</span>
      )}
    </span>
  )
}
