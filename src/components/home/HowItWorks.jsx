import { UserPlus, BedDouble, BadgeCheck, Dice5 } from 'lucide-react'
import { howItWorksSteps } from '@/data/mockData'
import SectionHeading from '@/components/ui/SectionHeading'
import Reveal from '@/components/ui/Reveal'

const icons = [UserPlus, BedDouble, BadgeCheck, Dice5]

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
      <SectionHeading
        align="center"
        eyebrow="How the club works"
        title="From resort stay to casino night"
        flourish="in four simple steps"
      />
      <Reveal className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
        {howItWorksSteps.map((s, i) => {
          const Icon = icons[i] || Dice5
          return (
            <div key={s.step} className="glass-dark relative rounded-3xl border border-white/10 p-6">
              <span className="absolute right-5 top-4 font-display text-4xl font-bold text-white/5">0{s.step}</span>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary shadow-coin-soft">
                <Icon className="h-6 w-6" strokeWidth={2} />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.detail}</p>
            </div>
          )
        })}
      </Reveal>
    </section>
  )
}
