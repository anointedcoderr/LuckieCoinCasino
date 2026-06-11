import { useState } from 'react'
import { Plus, Power, PowerOff, Gamepad2 } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { formatDateTime } from '@/lib/format'
import Tabs from '@/components/ui/Tabs'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Field from '@/components/ui/Field'
import LcAmount from '@/components/ui/LcAmount'
import ProgressBar from '@/components/ui/ProgressBar'

const tabs = [
  { key: 'slots', label: 'Slots' },
  { key: 'tables', label: 'Tables' },
  { key: 'tournaments', label: 'Tournaments' },
]

export default function AdminGames() {
  const data = useData()
  const { push } = useToast()
  const [tab, setTab] = useState('slots')
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'Resort Slot', minLC: '50' })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const toggleSlot = (g) => {
    const next = g.status === 'Maintenance' ? 'Active' : 'Maintenance'
    data.setSlotStatus(g.id, next)
    push({ tone: next === 'Active' ? 'success' : 'warn', title: g.name, message: `Marked ${next}.` })
  }
  const toggleTable = (g) => {
    const next = g.status === 'Maintenance' ? 'Live' : 'Maintenance'
    data.setTableStatus(g.id, next)
    push({ tone: next === 'Live' ? 'success' : 'warn', title: g.name, message: `Marked ${next}.` })
  }
  const toggleTournament = (t) => {
    if (t.status === 'Live') return
    const next = t.status === 'Closed' ? 'Open' : 'Closed'
    data.setTournamentStatus(t.id, next)
    push({ tone: next === 'Open' ? 'success' : 'warn', title: t.title, message: `Marked ${next}.` })
  }

  const addGame = () => {
    if (!form.name.trim()) return
    data.addSlotGame({ name: form.name.trim(), type: form.type, minLC: Number(form.minLC) || 25 })
    push({ tone: 'success', title: form.name.trim(), message: 'Added to the slot floor as New.' })
    setForm({ name: '', type: 'Resort Slot', minLC: '50' })
    setAddOpen(false)
    setTab('slots')
  }

  const slotColumns = [
    { key: 'name', header: 'Game', render: (r) => <span className="font-medium text-ink">{r.name}</span> },
    { key: 'type', header: 'Type', render: (r) => <span className="text-muted">{r.type}</span> },
    { key: 'minLC', header: 'Min LC', align: 'right', render: (r) => <LcAmount value={r.minLC} showCode={false} /> },
    { key: 'popularity', header: 'Popularity', render: (r) => <ProgressBar value={r.popularity} className="w-28" /> },
    { key: 'mobileReady', header: 'Mobile', render: (r) => <Badge tone={r.mobileReady ? 'emerald' : 'neutral'}>{r.mobileReady ? 'Ready' : 'No'}</Badge> },
    { key: 'status', header: 'Status', render: (r) => <Badge status={r.status} /> },
  ]
  const slotActions = (r) => (
    <Button size="sm" variant="secondary" icon={r.status === 'Maintenance' ? Power : PowerOff} onClick={() => toggleSlot(r)}>
      {r.status === 'Maintenance' ? 'Enable' : 'Disable'}
    </Button>
  )

  const tableColumns = [
    { key: 'name', header: 'Table', render: (r) => <span className="font-medium text-ink">{r.name}</span> },
    { key: 'type', header: 'Type', render: (r) => <span className="text-muted">{r.type}</span> },
    { key: 'minLC', header: 'Min', align: 'right', render: (r) => <LcAmount value={r.minLC} showCode={false} /> },
    { key: 'maxLC', header: 'Max', align: 'right', render: (r) => <LcAmount value={r.maxLC} showCode={false} /> },
    { key: 'seats', header: 'Seats', align: 'center', render: (r) => <span className="text-ink/90">{r.seats}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge status={r.status} /> },
  ]
  const tableActions = (r) => (
    <Button size="sm" variant="secondary" icon={r.status === 'Maintenance' ? Power : PowerOff} onClick={() => toggleTable(r)}>
      {r.status === 'Maintenance' ? 'Enable' : 'Disable'}
    </Button>
  )

  const tournamentColumns = [
    { key: 'title', header: 'Tournament', render: (r) => <span className="font-medium text-ink">{r.title}</span> },
    { key: 'buyInLC', header: 'Buy in', align: 'right', render: (r) => (r.buyInLC === 0 ? <span className="font-mono text-accent">Free</span> : <LcAmount value={r.buyInLC} showCode={false} />) },
    { key: 'prizePool', header: 'Prize pool', align: 'right', render: (r) => <LcAmount value={r.prizePool} showCode={false} className="text-primary-light" /> },
    { key: 'seats', header: 'Seats', align: 'center', render: (r) => <span className="text-ink/90">{r.seats.filled}/{r.seats.total}</span> },
    { key: 'startTime', header: 'Start', render: (r) => <span className="text-muted">{formatDateTime(r.startTime)}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge status={r.status} dot={r.status === 'Live'} /> },
  ]
  const tournamentActions = (r) =>
    r.status === 'Live' ? (
      <span className="font-mono text-[11px] uppercase tracking-wider text-accent">In play</span>
    ) : (
      <Button size="sm" variant="secondary" icon={r.status === 'Closed' ? Power : PowerOff} onClick={() => toggleTournament(r)}>
        {r.status === 'Closed' ? 'Open' : 'Close'}
      </Button>
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted">
          Manage the games on the resort floor. Enable or disable titles, open or close tournaments, and add new slot
          games as their HTML5 folders arrive.
        </p>
        <Button icon={Plus} onClick={() => setAddOpen(true)}>
          Add game
        </Button>
      </div>

      <Tabs tabs={tabs} value={tab} onChange={setTab} />

      {tab === 'slots' && <DataTable columns={slotColumns} rows={data.slotGames} actions={slotActions} />}
      {tab === 'tables' && <DataTable columns={tableColumns} rows={data.tableGames} actions={tableActions} />}
      {tab === 'tournaments' && <DataTable columns={tournamentColumns} rows={data.tournaments} actions={tournamentActions} />}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add a slot game"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button icon={Gamepad2} onClick={addGame}>
              Add to floor
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">New slot games join the floor with a New status until their folder is installed.</p>
        <div className="mt-4 space-y-4">
          <Field label="Game name" name="name" value={form.name} onChange={set('name')} placeholder="Jade Lagoon Slot" required />
          <Field
            label="Type"
            as="select"
            name="type"
            value={form.type}
            onChange={set('type')}
            options={['Resort Slot', 'Classic Slot', 'Luxury Slot', 'Adventure Slot']}
          />
          <Field label="Minimum LC" name="minLC" type="number" value={form.minLC} onChange={set('minLC')} placeholder="50" />
        </div>
      </Modal>
    </div>
  )
}
