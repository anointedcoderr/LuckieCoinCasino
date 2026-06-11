import { useState, useMemo } from 'react'
import { Banknote, ArrowDownToLine, Coins, Trophy, Clock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { totalCredited, totalSpent, sumByType } from '@/lib/money'
import { formatDateTime } from '@/lib/format'
import LcBalanceCard from '@/components/ui/LcBalanceCard'
import StatCard from '@/components/ui/StatCard'
import Tabs from '@/components/ui/Tabs'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import LcAmount from '@/components/ui/LcAmount'
import EmptyState from '@/components/ui/EmptyState'
import BuyLcSteps from '@/components/player/BuyLcSteps'
import CashoutModal from '@/components/player/CashoutModal'

const typeTone = {
  'Admin Credit': 'emerald',
  'Booking Bonus': 'emerald',
  'Poker Win': 'gold',
  'Slot Game Play': 'neutral',
  'Tournament Buy-in': 'neutral',
  'Cashout Request': 'warn',
}

const filterTabs = [
  { key: 'all', label: 'All' },
  { key: 'Admin Credit', label: 'Credits' },
  { key: 'Booking Bonus', label: 'Bonuses' },
  { key: 'Slot Game Play', label: 'Slots' },
  { key: 'Tournament Buy-in', label: 'Buy-ins' },
  { key: 'Poker Win', label: 'Wins' },
  { key: 'Cashout Request', label: 'Cashouts' },
]

export default function Wallet() {
  const { session } = useAuth()
  const data = useData()
  const [tab, setTab] = useState('all')
  const [cashOpen, setCashOpen] = useState(false)

  const userId = session.userId
  const user = data.getUser(userId) || {}
  const balance = data.balanceOf(userId)
  const txns = data.userTransactions(userId)

  const credited = totalCredited(txns)
  const spent = totalSpent(txns)
  const won = sumByType(txns, 'Poker Win')
  const pending = data.cashoutRequests
    .filter((c) => c.userId === userId && c.status === 'Pending')
    .reduce((sum, c) => sum + c.amountLC, 0)

  const filtered = useMemo(() => (tab === 'all' ? txns : txns.filter((t) => t.type === tab)), [tab, txns])

  const columns = [
    { key: 'createdAt', header: 'Date', render: (r) => <span className="text-muted">{formatDateTime(r.createdAt)}</span> },
    { key: 'type', header: 'Type', render: (r) => <Badge tone={typeTone[r.type] || 'neutral'}>{r.type}</Badge> },
    {
      key: 'note',
      header: 'Detail',
      render: (r) => (
        <div>
          <p className="text-ink/90">{r.note}</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{r.ref}</p>
        </div>
      ),
    },
    { key: 'amount', header: 'Amount', align: 'right', render: (r) => <LcAmount value={r.amount} signed showCode={false} /> },
    {
      key: 'balanceAfter',
      header: 'Balance',
      align: 'right',
      render: (r) => <LcAmount value={r.balanceAfter} showCode={false} className="text-muted" />,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <LcBalanceCard
          balance={balance}
          bonusLc={user.bonusLc || 0}
          rank={user.rank}
          tier={user.tier}
          avatarName={session.avatarName}
        />
        <div className="glass rounded-3xl p-6 shadow-card">
          <p className="font-display text-base font-semibold text-ink">Move your LuckieCoin</p>
          <p className="mt-1 text-sm text-muted">Top up through a casino agent or request a resort cashout.</p>
          <div className="mt-4 flex flex-col gap-3">
            <Button icon={Banknote} onClick={() => setCashOpen(true)}>
              Request cashout
            </Button>
            <Button variant="secondary" to="/games" icon={Coins}>
              Play with LC
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Credited" icon={ArrowDownToLine} accent="emerald" valueNode={<LcAmount value={credited} showCode={false} />} />
        <StatCard label="Total Played" icon={Coins} valueNode={<LcAmount value={spent} showCode={false} />} />
        <StatCard label="Total Won" icon={Trophy} valueNode={<LcAmount value={won} showCode={false} />} />
        <StatCard label="Pending Cashout" icon={Clock} accent="purple" valueNode={<LcAmount value={pending} showCode={false} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="mb-4 overflow-x-auto pb-1 scrollbar-hide">
            <Tabs tabs={filterTabs} value={tab} onChange={setTab} className="flex-nowrap" />
          </div>
          <DataTable
            columns={columns}
            rows={filtered}
            empty={
              <EmptyState
                icon={Coins}
                title="No transactions here yet"
                message="Switch to All to see your full LuckieCoin history."
              />
            }
          />
        </div>
        <div className="glass-dark rounded-3xl border border-primary/15 p-6 shadow-card">
          <p className="font-display text-base font-semibold text-ink">Buy LuckieCoin</p>
          <p className="mt-1 text-sm text-muted">Purchases are verified in world, then credited by management.</p>
          <div className="mt-4">
            <BuyLcSteps />
          </div>
        </div>
      </div>

      <CashoutModal open={cashOpen} onClose={() => setCashOpen(false)} />
    </div>
  )
}
