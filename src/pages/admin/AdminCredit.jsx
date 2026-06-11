import { useState } from 'react'
import { Coins, Check } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { creditReasons } from '@/data/mockData'
import { formatLC, formatDateTime } from '@/lib/format'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import DataTable from '@/components/ui/DataTable'
import LcAmount from '@/components/ui/LcAmount'
import Avatar from '@/components/ui/Avatar'

export default function AdminCredit() {
  const data = useData()
  const { push } = useToast()
  const players = data.players
  const [form, setForm] = useState({
    userId: players[0]?.id || '',
    amount: '',
    reason: creditReasons[0],
    agentId: data.agents[0]?.id || '',
    note: '',
  })
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const member = data.getUser(form.userId)
  const agent = data.agents.find((a) => a.id === form.agentId)

  const memberOptions = players.map((p) => ({ value: p.id, label: `${p.avatarName} (${p.tier})` }))
  const agentOptions = data.agents.map((a) => ({ value: a.id, label: a.avatarName }))

  const open = () => {
    const amt = Number(form.amount)
    if (!form.userId) {
      setError('Choose a member to credit.')
      return
    }
    if (!amt || amt <= 0) {
      setError('Enter an amount of LC.')
      return
    }
    setError('')
    setConfirm(true)
  }

  const apply = () => {
    data.creditLc({
      userId: form.userId,
      amount: Number(form.amount),
      reason: form.reason,
      note: form.note || `${form.reason}${agent ? `, verified by ${agent.avatarName}` : ''}`,
      agentName: agent?.avatarName,
    })
    push({
      tone: 'success',
      title: 'LC credited',
      message: `${formatLC(Number(form.amount))} added to ${member?.avatarName}.`,
    })
    setConfirm(false)
    setForm((f) => ({ ...f, amount: '', note: '' }))
  }

  const columns = [
    { key: 'createdAt', header: 'Date', render: (r) => <span className="text-muted">{formatDateTime(r.createdAt)}</span> },
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
    { key: 'amount', header: 'Amount', align: 'right', render: (r) => <LcAmount value={r.amount} signed showCode={false} /> },
    { key: 'ref', header: 'Reference', render: (r) => <span className="font-mono text-xs text-muted">{r.ref}</span> },
    { key: 'note', header: 'Detail', render: (r) => <span className="text-ink/90">{r.note}</span> },
  ]

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <div className="glass-dark rounded-3xl border border-primary/15 p-6 shadow-card">
        <p className="font-display text-lg font-semibold text-ink">Credit LuckieCoin</p>
        <p className="mt-1 text-sm text-muted">
          Add LC to a member after an in world payment is verified or a bonus is approved.
        </p>
        <div className="mt-5 space-y-4">
          <Field label="Member" as="select" name="userId" value={form.userId} onChange={set('userId')} options={memberOptions} />
          <Field label="Amount of LC" name="amount" type="number" value={form.amount} onChange={set('amount')} placeholder="500" error={error} required />
          <Field label="Reason" as="select" name="reason" value={form.reason} onChange={set('reason')} options={creditReasons} />
          <Field label="Verifying agent" as="select" name="agentId" value={form.agentId} onChange={set('agentId')} options={agentOptions} />
          <Field label="Note" as="textarea" name="note" value={form.note} onChange={set('note')} placeholder="Reference or context for this credit" rows={3} />
          <Button fullWidth icon={Coins} onClick={open}>
            Credit LC
          </Button>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-lg font-semibold text-ink">Recent credits</p>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{data.recentCredits.length} shown</span>
        </div>
        <DataTable columns={columns} rows={data.recentCredits} />
      </div>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Confirm credit"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button icon={Check} onClick={apply}>
              Confirm and credit
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Member</span>
            <span className="font-medium text-ink">{member?.avatarName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Amount</span>
            <LcAmount value={Number(form.amount) || 0} className="text-primary" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Reason</span>
            <span className="text-ink">{form.reason}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Verifying agent</span>
            <span className="text-ink">{agent?.avatarName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">New balance</span>
            <LcAmount value={(member?.lcBalance || 0) + (Number(form.amount) || 0)} className="text-accent" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
