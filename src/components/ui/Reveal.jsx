import { useRef, useLayoutEffect } from 'react'
import { gsap, registerGsap, prefersReducedMotion } from '@/lib/animations'

// Scroll triggered entrance. Scoped with gsap.context and reverted on cleanup so it
// stays correct under StrictMode double mounting. Honors reduced motion by rendering
// content in its natural, fully visible state.
export default function Reveal({
  children,
  as: Tag = 'div',
  y = 28,
  delay = 0,
  duration = 0.8,
  stagger = 0,
  className,
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    if (!el) return
    registerGsap()
    const targets = stagger > 0 ? el.children : el
    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        duration,
        delay,
        ease: 'power3.out',
        stagger: stagger || 0,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [y, delay, duration, stagger])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
