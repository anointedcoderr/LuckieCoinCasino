import { Home as HomeIcon } from 'lucide-react'
import Button from '@/components/ui/Button'
import CoinRain from '@/components/ui/CoinRain'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 pb-20 pt-32 text-center">
      <CoinRain count={8} />
      <div className="relative">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary/80">Page not found</p>
        <h1 className="mt-4 font-display text-5xl font-bold text-ink sm:text-6xl">This table is not in play</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The page you are looking for has left the floor. Let us walk you back to the club.
        </p>
        <div className="mt-8 flex justify-center">
          <Button size="lg" to="/" icon={HomeIcon}>
            Back to the Club floor
          </Button>
        </div>
      </div>
    </section>
  )
}
