import { useRef, useLayoutEffect } from 'react'
import { ArrowUpRight, PlayCircle } from 'lucide-react'
import { gsap, registerGsap, prefersReducedMotion } from '@/lib/animations'
import Button from '@/components/ui/Button'
import CoinRain from '@/components/ui/CoinRain'
import StatusDot from '@/components/ui/StatusDot'

export default function Hero() {
  const root = useRef(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const el = root.current
    if (!el) return
    registerGsap()
    const ctx = gsap.context(() => {
      gsap.from('[data-hero]', { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', stagger: 0.12 })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      <CoinRain count={10} />
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div
          data-hero
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/25 bg-deep/40 px-4 py-1.5"
        >
          <StatusDot tone="emerald" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary-light">
            The official resort casino club
          </span>
        </div>
        <h1
          data-hero
          className="mt-6 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl"
        >
          Your Resort Casino
          <br />
          <span className="gradient-text">Club Experience</span>
        </h1>
        <p data-hero className="mx-auto mt-3 max-w-2xl font-serif text-xl italic text-primary-light/90 sm:text-2xl">
          where your resort stay turns into a VIP casino night
        </p>
        <p data-hero className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Join the Casino Club as a resort guest, receive bonus LuckieCoin, play slots, blackjack, baccarat, and
          poker tournaments, climb the leaderboard, and cash out through the in world resort process.
        </p>
        <div data-hero className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" to="/register" iconRight={ArrowUpRight}>
            Join Casino Club
          </Button>
          <Button size="lg" variant="secondary" to="/games" icon={PlayCircle}>
            View Games
          </Button>
        </div>
      </div>
    </section>
  )
}
