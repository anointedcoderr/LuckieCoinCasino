import { useState } from 'react'
import { HeartHandshake, ShieldCheck, Timer, Coins, SlidersHorizontal, Check } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { rgDefaults } from '@/data/adminData'
import { formatDate, formatNumber } from '@/lib/format'
import DataTable from '@/components/ui/DataTable'
import SlideOver from '@/components/ui/SlideOver'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import AdminPageHeader from '@/components/ui/AdminPageHeader'
import LcAmount from '@/components/ui/LcAmount'
import EmptyState from '@/components/ui/EmptyState'
import Avatar from '@/components/ui/Avatar'

// Defaults that apply to every member unless a personal limit is set on their profile.
const defaultCards = [
  {
    key: 'dailyLossLimitLC',
    label: 'Daily loss limit',
    icon: Coins,
    accent: 'text-primary bg-primary/10',
    render: (v) => <LcAmount value={v} showCode={false} />,
  },
  {
    key: 'sessionMinutes',
    label: 'Session length',
    icon: Timer,
    accent: 'text-accent bg-accent/12',
    render: (v) => (
      <span className="tabular font-mono font-semibold text-ink">{formatNumber(v)} min</span>
    ),
  },
  {
    key: 'dailyPlayLimitLC',
    label: 'Daily play limit',
    icon: ShieldCheck,
    accent: 'text-accent-2-light bg-accent-2/18',
    render: (v) => <LcAmount value={v} showCode={false} />,
  },
]

const emptyForm = { dailyLossLimitLC: '', sessionMinutes: '', selfExcludedUntil: '' }

export default function AdminResponsible() {
  const data = useData()
  const { push } = useToast()
  const [active, setActive] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const openEdit = (row) => {
    setForm({
      dailyLossLimitLC: String(row.dailyLossLimitLC ?? ''),
      sessionMinutes: String(row.sessionMinutes ?? ''),
      selfExcludedUntil: row.selfExcludedUntil ? row.selfExcludedUntil.slice(0, 10) : '',
    })
    setActive(row)
  }

  const closeEdit = () => {
    setActive(null)
    setForm(emptyForm)
  }

  const save = () => {
    if (!active) return
    const member = data.getUser(active.userId)
    const selfExcludedUntil = form.selfExcludedUntil || null
    const patch = {
      dailyLossLimitLC: Math.max(0, Number(form.dailyLossLimitLC) || 0),
      sessionMinutes: Math.max(0, Number(form.sessionMinutes) || 0),
      selfExcludedUntil,
      status: selfExcludedUntil ? 'Cooling off' : 'Active',
    }
    data.setRgLimit(active.userId, patch)
    push({
      tone: 'success',
      title: 'Player limits updated',
      message: `Care limits saved for ${member?.avatarName || active.userId}.`,
    })
    closeEdit()
  }

  const columns = [
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
      key: 'dailyLossLimitLC',
      header: 'Daily loss limit',
      align: 'right',
      render: (r) => <LcAmount value={r.dailyLossLimitLC} showCode={false} />,
    },
    {
      key: 'sessionMinutes',
      header: 'Session minutes',
      align: 'right',
      render: (r) => (
        <span className="tabular font-mono text-ink/90">{formatNumber(r.sessionMinutes)}</span>
      ),
    },
    {
      key: 'selfExcludedUntil',
      header: 'Self excluded until',
      render: (r) =>
        r.selfExcludedUntil ? (
          <span className="text-ink/90">{formatDate(r.selfExcludedUntil)}</span>
        ) : (
          <span className="text-muted">None</span>
        ),
    },
    { key: 'status', header: 'Status', render: (r) => <Badge status={r.status} /> },
  ]

  const actions = (r) => (
    <Button size="sm" variant="secondary" icon={SlidersHorizontal} onClick={() => openEdit(r)}>
      Edit limits
    </Button>
  )

  const activeMember = active ? data.getUser(active.userId) : null

  return (
    <div className="space-y-6">
      <AdminPageHeader
        description="Care comes first at the club. Set the resort wide play defaults and tune personal limits so members can enjoy the floor at a pace that feels right for them."
      />

      <section>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <HeartHandshake className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-ink">Club care defaults</p>
            <p className="text-sm text-muted">Applied to every member until a personal limit is set.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {defaultCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.key} className="glass rounded-3xl p-5 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{card.label}</p>
                  <span className={`grid h-9 w-9 place-items-center rounded-xl ${card.accent}`}>
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                </div>
                <p className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
                  {card.render(rgDefaults[card.key])}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-semibold text-ink">Personal limits</p>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {data.rgPlayers.length} members
          </span>
        </div>
        <DataTable
          columns={columns}
          rows={data.rgPlayers}
          rowKey="userId"
          actions={actions}
          empty={
            <EmptyState
              icon={HeartHandshake}
              title="No personal limits set yet"
              message="When a member sets their own pace, their tailored limits will appear here for the care team to review."
            />
          }
        />
      </section>

      <SlideOver
        open={Boolean(active)}
        onClose={closeEdit}
        title="Edit player limits"
        subtitle={activeMember?.avatarName || active?.userId}
        footer={
          <>
            <Button variant="ghost" onClick={closeEdit}>
              Cancel
            </Button>
            <Button icon={Check} onClick={save}>
              Save limits
            </Button>
          </>
        }
      >
        {active && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-4">
              <Avatar name={activeMember?.avatarName} size={42} />
              <div>
                <p className="font-display font-semibold text-ink">
                  {activeMember?.avatarName || active.userId}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  {activeMember?.tier || 'Resort member'}
                </p>
              </div>
            </div>

            <Field
              label="Daily loss limit (LC)"
              name="dailyLossLimitLC"
              type="number"
              value={form.dailyLossLimitLC}
              onChange={set('dailyLossLimitLC')}
              placeholder={String(rgDefaults.dailyLossLimitLC)}
              hint="The most a member can lose across a single day."
            />
            <Field
              label="Session minutes"
              name="sessionMinutes"
              type="number"
              value={form.sessionMinutes}
              onChange={set('sessionMinutes')}
              placeholder={String(rgDefaults.sessionMinutes)}
              hint="How long a single visit to the floor can run."
            />
            <Field
              label="Self exclusion until"
              name="selfExcludedUntil"
              type="date"
              value={form.selfExcludedUntil}
              onChange={set('selfExcludedUntil')}
              hint="Leave blank to keep the member active. A date sets a gentle cooling off pause."
            />
          </div>
        )}
      </SlideOver>
    </div>
  )
}
