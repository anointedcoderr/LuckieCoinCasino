import { useId } from 'react'
import cx from '@/lib/cx'

export default function LcCoin({ size = 28, spin = false, glow = 'soft', className }) {
  const id = `coin-grad-${useId().replace(/:/g, '')}`
  const glowClass =
    glow === 'strong' ? 'shadow-coin-strong' : glow === 'none' ? '' : 'shadow-coin-soft'
  return (
    <span
      className={cx('inline-grid shrink-0 place-items-center rounded-full', glowClass, className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className={cx(spin && 'animate-spin-slow')}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={id} cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#F6E08A" />
            <stop offset="48%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9C7A22" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="29" fill={`url(#${id})`} stroke="#F0D77A" strokeWidth="1.6" />
        <circle cx="32" cy="32" r="23" fill="none" stroke="#8a6f24" strokeWidth="1.4" opacity="0.55" />
        <text
          x="32"
          y="41"
          fontFamily="Georgia, serif"
          fontSize="22"
          fontWeight="700"
          fill="#3a2c08"
          textAnchor="middle"
        >
          LC
        </text>
      </svg>
    </span>
  )
}
