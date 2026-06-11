import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Spade, ArrowUpRight } from 'lucide-react'
import { pokerTournaments, tableGames } from '@/data/mockData'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import SectionHeading from '@/components/ui/SectionHeading'
import Tabs from '@/components/ui/Tabs'
import TournamentCard from '@/components/ui/TournamentCard'
import Badge from '@/components/ui/Badge'
import LcAmount from '@/components/ui/LcAmount'
import EmptyState from '@/components/ui/EmptyState'
import { getTheme } from '@/components/ui/gameThemes'
import cx from '@/lib/cx'

const tabs = [
  { key: 'all', label: 'All Tables' },
  { key: 'open', label: 'Open' },
  { key: 'live', label: 'Live' },
]

export default function PokerLobby() {
  const [tab, setTab] = useState('all')
  const { push } = useToast()
  const { isAuthed } = useAuth()
  const navigate = useNavigate()

  const register = (t) => {
    if (!isAuthed) {
      navigate('/login')
      return
    }
    push({ tone: 'success', title: t.title, message: 'Seat reserved. Watch your dashboard for the table link.' })
  }

  const list = useMemo(() => {
    if (tab === 'open') return pokerTournaments.filter((t) => t.status === 'Open' || t.status === 'Filling')
    if (tab === 'live') return pokerTournaments.filter((t) => t.status === 'Live')
    return pokerTournaments
  }, [tab])

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:px-10 sm:pt-36 lg:px-16">
      <SectionHeading
        eyebrow="Resort poker room"
        title="Poker tournaments"
        flourish="join from your room"
        subtitle="Guests from every resort location take a seat at the same table. Register with LuckieCoin, play online, and compete for the prize pool."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <Tabs tabs={tabs} value={tab} onChange={setTab} />
          {list.length === 0 ? (
            <EmptyState
              className="mt-8"
              icon={Spade}
              title="No tables in this view"
              message="Switch to All Tables to see every tournament on the schedule."
            />
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {list.map((t) => (
                <TournamentCard key={t.id} tournament={t} onRegister={register} />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="glass rounded-3xl p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-primary/80">House tables</p>
            <p className="mt-1 text-sm text-muted">Prefer a quick hand between tournaments</p>
            <div className="mt-4 space-y-3">
              {tableGames.map((g) => {
                const { Icon } = getTheme(g.theme)
                return (
                  <div key={g.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.03] p-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-ink">{g.name}</p>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                          From <LcAmount value={g.minLC} showCode={false} /> LC
                        </p>
                      </div>
                    </div>
                    <Badge status={g.status} dot />
                  </div>
                )
              })}
            </div>
            <Link
              to="/games"
              className="lift-on-hover mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
            >
              View all games <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="glass-dark rounded-3xl border border-primary/15 p-5">
            <p className="font-display text-base font-semibold text-ink">How registration works</p>
            <ol className="mt-3 space-y-2 text-sm text-muted">
              <li>1. Register with your LuckieCoin buy in.</li>
              <li>2. Take your seat from any resort room.</li>
              <li>3. Play online and compete for the prize pool.</li>
              <li>4. Winnings land in your wallet for cashout.</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  )
}
