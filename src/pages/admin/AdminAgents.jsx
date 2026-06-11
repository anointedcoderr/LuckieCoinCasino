import { useState, useMemo } from 'react'
import { UserPlus, Power, PowerOff, Headset, ShieldCheck, Wifi } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { formatNumber, formatDate } from '@/lib/format'
import AdminPageHeader from '@/components/ui/AdminPageHeader'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Field from '@/components/ui/Field'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'
import StatCard from '@/components/ui/StatCard'

const roleOptions = ['Casino Agent', 'Senior Agent']

const emptyForm = { avatarName: '', role: 'Casino Agent', contactInWorld: '' }

export default function AdminAgents() {
  const data = useData()
  const { push } = useToast()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const agents = data.agents

  const stats = useMemo(() => {
    const online = agents.filter((a) => a.status === 'Online').length
    const verified = agents.reduce((sum, a) => sum + (a.verifiedPayments || 0), 0)
    return { total: agents.length, online, verified }
  }, [agents])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const startAdd = () => {
    setForm(emptyForm)
    setErrors({})
    setOpen(true)
  }

  const submit = () => {
    const next = {}
    if (!form.avatarName.trim()) next.avatarName = 'Enter the agent avatar name.'
    if (!form.contactInWorld.trim()) next.contactInWorld = 'Enter the in world contact handle.'
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    data.addAgent({
      avatarName: form.avatarName.trim(),
      role: form.role,
      contactInWorld: form.contactInWorld.trim(),
    })
    push({
      tone: 'success',
      title: 'Agent added',
      message: `${form.avatarName.trim()} joined the agent roster.`,
    })
    setOpen(false)
    setForm(emptyForm)
    setErrors({})
  }

  const toggleStatus = (agent) => {
    const nextStatus = agent.status === 'Online' ? 'Offline' : 'Online'
    data.setAgentStatus(agent.id, nextStatus)
    push({
      tone: nextStatus === 'Online' ? 'success' : 'info',
      title: nextStatus === 'Online' ? 'Agent online' : 'Agent offline',
      message: `${agent.avatarName} is now ${nextStatus.toLowerCase()}.`,
    })
  }

  const columns = [
    {
      key: 'avatarName',
      header: 'Agent',
      render: (a) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={a.avatarName} size={32} />
          <span className="font-medium text-ink/90">{a.avatarName}</span>
        </div>
      ),
    },
    { key: 'role', header: 'Role', render: (a) => <span className="text-ink/90">{a.role}</span> },
    {
      key: 'verifiedPayments',
      header: 'Verified payments',
      align: 'right',
      render: (a) => <span className="font-mono text-primary">{formatNumber(a.verifiedPayments || 0)}</span>,
    },
    {
      key: 'contactInWorld',
      header: 'Contact in world',
      render: (a) => <span className="font-mono text-xs text-muted">{a.contactInWorld}</span>,
    },
    {
      key: 'activeSince',
      header: 'Active since',
      render: (a) => <span className="text-muted">{formatDate(a.activeSince)}</span>,
    },
    { key: 'status', header: 'Status', render: (a) => <Badge status={a.status} dot /> },
  ]

  const actions = (a) =>
    a.status === 'Online' ? (
      <Button size="sm" variant="ghost" icon={PowerOff} onClick={() => toggleStatus(a)}>
        Set offline
      </Button>
    ) : (
      <Button size="sm" variant="secondary" icon={Power} onClick={() => toggleStatus(a)}>
        Set online
      </Button>
    )

  return (
    <div className="space-y-6">
      <AdminPageHeader
        description="Casino agents verify in world payments and welcome members across the resort floor. Bring agents online when they start a shift and add new hosts as the roster grows."
        actions={
          <Button icon={UserPlus} onClick={startAdd}>
            Add agent
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Agents on roster" value={formatNumber(stats.total)} icon={Headset} accent="primary" />
        <StatCard label="Online now" value={formatNumber(stats.online)} icon={Wifi} accent="emerald" />
        <StatCard label="Verified payments" value={formatNumber(stats.verified)} icon={ShieldCheck} accent="purple" />
      </div>

      <DataTable
        columns={columns}
        rows={agents}
        actions={actions}
        empty={
          <EmptyState
            icon={Headset}
            title="No agents on the roster yet"
            message="Add your first casino agent to start verifying in world payments and hosting members."
            action={
              <Button icon={UserPlus} onClick={startAdd}>
                Add agent
              </Button>
            }
          />
        }
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add agent"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button icon={UserPlus} onClick={submit}>
              Add agent
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field
            label="Avatar name"
            name="avatarName"
            value={form.avatarName}
            onChange={set('avatarName')}
            placeholder="Lena Cole"
            error={errors.avatarName}
            required
          />
          <Field
            label="Role"
            as="select"
            name="role"
            value={form.role}
            onChange={set('role')}
            options={roleOptions}
          />
          <Field
            label="Contact in world"
            name="contactInWorld"
            value={form.contactInWorld}
            onChange={set('contactInWorld')}
            placeholder="lena.cole"
            hint="The in world handle members reach this agent through."
            error={errors.contactInWorld}
            required
          />
        </div>
      </Modal>
    </div>
  )
}
