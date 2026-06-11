import { useMemo, useState } from 'react'
import { Trophy, Plus, Users, LockOpen, Lock } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { formatDateTime, initials } from '@/lib/format'
import AdminPageHeader from '@/components/ui/AdminPageHeader'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import SlideOver from '@/components/ui/SlideOver'
import Field from '@/components/ui/Field'
import LcAmount from '@/components/ui/LcAmount'
import ProgressBar from '@/components/ui/ProgressBar'
import EmptyState from '@/components/ui/EmptyState'

const blankForm = { title: '', buyInLC: '', prizePool: '', total: '', startTime: '' }

export default function AdminTournaments() {
  const data = useData()
  const { push } = useToast()
  const [roster, setRoster] = useState(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(blankForm)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  // A short seeded roster drawn from the resort membership, sized to the seats taken.
  const rosterNames = useMemo(() => {
    if (!roster) return []
    const count = Math.min(roster.seats?.filled || 0, 8)
    return data.players.slice(0, count).map((p) => p.avatarName)
  }, [roster, data.players])

  const toggleStatus = (row, next) => {
    data.setTournamentStatus(row.id, next)
    push({
      tone: next === 'Open' ? 'success' : 'info',
      title: next === 'Open' ? 'Tournament opened' : 'Tournament closed',
      message: `${row.title} is now ${next.toLowerCase()} for registration.`,
    })
  }

  const submitCreate = () => {
    const title = form.title.trim()
    const total = Number(form.total)
    if (!title) {
      setError('Give the tournament a title.')
      return
    }
    if (!total || total <= 0) {
      setError('Set the number of seats at the table.')
      return
    }
    data.createTournament({
      title,
      buyInLC: Math.max(0, Number(form.buyInLC) || 0),
      prizePool: Math.max(0, Number(form.prizePool) || 0),
      seats: { filled: 0, total: Number(total) },
      startTime: form.startTime.trim() || new Date().toISOString(),
      status: 'Open',
    })
    push({
      tone: 'success',
      title: 'Tournament created',
      message: `${title} is open and ready for seating.`,
    })
    setForm(blankForm)
    setError('')
    setCreating(false)
  }

  const columns = [
    {
      key: 'title',
      header: 'Tournament',
      render: (r) => (
        <div>
          <p className="font-medium text-ink">{r.title}</p>
          {r.tag && <p className="mt-0.5 text-xs text-muted">{r.tag}</p>}
        </div>
      ),
    },
    {
      key: 'buyInLC',
      header: 'Buy in',
      align: 'right',
      render: (r) =>
        r.buyInLC > 0 ? (
          <LcAmount value={r.buyInLC} showCode={false} />
        ) : (
          <span className="font-mono text-xs uppercase tracking-wider text-accent">Free</span>
        ),
    },
    {
      key: 'prizePool',
      header: 'Prize pool',
      align: 'right',
      render: (r) => <LcAmount value={r.prizePool} showCode={false} className="text-primary" />,
    },
    {
      key: 'seats',
      header: 'Seats',
      render: (r) => (
        <div className="min-w-[140px]">
          <p className="mb-1.5 font-mono text-xs text-muted">
            {r.seats?.filled ?? 0} of {r.seats?.total ?? 0}
          </p>
          <ProgressBar value={r.seats?.filled ?? 0} max={r.seats?.total ?? 0} />
        </div>
      ),
    },
    {
      key: 'startTime',
      header: 'Start',
      render: (r) => <span className="text-muted">{formatDateTime(r.startTime)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge status={r.status} dot={r.status === 'Live'} />,
    },
  ]

  const actions = (r) => (
    <div className="flex items-center justify-end gap-2">
      {r.status !== 'Live' &&
        (r.status === 'Closed' ? (
          <Button size="sm" variant="secondary" icon={LockOpen} onClick={() => toggleStatus(r, 'Open')}>
            Open
          </Button>
        ) : (
          <Button size="sm" variant="ghost" icon={Lock} onClick={() => toggleStatus(r, 'Closed')}>
            Close
          </Button>
        ))}
      <Button size="sm" variant="secondary" icon={Users} onClick={() => setRoster(r)}>
        Players
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <AdminPageHeader
        description="Run the poker tables across the resort floor. Open or close registration, watch the seats fill, and review who has taken a seat at each tournament."
        actions={
          <Button icon={Plus} onClick={() => setCreating(true)}>
            Create tournament
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={data.tournaments}
        actions={actions}
        empty={
          <EmptyState
            icon={Trophy}
            title="No tournaments scheduled yet"
            message="Create a tournament to open seating and welcome members to the table."
          />
        }
      />

      <SlideOver
        open={Boolean(roster)}
        onClose={() => setRoster(null)}
        title={roster ? roster.title : 'Tournament players'}
        subtitle={roster ? `${roster.seats?.filled ?? 0} of ${roster.seats?.total ?? 0} seats registered` : undefined}
      >
        {roster && (
          <div className="space-y-5">
            <div className="glass rounded-3xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Seats filled</span>
                <span className="font-mono text-sm text-ink">
                  {roster.seats?.filled ?? 0} / {roster.seats?.total ?? 0}
                </span>
              </div>
              <ProgressBar className="mt-3" value={roster.seats?.filled ?? 0} max={roster.seats?.total ?? 0} />
            </div>

            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted">Registered members</p>
              {rosterNames.length ? (
                <ul className="space-y-2.5">
                  {rosterNames.map((name) => (
                    <li
                      key={name}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 font-display text-sm font-semibold text-primary">
                        {initials(name)}
                      </span>
                      <span className="text-sm text-ink/90">{name}</span>
                    </li>
                  ))}
                  {(roster.seats?.filled ?? 0) > rosterNames.length && (
                    <li className="px-3 pt-1 text-xs text-muted">
                      and {(roster.seats.filled - rosterNames.length).toLocaleString('en-US')} more members seated.
                    </li>
                  )}
                </ul>
              ) : (
                <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center text-sm text-muted">
                  No members have taken a seat at this table yet.
                </p>
              )}
            </div>
          </div>
        )}
      </SlideOver>

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Create tournament"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button icon={Plus} onClick={submitCreate}>
              Create tournament
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field
            label="Title"
            name="title"
            value={form.title}
            onChange={set('title')}
            placeholder="Hawaii Resort Night Poker"
            error={error}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Buy in LC"
              name="buyInLC"
              type="number"
              value={form.buyInLC}
              onChange={set('buyInLC')}
              placeholder="500"
              hint="Leave at 0 for a free entry table."
            />
            <Field
              label="Prize pool LC"
              name="prizePool"
              type="number"
              value={form.prizePool}
              onChange={set('prizePool')}
              placeholder="12000"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Seats total"
              name="total"
              type="number"
              value={form.total}
              onChange={set('total')}
              placeholder="50"
              required
            />
            <Field
              label="Start time"
              name="startTime"
              value={form.startTime}
              onChange={set('startTime')}
              placeholder="2026-06-20T21:00:00"
              hint="Date and time the table opens."
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
