import { useRef, useLayoutEffect } from 'react'
import { prefersReducedMotion } from '@/lib/animations'

// Scroll reveal built on IntersectionObserver. Content renders visible by default and
// is only hidden, then revealed when scrolled into view, if motion is allowed and the
// observer is available. Visibility is computed live, so nothing can get stuck hidden
// the way precomputed scroll positions can after fonts load and shift the layout.
export default function Reveal({
  children,
  as: Tag = 'div',
  y = 28,
  delay = 0,
  duration = 0.7,
  stagger = 0,
  className,
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return undefined

    const targets = stagger > 0 ? Array.from(el.children) : [el]
    if (!targets.length) return undefined

    const ease = 'cubic-bezier(0.22,1,0.36,1)'
    targets.forEach((node, i) => {
      const d = delay + i * stagger
      node.style.opacity = '0'
      node.style.transform = `translateY(${y}px)`
      node.style.transition = `opacity ${duration}s ${ease} ${d}s, transform ${duration}s ${ease} ${d}s`
      node.style.willChange = 'opacity, transform'
    })

    let done = false
    const reveal = () => {
      if (done) return
      done = true
      targets.forEach((node) => {
        node.style.opacity = ''
        node.style.transform = ''
      })
      window.setTimeout(
        () => targets.forEach((node) => {
          node.style.willChange = ''
          node.style.transition = ''
        }),
        (duration + delay + targets.length * stagger) * 1000 + 120,
      )
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reveal()
          io.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
    )
    io.observe(el)

    // Safety net only for pages that load hidden (a backgrounded tab pauses intersection
    // callbacks). When the page is visible the observer is reliable, so the scroll reveal
    // animation is preserved and nothing is force shown early.
    let fallback
    if (typeof document !== 'undefined' && document.hidden) {
      fallback = window.setTimeout(() => {
        reveal()
        io.disconnect()
      }, 1800)
    }

    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [y, delay, duration, stagger])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
