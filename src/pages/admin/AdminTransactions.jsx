import { useState, useMemo } from 'react'
import { ArrowUpRight, ArrowDownRight, Scale, Undo2, Search, ReceiptText } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { formatDateTime } from '@/lib/format'
import AdminPageHeader from '@/components/ui/AdminPageHeader'
import StatCard from '@/components/ui/StatCard'
import Tabs from '@/components/ui/Tabs'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Field from '@/components/ui/Field'
import LcAmount from '@/components/ui/LcAmount'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'

// The six LC movement types that flow through the club ledger.
const TYPES = [
  'Admin Credit',
  'Booking Bonus',
  'Slot Game Play',
  'Tournament Buy-in',
  'Poker Win',
  'Cashout Request',
]

// Tone for each type. Credits read emerald, poker wins gold, cashout requests warn,
// and the remaining movements stay neutral so the eye lands on what matters.
function toneForTx(tx) {
  if (tx.type === 'Poker Win') return 'gold'
  if (tx.type === 'Cashout Request') return 'warn'
  if (tx.amount > 0) return 'emerald'
  return 'neutral'
}

export default function AdminTransactions() {
  const data = useData()
  const { push } = useToast()
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [confirm, setConfirm] = useState(null)

  const transactions = data.transactions

  const totals = useMemo(() => {
    let credited = 0
    let out = 0
    transactions.forEach((t) => {
      const amt = Number(t.amount) || 0
      if (amt > 0) credited += amt
      else out += Math.abs(amt)
    })
    return { credited, out, net: credited - out }
  }, [transactions])

  const counts = useMemo(() => {
    const c = { all: transactions.length }
    TYPES.forEach((type) => {
      c[type] = 0
    })
    transactions.forEach((t) => {
      if (c[t.type] != null) c[t.type] += 1
    })
    return c
  }, [transactions])

  const typeTabs = [
    { key: 'all', label: 'All', count: counts.all },
    ...TYPES.map((type) => ({ key: type, label: type, count: counts[type] || 0 })),
  ]

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase()
    return transactions.filter((t) => {
      if (tab !== 'all' && t.type !== tab) return false
      if (!term) return true
      const name = data.getUser(t.userId)?.avatarName?.toLowerCase() || ''
      return name.includes(term) || (t.ref || '').toLowerCase().includes(term)
    })
  }, [transactions, tab, query, data])

  const applyReverse = () => {
    if (!confirm) return
    data.reverseTransaction(confirm.id)
    const name = data.getUser(confirm.userId)?.avatarName || 'the member'
    push({
      tone: 'info',
      title: 'Transaction reversed',
      message: `${confirm.ref} for ${name} was reversed and the balance was restored.`,
    })
    setConfirm(null)
  }

  const columns = [
    {
      key: 'createdAt',
      header: 'Date',
      render: (r) => <span className="text-muted">{formatDateTime(r.createdAt)}</span>,
    },
    {
      key: 'member',
      header: 'Member',
      render: (r) => {
        const u = data.getUser(r.userId)
        return (
          <div className="flex items-center gap-2.5">
            <Avatar name={u?.avatarName} size={30} />
            <span className="text-ink/90">{u?.avatarName || r.userId}</span>
          </div>
        )
      },
    },
    {
      key: 'type',
      header: 'Type',
      render: (r) => <Badge tone={toneForTx(r)}>{r.type}</Badge>,
    },
    {
      key: 'ref',
      header: 'Reference',
      render: (r) => <span className="font-mono text-xs text-muted">{r.ref}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (r) => <LcAmount value={r.amount} signed showCode={false} />,
    },
    {
      key: 'balanceAfter',
      header: 'Balance',
      align: 'right',
      render: (r) => (
        <span className="tabular font-mono text-muted">{(Number(r.balanceAfter) || 0).toLocaleString('en-US')}</span>
      ),
    },
  ]

  const actions = (r) =>
    String(r.ref || '').startsWith('REV-') ? (
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Reversal</span>
    ) : (
      <Button size="sm" variant="secondary" icon={Undo2} onClick={() => setConfirm(r)}>
        Reverse
      </Button>
    )

  return (
    <div className="space-y-6">
      <AdminPageHeader description="Every LuckieCoin movement across the club, from booking bonuses and verified credits to slot play, poker payouts, and cashout requests. Filter by type, find a member, and reverse a posting when a correction is needed." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total credited"
          accent="emerald"
          icon={ArrowUpRight}
          valueNode={<LcAmount value={totals.credited} showCode={false} className="text-accent" />}
        />
        <StatCard
          label="Total out"
          accent="primary"
          icon={ArrowDownRight}
          valueNode={<LcAmount value={totals.out} showCode={false} className="text-ink" />}
        />
        <StatCard
          label="Net"
          accent="purple"
          icon={Scale}
          valueNode={<LcAmount value={totals.net} signed showCode={false} />}
        />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="overflow-x-auto pb-1 scrollbar-hide">
          <Tabs tabs={typeTabs} value={tab} onChange={setTab} className="flex-nowrap" />
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={2.2} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search member or reference"
            aria-label="Search transactions by member or reference"
            className="w-full rounded-xl border border-white/10 bg-surface-2/70 py-3 pl-10 pr-4 text-sm text-ink placeholder:text-muted transition focus:border-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        actions={actions}
        empty={
          <EmptyState
            icon={ReceiptText}
            title="No transactions match this view"
            message="Try a different type or clear the search to see the full ledger."
          />
        }
      />

      <Modal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        title="Reverse transaction"
        footer={
          confirm && (
            <>
              <Button variant="ghost" onClick={() => setConfirm(null)}>
                Cancel
              </Button>
              <Button variant="danger" icon={Undo2} onClick={applyReverse}>
                Reverse posting
              </Button>
            </>
          )
        }
      >
        {confirm && (
          <div className="space-y-3 text-sm">
            <p className="text-muted">
              This posts an offsetting entry and restores the member balance. The original posting stays in the ledger
              for the record.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-muted">Member</span>
              <span className="font-medium text-ink">{data.getUser(confirm.userId)?.avatarName || confirm.userId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Type</span>
              <Badge tone={toneForTx(confirm)}>{confirm.type}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Reference</span>
              <span className="font-mono text-xs text-muted">{confirm.ref}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Amount</span>
              <LcAmount value={confirm.amount} signed showCode={false} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
