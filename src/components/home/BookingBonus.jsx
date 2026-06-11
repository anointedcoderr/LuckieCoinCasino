import { Gift, BedDouble, Coins } from 'lucide-react'
import { resortBookings } from '@/data/mockData'
import SectionHeading from '@/components/ui/SectionHeading'
import Card from '@/components/ui/Card'
import LcAmount from '@/components/ui/LcAmount'
import Badge from '@/components/ui/Badge'
import Reveal from '@/components/ui/Reveal'

export default function BookingBonus() {
  return (
    <section className="relative overflow-hidden bg-deep/40 py-20 sm:py-24">
      <div className="grid-bg absolute inset-0 opacity-25" />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Resort guest bonus"
              title="Every stay adds LuckieCoin"
              flourish="to your club balance"
              subtitle="Book a villa, a skydeck suite, or an ocean lounge night and bonus LC lands the moment your stay is confirmed. The longer you stay, the more you play."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-ink">
                <Gift className="h-4 w-4 text-primary" />
                Bonus on every booking
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-4 py-2 text-sm text-ink">
                <BedDouble className="h-4 w-4 text-accent" />
                Resort guests only
              </span>
            </div>
          </Reveal>
          <Reveal className="space-y-3" stagger={0.08}>
            {resortBookings.slice(0, 3).map((b) => (
              <Card key={b.id} variant="glass" padding="p-4" className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Coins className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium text-ink">{b.bookingType}</p>
                    <p className="text-xs text-muted">{b.resortLocation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <LcAmount value={b.bonusLc} className="text-accent" />
                  <div className="mt-1">
                    <Badge status={b.status} />
                  </div>
                </div>
              </Card>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
