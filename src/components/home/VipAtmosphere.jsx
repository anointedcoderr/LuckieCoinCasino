import { adminMetrics } from '@/data/mockData'
import { formatNumber } from '@/lib/format'
import SectionHeading from '@/components/ui/SectionHeading'
import CountUp from '@/components/ui/CountUp'
import CoinRain from '@/components/ui/CoinRain'
import Reveal from '@/components/ui/Reveal'

const stats = [
  { label: 'Club members', end: adminMetrics.totalMembers, suffix: '+' },
  { label: 'LC in circulation', end: adminMetrics.lcInCirculation, format: (v) => formatNumber(Math.round(v)) },
  { label: 'Live tournaments weekly', end: 12 },
  { label: 'Resort locations', end: 5 },
]

export default function VipAtmosphere() {
  return (
    <section className="relative overflow-hidden py-24">
      <CoinRain count={7} />
      <div className="absolute inset-0 bg-velvet-radial opacity-60" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <SectionHeading
          align="center"
          eyebrow="A private club feeling"
          title="The VIP resort casino lounge"
          flourish="built for our community"
          subtitle="Velvet tables, champagne gold lights, and a community of over 1000 resort guests. Play from your room, join the table, and compete with guests across every resort location."
        />
        <Reveal className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4" stagger={0.08}>
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-3xl p-5">
              <p className="font-display text-3xl font-bold text-primary sm:text-4xl">
                <CountUp end={s.end} format={s.format} suffix={s.suffix} />
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
