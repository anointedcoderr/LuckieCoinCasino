import { useState, useMemo } from 'react'
import { Cherry } from 'lucide-react'
import { slotGames } from '@/data/mockData'
import { useToast } from '@/context/ToastContext'
import SectionHeading from '@/components/ui/SectionHeading'
import SlotCard from '@/components/ui/SlotCard'
import Field from '@/components/ui/Field'
import EmptyState from '@/components/ui/EmptyState'
import cx from '@/lib/cx'

const sortOptions = [
  { value: 'popularity', label: 'Most popular' },
  { value: 'minlow', label: 'Lowest min LC' },
  { value: 'minhigh', label: 'Highest min LC' },
]

export default function Slots() {
  const [sort, setSort] = useState('popularity')
  const [mobileOnly, setMobileOnly] = useState(false)
  const { push } = useToast()

  const notify = (g) =>
    push({ tone: 'info', title: g.name, message: 'Game launch opens for signed in club members.' })

  const list = useMemo(() => {
    let l = slotGames.filter((g) => !mobileOnly || g.mobileReady)
    if (sort === 'popularity') l = [...l].sort((a, b) => b.popularity - a.popularity)
    else if (sort === 'minlow') l = [...l].sort((a, b) => a.minLC - b.minLC)
    else if (sort === 'minhigh') l = [...l].sort((a, b) => b.minLC - a.minLC)
    return l
  }, [sort, mobileOnly])

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:px-10 sm:pt-36 lg:px-16">
      <SectionHeading
        eyebrow="Slot parlour"
        title="Resort slot games"
        flourish="bright reels, gold wins"
        subtitle="Play HTML5 slot games tuned for the resort floor. Set your minimum LC, spin from any device, and chase the resort jackpots."
      />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">{list.length} games available</p>
        <div className="flex flex-wrap items-center gap-3">
          <Field
            as="select"
            name="sort"
            aria-label="Sort games"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={sortOptions}
            className="w-48"
          />
          <button
            onClick={() => setMobileOnly((v) => !v)}
            className={cx(
              'rounded-xl border px-4 py-3 text-sm font-medium transition',
              mobileOnly ? 'border-accent/50 bg-accent/10 text-accent' : 'border-white/10 text-muted hover:text-ink',
            )}
          >
            Mobile ready
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          className="mt-10"
          icon={Cherry}
          title="No slots match that filter"
          message="Turn off the mobile ready filter to see every reel on the floor."
        />
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <SlotCard key={s.id} slot={s} onPlay={notify} onDemo={notify} />
          ))}
        </div>
      )}
    </div>
  )
}
