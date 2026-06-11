import { ArrowUpRight, Dice5 } from 'lucide-react'
import Button from '@/components/ui/Button'
import CoinRain from '@/components/ui/CoinRain'

export default function ClubCta() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
      <div
        className="relative overflow-hidden rounded-[2.5rem] border border-primary/25 px-6 py-16 text-center sm:px-12"
        style={{
          background:
            'linear-gradient(135deg, rgba(212,175,55,0.16), rgba(91,42,134,0.18) 60%, rgba(11,10,12,0.6))',
        }}
      >
        <CoinRain count={8} />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
            Your stay just got luckier
          </h2>
          <p className="mt-4 text-muted sm:text-lg">
            Join the Casino Club, claim your booking bonus, and take a seat at the table tonight.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" to="/register" iconRight={ArrowUpRight}>
              Join Casino Club
            </Button>
            <Button size="lg" variant="secondary" to="/games" icon={Dice5}>
              Explore the games
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
