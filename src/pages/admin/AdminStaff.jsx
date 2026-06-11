import { useMemo, useState } from 'react'
import { UserPlus, ShieldCheck, Check, PauseCircle, PlayCircle, Users } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { relativeTime } from '@/lib/format'
import AdminPageHeader from '@/components/ui/AdminPageHeader'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Field from '@/components/ui/Field'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'

export default function AdminStaff() {
  const data = useData()
  const { push } = useToast()

  const roleOptions = useMemo(
    () => data.roleDefs.map((r) => ({ value: r.key, label: r.label })),
    [data.roleDefs],
  )
  const roleLabel = useMemo(() => {
    const map = {}
    data.roleDefs.forEach((r) => {
      map[r.key] = r.label
    })
    return map
  }, [data.roleDefs])

  const [invite, setInvite] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: roleOptions[0]?.value || 'support' })
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const changeRole = (member, role) => {
    if (role === member.role) return
    data.setStaffRole(member.id, role)
    push({
      tone: 'info',
      title: 'Role updated',
      message: `${member.name} is now ${roleLabel[role] || role}.`,
    })
  }

  const toggleStatus = (member) => {
    const next = member.status === 'Suspended' ? 'Active' : 'Suspended'
    data.setStaffStatus(member.id, next)
    push({
      tone: next === 'Suspended' ? 'warn' : 'success',
      title: next === 'Suspended' ? 'Access suspended' : 'Access restored',
      message:
        next === 'Suspended'
          ? `${member.name} can no longer sign in to the control center.`
          : `${member.name} is back on the team and can sign in again.`,
    })
  }

  const submitInvite = () => {
    const name = form.name.trim()
    const email = form.email.trim()
    if (!name) {
      setError('Enter the team member name.')
      return
    }
    if (!email || !email.includes('@')) {
      setError('Enter a valid resort email address.')
      return
    }
    const username = name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '')
    data.addStaff({ name, email, username, role: form.role })
    push({
      tone: 'success',
      title: 'Invite sent',
      message: `${name} joins the team as ${roleLabel[form.role] || form.role}.`,
    })
    setInvite(false)
    setForm({ name: '', email: '', role: roleOptions[0]?.value || 'support' })
    setError('')
  }

  const columns = [
    {
      key: 'member',
      header: 'Member',
      render: (s) => (
        <div className="flex items-center gap-3">
          <Avatar name={s.name} size={34} />
          <div className="leading-tight">
            <p className="text-ink/90">{s.name}</p>
            <p className="font-mono text-[11px] text-muted">@{s.username}</p>
          </div>
        </div>
      ),
    },
    { key: 'email', header: 'Email', render: (s) => <span className="text-muted">{s.email}</span> },
    {
      key: 'role',
      header: 'Role',
      render: (s) => <Badge tone="purple">{roleLabel[s.role] || s.role}</Badge>,
    },
    { key: 'status', header: 'Status', render: (s) => <Badge status={s.status} /> },
    {
      key: 'lastActive',
      header: 'Last active',
      render: (s) => <span className="text-muted">{relativeTime(s.lastActive)}</span>,
    },
  ]

  const actions = (s) => (
    <div className="flex items-center justify-end gap-2">
      <Field
        as="select"
        name={`role-${s.id}`}
        aria-label={`Role for ${s.name}`}
        value={s.role}
        onChange={(e) => changeRole(s, e.target.value)}
        options={roleOptions}
        className="w-40"
      />
      {s.status === 'Suspended' ? (
        <Button size="sm" variant="emerald" icon={PlayCircle} onClick={() => toggleStatus(s)}>
          Activate
        </Button>
      ) : (
        <Button size="sm" variant="secondary" icon={PauseCircle} onClick={() => toggleStatus(s)}>
          Suspend
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <AdminPageHeader
        description="Manage the resort management team, set each role, and review what every role can reach across the control center."
        actions={
          <Button icon={UserPlus} onClick={() => setInvite(true)}>
            Invite staff
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={data.staff}
        actions={actions}
        empty={
          <EmptyState
            icon={Users}
            title="No team members yet"
            message="Invite your first manager, agent, or support host to begin running the control center."
            action={
              <Button icon={UserPlus} onClick={() => setInvite(true)}>
                Invite staff
              </Button>
            }
          />
        }
      />

      <div className="glass-dark rounded-3xl border border-white/10 p-6 shadow-card">
        <div className="mb-5 flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent-2/15 text-accent-2-light">
            <ShieldCheck className="h-5 w-5" strokeWidth={2} />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-ink">Permissions matrix</p>
            <p className="mt-0.5 text-sm text-muted">
              A gold check means the role holds every permission in that module. A dash means partial or no access.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[11px] uppercase tracking-wider text-muted">
                <th className="px-4 py-3.5 font-medium">Module</th>
                {data.roleDefs.map((role) => (
                  <th key={role.key} className="px-4 py-3.5 text-center font-medium">
                    {role.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.permissionCatalog.map((group) => (
                <tr
                  key={group.module}
                  className="border-b border-white/5 transition last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3.5 align-middle">
                    <p className="text-ink/90">{group.module}</p>
                    <p className="font-mono text-[11px] text-muted">
                      {group.keys.length} permission{group.keys.length === 1 ? '' : 's'}
                    </p>
                  </td>
                  {data.roleDefs.map((role) => {
                    const held = data.rolePermissions[role.key]
                    const full =
                      held === 'all' ||
                      (Array.isArray(held) && group.keys.every((k) => held.includes(k)))
                    return (
                      <td key={role.key} className="px-4 py-3.5 text-center align-middle">
                        {full ? (
                          <Check className="mx-auto h-4 w-4 text-primary" strokeWidth={2.6} aria-label="Full access" />
                        ) : (
                          <span className="text-muted" aria-label="Partial or no access">
                            -
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={invite}
        onClose={() => setInvite(false)}
        title="Invite staff"
        footer={
          <>
            <Button variant="ghost" onClick={() => setInvite(false)}>
              Cancel
            </Button>
            <Button icon={UserPlus} onClick={submitInvite}>
              Send invite
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field
            label="Full name"
            name="name"
            value={form.name}
            onChange={set('name')}
            placeholder="Camille Rousseau"
            error={error && !form.name.trim() ? error : ''}
            required
          />
          <Field
            label="Resort email"
            name="email"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="camille.rousseau@resort.management"
            error={error && form.name.trim() ? error : ''}
            required
          />
          <Field
            label="Role"
            as="select"
            name="role"
            value={form.role}
            onChange={set('role')}
            options={roleOptions}
            hint={data.roleDefs.find((r) => r.key === form.role)?.desc}
          />
        </div>
      </Modal>
    </div>
  )
}
