import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cherry, Spade, Trophy, Diamond, Dice5 } from 'lucide-react'
import { slotGames, tableGames, pokerTournaments } from '@/data/mockData'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import SectionHeading from '@/components/ui/SectionHeading'
import Tabs from '@/components/ui/Tabs'
import SlotCard from '@/components/ui/SlotCard'
import TableGameCard from '@/components/ui/TableGameCard'
import TournamentCard from '@/components/ui/TournamentCard'
import EmptyState from '@/components/ui/EmptyState'
import Field from '@/components/ui/Field'
import cx from '@/lib/cx'

const tabs = [
  { key: 'all', label: 'All Games' },
  { key: 'slots', label: 'Slots' },
  { key: 'tables', label: 'Tables' },
  { key: 'poker', label: 'Poker' },
]

const minOptions = [
  { value: '0', label: 'Any minimum' },
  { value: '25', label: '25 LC or less' },
  { value: '50', label: '50 LC or less' },
  { value: '100', label: '100 LC or less' },
]

export default function GamesLobby() {
  const [tab, setTab] = useState('all')
  const [maxMin, setMaxMin] = useState('0')
  const [mobileOnly, setMobileOnly] = useState(false)
  const { push } = useToast()
  const { isAuthed } = useAuth()
  const navigate = useNavigate()

  const notify = (g) =>
    push({ tone: 'info', title: g.name, message: 'Game launch opens for signed in club members.' })
  const register = (t) => {
    if (!isAuthed) {
      navigate('/login')
      return
    }
    push({ tone: 'success', title: t.title, message: 'Seat reserved. Watch your dashboard for the table link.' })
  }

  const limit = Number(maxMin)
  const passes = (g) => (limit === 0 || g.minLC <= limit) && (!mobileOnly || g.mobileReady)
  const slots = useMemo(() => slotGames.filter(passes), [maxMin, mobileOnly])
  const tables = useMemo(() => tableGames.filter(passes), [maxMin, mobileOnly])

  const showSlots = tab === 'all' || tab === 'slots'
  const showTables = tab === 'all' || tab === 'tables'
  const showPoker = tab === 'all' || tab === 'poker'

  const categories = [
    { key: 'slots', label: 'Slots', icon: Cherry, count: slotGames.length, blurb: 'Spin the resort reels' },
    { key: 'tables', label: 'Blackjack and Baccarat', icon: Spade, count: tableGames.length, blurb: 'Live velvet tables' },
    { key: 'poker', label: 'Poker Tournaments', icon: Trophy, count: pokerTournaments.length, blurb: 'Compete for the prize pool' },
    { key: 'all', label: 'Everything', icon: Diamond, count: slotGames.length + tableGames.length + pokerTournaments.length, blurb: 'The full games floor' },
  ]

  const visibleCount =
    (showSlots ? slots.length : 0) + (showTables ? tables.length : 0) + (showPoker ? pokerTournaments.length : 0)

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:px-10 sm:pt-36 lg:px-16">
      <SectionHeading
        eyebrow="The games floor"
        title="Play the resort casino club"
        flourish="slots, tables, and poker"
        subtitle="Every game runs on LuckieCoin. Pick a table, set your bet, and play from your room or anywhere across the resort."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => {
          const Icon = c.icon
          const active = tab === c.key
          return (
            <button
              key={c.key}
              onClick={() => setTab(c.key)}
              className={cx(
                'group glass-dark lift-on-hover rounded-3xl border p-5 text-left transition',
                active ? 'border-primary/50 shadow-card-gold' : 'border-white/10 hover:border-primary/30',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary shadow-coin-soft">
                  <Icon className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <span className="font-mono text-xs text-muted">{c.count}</span>
              </div>
              <p className="mt-4 font-display text-base font-semibold text-ink">{c.label}</p>
              <p className="mt-0.5 text-xs text-muted">{c.blurb}</p>
            </button>
          )
        })}
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Tabs tabs={tabs} value={tab} onChange={setTab} />
        <div className="flex flex-wrap items-center gap-3">
          <Field
            as="select"
            name="minlc"
            aria-label="Filter by minimum LC"
            value={maxMin}
            onChange={(e) => setMaxMin(e.target.value)}
            options={minOptions}
            className="w-44"
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

      {visibleCount === 0 ? (
        <EmptyState
          className="mt-10"
          icon={Dice5}
          title="No games match that filter"
          message="Try raising the minimum LC or turning off the mobile ready filter to see the full floor."
        />
      ) : (
        <div className="mt-8 space-y-10">
          {showSlots && slots.length > 0 && (
            <div>
              {tab === 'all' && <h2 className="mb-4 font-display text-xl font-semibold text-ink">Slots</h2>}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {slots.map((s) => (
                  <SlotCard key={s.id} slot={s} onPlay={notify} onDemo={notify} />
                ))}
              </div>
            </div>
          )}
          {showTables && tables.length > 0 && (
            <div>
              {tab === 'all' && <h2 className="mb-4 font-display text-xl font-semibold text-ink">Tables</h2>}
              <div className="grid gap-6 sm:grid-cols-2">
                {tables.map((g) => (
                  <TableGameCard key={g.id} game={g} onPlay={notify} onDemo={notify} />
                ))}
              </div>
            </div>
          )}
          {showPoker && (
            <div>
              {tab === 'all' && <h2 className="mb-4 font-display text-xl font-semibold text-ink">Poker tournaments</h2>}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pokerTournaments.map((t) => (
                  <TournamentCard key={t.id} tournament={t} onRegister={register} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
