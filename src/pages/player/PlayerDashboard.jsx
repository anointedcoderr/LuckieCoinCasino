import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Wallet as WalletIcon, Coins, Trophy, Cherry, Banknote, Plus, ArrowUpRight, Spade } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { leaderboard, currentPlayerWeekly, slotGames, pokerTournaments } from '@/data/mockData'
import { formatLC, formatDateTime } from '@/lib/format'
import LcBalanceCard from '@/components/ui/LcBalanceCard'
import StatCard from '@/components/ui/StatCard'
import ChartCard from '@/components/ui/ChartCard'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import LcAmount from '@/components/ui/LcAmount'
import EmptyState from '@/components/ui/EmptyState'
import CountUp from '@/components/ui/CountUp'
import SlotCard from '@/components/ui/SlotCard'
import TournamentCard from '@/components/ui/TournamentCard'
import BuyLcSteps from '@/components/player/BuyLcSteps'
import CashoutModal from '@/components/player/CashoutModal'
import { useToast } from '@/context/ToastContext'

const tooltipStyle = {
  background: '#141216',
  border: '1px solid rgba(212,175,55,0.25)',
  borderRadius: 12,
  color: '#F6F1E7',
}

export default function PlayerDashboard() {
  const { session } = useAuth()
  const data = useData()
  const { push } = useToast()
  const [buyOpen, setBuyOpen] = useState(false)
  const [cashOpen, setCashOpen] = useState(false)

  const userId = session.userId
  const user = data.getUser(userId) || {}
  const balance = data.balanceOf(userId)
  const txns = data.userTransactions(userId).slice(0, 5)
  const stats = leaderboard.find((r) => r.id === userId) || {
    lcPlayed: 0,
    lcWon: 0,
    tournamentsWon: 0,
    slotWins: 0,
  }
  const featuredSlot = [...slotGames].sort((a, b) => b.popularity - a.popularity)[0]
  const featuredTournament = pokerTournaments.find((t) => t.status !== 'Closed')

  const notify = (g) => push({ tone: 'info', title: g.name, message: 'Launching your table now.' })
  const register = (t) =>
    push({ tone: 'success', title: t.title, message: 'Seat reserved. Watch here for the table link.' })

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <LcBalanceCard
          balance={balance}
          bonusLc={user.bonusLc || 0}
          rank={user.rank}
          rankMovement={stats.rankMovement || 0}
          tier={user.tier}
          avatarName={session.avatarName}
        />
        <div className="glass rounded-3xl p-6 shadow-card">
          <p className="font-display text-base font-semibold text-ink">Quick actions</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button to="/games/slots" variant="secondary" icon={Cherry} fullWidth>
              Play Slots
            </Button>
            <Button to="/poker" variant="secondary" icon={Spade} fullWidth>
              Join Poker
            </Button>
            <Button onClick={() => setBuyOpen(true)} variant="secondary" icon={Plus} fullWidth>
              Buy LC
            </Button>
            <Button onClick={() => setCashOpen(true)} variant="secondary" icon={Banknote} fullWidth>
              Cashout
            </Button>
          </div>
          <Link
            to="/wallet"
            className="lift-on-hover mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            Open full wallet <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="LC Played" icon={Coins} valueNode={<CountUp end={stats.lcPlayed} format={(v) => formatLC(v, { showCode: false })} />} />
        <StatCard label="LC Won" icon={Trophy} accent="emerald" valueNode={<CountUp end={stats.lcWon} format={(v) => formatLC(v, { showCode: false })} />} />
        <StatCard label="Tournaments Won" icon={Spade} accent="purple" valueNode={<CountUp end={stats.tournamentsWon} />} />
        <StatCard label="Slot Wins" icon={Cherry} valueNode={<CountUp end={stats.slotWins} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ChartCard title="Your LC activity" subtitle="Last 7 days" height={260}>
          <AreaChart data={currentPlayerWeekly} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="lcArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: '#9A9189', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9A9189', fontSize: 12 }} axisLine={false} tickLine={false} width={42} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#F6F1E7' }} formatter={(v) => [formatLC(v), 'LC played']} />
            <Area type="monotone" dataKey="lc" stroke="#D4AF37" strokeWidth={2} fill="url(#lcArea)" />
          </AreaChart>
        </ChartCard>

        <div className="glass rounded-3xl p-6 shadow-card">
          <div className="flex items-center justify-between">
            <p className="font-display text-base font-semibold text-ink">Recent activity</p>
            <Link to="/wallet" className="text-xs font-medium text-primary">
              View all
            </Link>
          </div>
          {txns.length === 0 ? (
            <EmptyState
              className="mt-4 py-8"
              icon={Coins}
              title="No activity yet"
              message="Play a game or claim a bonus to see it here."
            />
          ) : (
            <ul className="mt-4 space-y-3">
              {txns.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink">{tx.note}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{formatDateTime(tx.createdAt)}</p>
                  </div>
                  <LcAmount value={tx.amount} signed showCode={false} className="shrink-0" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-lg font-semibold text-ink">Featured for you</p>
          <Link to="/games" className="text-sm font-medium text-primary">
            All games
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {featuredSlot && <SlotCard slot={featuredSlot} onPlay={notify} onDemo={notify} />}
          {featuredTournament && <TournamentCard tournament={featuredTournament} onRegister={register} />}
        </div>
      </div>

      <Modal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        title="Buy more LuckieCoin"
        footer={<Button onClick={() => setBuyOpen(false)}>Got it</Button>}
      >
        <p className="text-sm leading-relaxed text-muted">
          LuckieCoin is purchased through the resort approved in world process. Follow the steps below and your balance
          is credited once a casino agent verifies your payment.
        </p>
        <div className="mt-4">
          <BuyLcSteps />
        </div>
      </Modal>

      <CashoutModal open={cashOpen} onClose={() => setCashOpen(false)} />
    </div>
  )
}
