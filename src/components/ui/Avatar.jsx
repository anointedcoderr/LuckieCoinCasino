import cx from '@/lib/cx'
import { initials } from '@/lib/format'

const ringMap = {
  gold: 'ring-primary/50',
  emerald: 'ring-accent/50',
  purple: 'ring-accent-2/55',
  none: 'ring-transparent',
}

export default function Avatar({ name, src, size = 40, ring = 'gold', className }) {
  return (
    <span
      className={cx(
        'relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2 font-display font-semibold text-primary ring-2',
        ringMap[ring] || ringMap.gold,
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  )
}
