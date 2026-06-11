import { useMemo } from 'react'
import { prefersReducedMotion } from '@/lib/animations'
import LcCoin from './LcCoin'
import cx from '@/lib/cx'

// Signature animation: gold coins fall and spin with a soft neon glow.
// Positions and timing are derived from the index so the rain stays balanced.
export default function CoinRain({ count = 9, className }) {
  const coins = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        i,
        left: (i * 97 + 11) % 100,
        delay: ((i * 7) % 60) / 10,
        duration: 6 + (i % 4) * 1.4,
        size: 16 + (i % 3) * 11,
        opacity: 0.45 + (i % 3) * 0.18,
      })),
    [count],
  )

  if (prefersReducedMotion()) return null

  return (
    <div
      className={cx('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {coins.map((c) => (
        <span
          key={c.i}
          className="absolute -top-12"
          style={{
            left: `${c.left}%`,
            opacity: c.opacity,
            animation: `coin-fall ${c.duration}s linear ${c.delay}s infinite`,
          }}
        >
          <LcCoin size={c.size} glow="soft" />
        </span>
      ))}
    </div>
  )
}
