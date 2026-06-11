import { useState, useMemo } from 'react'
import { UserPlus, Search, Settings2, Coins, MinusCircle, ShieldOff, ShieldCheck, Users, Check } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { formatLC, formatDate, relativeTime } from '@/lib/format'
import AdminPageHeader from '@/components/ui/AdminPageHeader'
import Tabs from '@/components/ui/Tabs'
import DataTable from '@/components/ui/DataTable'
import SlideOver from '@/components/ui/SlideOver'
import Modal from '@/components/ui/Modal'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import LcAmount from '@/components/ui/LcAmount'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'

const TIERS = ['Silver Club', 'Gold Club', 'Platinum Club', 'Club Management']

const emptyMember = {
  avatarName: '',
  username: '',
  email: '',
  tier: 'Silver Club',
  resortLocation: '',
}

export default function AdminMembers() {
  const data = useData()
  const { push } = useToast()
  const players = data.players

  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const [activeId, setActiveId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [credit, setCredit] = useState('')
  const [deduct, setDeduct] = useState('')
  const [form, setForm] = useState(emptyMember)
  const [error, setError] = useState('')

  const counts = useMemo(() => {
    const c = { all: players.length, Active: 0, Suspended: 0 }
    players.forEach((p) => {
      c[p.status] = (c[p.status] || 0) + 1
    })
    return c
  }, [players])

  const statusTabs = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'Active', label: 'Active', count: counts.Active },
    { key: 'Suspended', label: 'Suspended', count: counts.Suspended },
  ]

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return players.filter((p) => {
      const byTab = tab === 'all' || p.status === tab
      const byQuery =
        !q ||
        p.avatarName?.toLowerCase().includes(q) ||
        p.username?.toLowerCase().includes(q)
      return byTab && byQuery
    })
  }, [players, query, tab])

  const active = activeId ? data.getUser(activeId) : null

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const openManage = (row) => {
    setActiveId(row.id)
    setCredit('')
    setDeduct('')
  }

  const changeTier = (tier) => {
    if (!active) return
    data.setUserTier(active.id, tier)
    push({ tone: 'success', title: 'Tier updated', message: `${active.avatarName} is now ${tier}.` })
  }

  const toggleStatus = () => {
    if (!active) return
    const next = active.status === 'Suspended' ? 'Active' : 'Suspended'
    data.setUserStatus(active.id, next)
    push({
      tone: next === 'Suspended' ? 'warn' : 'success',
      title: next === 'Suspended' ? 'Member suspended' : 'Member reinstated',
      message: `${active.avatarName} is now ${next.toLowerCase()}.`,
    })
  }

  const applyCredit = () => {
    const amt = Number(credit)
    if (!active || !amt || amt <= 0) return
    data.creditLc({ userId: active.id, amount: amt, reason: 'Member desk adjustment', note: 'Credited from the member desk' })
    push({ tone: 'success', title: 'LC credited', message: `${formatLC(amt)} added to ${active.avatarName}.` })
    setCredit('')
  }

  const applyDeduct = () => {
    const amt = Number(deduct)
    if (!active || !amt || amt <= 0) return
    data.deductLc({ userId: active.id, amount: amt, reason: 'Member desk adjustment', note: 'Adjusted from the member desk' })
    push({ tone: 'info', title: 'LC adjusted', message: `${formatLC(amt)} removed from ${active.avatarName}.` })
    setDeduct('')
  }

  const openCreate = () => {
    setForm(emptyMember)
    setError('')
    setCreating(true)
  }

  const submitCreate = () => {
    if (!form.avatarName.trim()) {
      setError('Enter the member avatar name.')
      return
    }
    if (!form.username.trim()) {
      setError('Enter a username for sign in.')
      return
    }
    setError('')
    data.addMember({
      avatarName: form.avatarName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      tier: form.tier,
      resortLocation: form.resortLocation.trim(),
    })
    push({ tone: 'success', title: 'Member added', message: `${form.avatarName.trim()} joined the club.` })
    setCreating(false)
  }

  const recentTx = active ? data.userTransactions(active.id).slice(0, 6) : []

  const columns = [
    {
      key: 'member',
      header: 'Member',
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.avatarName} size={36} />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{r.avatarName}</p>
            <p className="truncate font-mono text-xs text-muted">@{r.username}</p>
          </div>
        </div>
      ),
    },
    { key: 'tier', header: 'Tier', render: (r) => <Badge tone="gold">{r.tier}</Badge> },
    {
      key: 'balance',
      header: 'Balance',
      align: 'right',
      render: (r) => <LcAmount value={data.balanceOf(r.id)} showCode={false} className="text-primary" />,
    },
    { key: 'status', header: 'Status', render: (r) => <Badge status={r.status} /> },
    { key: 'joinedAt', header: 'Joined', render: (r) => <span className="text-muted">{formatDate(r.joinedAt)}</span> },
    { key: 'lastActive', header: 'Last active', render: (r) => <span className="text-muted">{relativeTime(r.lastActive)}</span> },
  ]

  const actions = (r) => (
    <Button size="sm" variant="secondary" icon={Settings2} onClick={() => openManage(r)}>
      Manage
    </Button>
  )

  return (
    <div className="space-y-6">
      <AdminPageHeader
        description="Look after every guest in the club. Search the roster, adjust tiers and balances, and welcome new members to the floor."
        actions={
          <Button icon={UserPlus} onClick={openCreate}>
            Add member
          </Button>
        }
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={2.2} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or username"
            aria-label="Search members"
            className="w-full rounded-xl border border-white/10 bg-surface-2/70 py-3 pl-11 pr-4 text-sm text-ink placeholder:text-muted transition focus:border-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="overflow-x-auto pb-1 scrollbar-hide">
          <Tabs tabs={statusTabs} value={tab} onChange={setTab} className="flex-nowrap" />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        actions={actions}
        empty={
          <EmptyState
            icon={Users}
            title="No members match this view"
            message="Try a different search term or switch the status filter to see more of the roster."
          />
        }
      />

      <SlideOver
        open={Boolean(active)}
        onClose={() => setActiveId(null)}
        title={active ? active.avatarName : 'Member'}
        subtitle={active ? `@${active.username}` : undefined}
        footer={
          active && (
            <>
              <Button
                variant={active.status === 'Suspended' ? 'emerald' : 'danger'}
                icon={active.status === 'Suspended' ? ShieldCheck : ShieldOff}
                onClick={toggleStatus}
              >
                {active.status === 'Suspended' ? 'Reinstate member' : 'Suspend member'}
              </Button>
              <Button variant="ghost" onClick={() => setActiveId(null)}>
                Close
              </Button>
            </>
          )
        }
      >
        {active && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-2xl border border-white/10 p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Balance</p>
                <LcAmount value={data.balanceOf(active.id)} showCode={false} className="mt-1 block text-lg text-primary" />
              </div>
              <div className="glass rounded-2xl border border-white/10 p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Bonus LC</p>
                <LcAmount value={active.bonusLc || 0} showCode={false} className="mt-1 block text-lg text-accent" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Status</span>
              <Badge status={active.status} />
            </div>

            <Field
              label="Tier"
              as="select"
              name="tier"
              value={active.tier}
              onChange={(e) => changeTier(e.target.value)}
              options={TIERS}
              hint="Changing the tier updates the member benefits across the resort."
            />

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="font-display text-sm font-semibold text-ink">Adjust balance</p>
              <p className="mt-0.5 text-xs text-muted">Credit a verified payment or correct a balance from the desk.</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Field
                    label="Credit LC"
                    name="creditAmount"
                    type="number"
                    value={credit}
                    onChange={(e) => setCredit(e.target.value)}
                    placeholder="500"
                  />
                  <Button size="sm" fullWidth icon={Coins} onClick={applyCredit}>
                    Credit
                  </Button>
                </div>
                <div className="space-y-2">
                  <Field
                    label="Deduct LC"
                    name="deductAmount"
                    type="number"
                    value={deduct}
                    onChange={(e) => setDeduct(e.target.value)}
                    placeholder="250"
                  />
                  <Button size="sm" fullWidth variant="secondary" icon={MinusCircle} onClick={applyDeduct}>
                    Deduct
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 font-display text-sm font-semibold text-ink">Recent activity</p>
              {recentTx.length ? (
                <ul className="space-y-2">
                  {recentTx.map((tx) => (
                    <li
                      key={tx.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-3.5 py-2.5"
                    >
                      <Badge tone="neutral">{tx.type}</Badge>
                      <LcAmount value={tx.amount} signed showCode={false} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-muted">
                  No activity recorded for this member yet.
                </p>
              )}
            </div>
          </div>
        )}
      </SlideOver>

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Add member"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button icon={Check} onClick={submitCreate}>
              Add member
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field
            label="Avatar name"
            name="avatarName"
            value={form.avatarName}
            onChange={setField('avatarName')}
            placeholder="Aurelia Quinn"
            error={error && !form.avatarName.trim() ? error : ''}
            required
          />
          <Field
            label="Username"
            name="username"
            value={form.username}
            onChange={setField('username')}
            placeholder="aurelia.quinn"
            error={error && form.avatarName.trim() && !form.username.trim() ? error : ''}
            required
          />
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={setField('email')}
            placeholder="aurelia.quinn@resortguest.club"
          />
          <Field
            label="Tier"
            as="select"
            name="tier"
            value={form.tier}
            onChange={setField('tier')}
            options={TIERS}
          />
          <Field
            label="Resort location"
            name="resortLocation"
            value={form.resortLocation}
            onChange={setField('resortLocation')}
            placeholder="Hawaii Sunset Resort"
            hint="The home resort where this member checks in."
          />
        </div>
      </Modal>
    </div>
  )
}
