import { useState, useMemo } from 'react'
import { Banknote, Eye, Check, X, CheckCheck } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { formatDateTime } from '@/lib/format'
import Tabs from '@/components/ui/Tabs'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import LcAmount from '@/components/ui/LcAmount'
import EmptyState from '@/components/ui/EmptyState'
import Avatar from '@/components/ui/Avatar'

export default function AdminCashouts() {
  const data = useData()
  const { push } = useToast()
  const [tab, setTab] = useState('all')
  const [active, setActive] = useState(null)

  const requests = data.cashoutRequests
  const counts = useMemo(() => {
    const c = { all: requests.length, Pending: 0, Approved: 0, Paid: 0, Rejected: 0 }
    requests.forEach((r) => {
      c[r.status] = (c[r.status] || 0) + 1
    })
    return c
  }, [requests])

  const statusTabs = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'Pending', label: 'Pending', count: counts.Pending },
    { key: 'Approved', label: 'Approved', count: counts.Approved },
    { key: 'Paid', label: 'Paid', count: counts.Paid },
    { key: 'Rejected', label: 'Rejected', count: counts.Rejected },
  ]

  const rows = useMemo(
    () => (tab === 'all' ? requests : requests.filter((r) => r.status === tab)),
    [tab, requests],
  )

  const change = (id, status) => {
    data.setCashoutStatus(id, status)
    push({
      tone: status === 'Rejected' ? 'warn' : 'success',
      title: `Cashout ${status.toLowerCase()}`,
      message: `Request ${id} marked ${status}.`,
    })
    setActive(null)
  }

  const columns = [
    { key: 'id', header: 'Request', render: (r) => <span className="font-mono text-xs text-muted">{r.id}</span> },
    {
      key: 'avatarName',
      header: 'Member',
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={r.avatarName} size={30} />
          <span className="text-ink/90">{r.avatarName}</span>
        </div>
      ),
    },
    { key: 'amountLC', header: 'Amount', align: 'right', render: (r) => <LcAmount value={r.amountLC} showCode={false} className="text-primary" /> },
    { key: 'resortLocation', header: 'Resort location', render: (r) => <span className="text-ink/90">{r.resortLocation}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge status={r.status} /> },
    {
      key: 'requestedAt',
      header: 'Requested',
      render: (r) => <span className="text-muted">{formatDateTime(r.requestedAt)}</span>,
    },
  ]

  const actions = (r) => (
    <Button size="sm" variant="secondary" icon={Eye} onClick={() => setActive(r)}>
      Review
    </Button>
  )

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-muted">
        Cashouts are paid through the in world resort process. Review each request, then approve, mark as paid, or
        reject with a note for the member.
      </p>

      <div className="overflow-x-auto pb-1 scrollbar-hide">
        <Tabs tabs={statusTabs} value={tab} onChange={setTab} className="flex-nowrap" />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        actions={actions}
        empty={
          <EmptyState
            icon={Banknote}
            title="No cashout requests waiting right now"
            message="When a member requests a cashout it will appear here for review."
          />
        }
      />

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? `Cashout ${active.id}` : 'Cashout'}
        footer={
          active &&
          (active.status === 'Pending' ? (
            <>
              <Button variant="ghost" icon={X} onClick={() => change(active.id, 'Rejected')}>
                Reject
              </Button>
              <Button icon={Check} onClick={() => change(active.id, 'Approved')}>
                Approve
              </Button>
            </>
          ) : active.status === 'Approved' ? (
            <>
              <Button variant="ghost" icon={X} onClick={() => change(active.id, 'Rejected')}>
                Reject
              </Button>
              <Button icon={CheckCheck} onClick={() => change(active.id, 'Paid')}>
                Mark as paid
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => setActive(null)}>
              Close
            </Button>
          ))
        }
      >
        {active && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">Member</span>
              <span className="font-medium text-ink">{active.avatarName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Amount</span>
              <LcAmount value={active.amountLC} className="text-primary" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Resort location</span>
              <span className="text-ink">{active.resortLocation}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Preferred time</span>
              <span className="text-ink">{active.preferredTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Status</span>
              <Badge status={active.status} />
            </div>
            {active.handledBy && (
              <div className="flex items-center justify-between">
                <span className="text-muted">Handled by</span>
                <span className="text-ink">{active.handledBy}</span>
              </div>
            )}
            <div className="rounded-2xl bg-white/[0.03] p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Notes</p>
              <p className="mt-1 text-ink/90">{active.notes || 'No notes added.'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
