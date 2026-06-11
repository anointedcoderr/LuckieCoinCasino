import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@/lib/animations'
import cx from '@/lib/cx'

// Ticks a number up when it scrolls into view, using requestAnimationFrame.
export default function CountUp({
  end = 0,
  duration = 1600,
  decimals = 0,
  prefix = '',
  suffix = '',
  format,
  className,
}) {
  const ref = useRef(null)
  const started = useRef(false)
  const [val, setVal] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (prefersReducedMotion()) {
      setVal(end)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true
            const start = performance.now()
            const tick = (now) => {
              const p = Math.min(1, (now - start) / duration)
              const eased = 1 - Math.pow(1 - p, 3)
              setVal(end * eased)
              if (p < 1) requestAnimationFrame(tick)
              else setVal(end)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.4 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [end, duration])

  const safe = Number(val.toFixed(decimals))
  const display = format
    ? format(safe)
    : `${prefix}${safe.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`

  return (
    <span ref={ref} className={cx('tabular', className)}>
      {display}
    </span>
  )
}
