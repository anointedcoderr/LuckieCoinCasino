import { slotGames, tableGames } from '@/data/mockData'
import { useToast } from '@/context/ToastContext'
import SectionHeading from '@/components/ui/SectionHeading'
import SlotCard from '@/components/ui/SlotCard'
import TableGameCard from '@/components/ui/TableGameCard'
import Reveal from '@/components/ui/Reveal'

export default function FeaturedGames() {
  const { push } = useToast()
  const featuredSlots = [...slotGames].sort((a, b) => b.popularity - a.popularity).slice(0, 3)
  const notify = (g) =>
    push({ tone: 'info', title: g.name, message: 'Game launch opens for signed in club members.' })

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
      <SectionHeading eyebrow="On the floor tonight" title="Featured games" flourish="picked for resort guests" />
      <Reveal className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
        {featuredSlots.map((s) => (
          <SlotCard key={s.id} slot={s} onPlay={notify} onDemo={notify} />
        ))}
      </Reveal>
      <Reveal className="mt-6 grid gap-6 sm:grid-cols-2" stagger={0.08}>
        {tableGames.map((g) => (
          <TableGameCard key={g.id} game={g} onPlay={notify} onDemo={notify} />
        ))}
      </Reveal>
    </section>
  )
}
