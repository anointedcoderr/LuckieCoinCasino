import { useState, useMemo } from 'react'
import { LifeBuoy, Eye, Send, CheckCircle2, Clock } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { formatDateTime, relativeTime } from '@/lib/format'
import Tabs from '@/components/ui/Tabs'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import SlideOver from '@/components/ui/SlideOver'
import EmptyState from '@/components/ui/EmptyState'
import Avatar from '@/components/ui/Avatar'
import AdminPageHeader from '@/components/ui/AdminPageHeader'

export default function AdminSupport() {
  const data = useData()
  const { push } = useToast()
  const [tab, setTab] = useState('all')
  const [activeId, setActiveId] = useState(null)
  const [reply, setReply] = useState('')

  const tickets = data.tickets
  const active = useMemo(() => tickets.find((t) => t.id === activeId) || null, [tickets, activeId])

  const counts = useMemo(() => {
    const c = { all: tickets.length, Open: 0, Pending: 0, Resolved: 0 }
    tickets.forEach((t) => {
      c[t.status] = (c[t.status] || 0) + 1
    })
    return c
  }, [tickets])

  const statusTabs = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'Open', label: 'Open', count: counts.Open },
    { key: 'Pending', label: 'Pending', count: counts.Pending },
    { key: 'Resolved', label: 'Resolved', count: counts.Resolved },
  ]

  const rows = useMemo(
    () => (tab === 'all' ? tickets : tickets.filter((t) => t.status === tab)),
    [tab, tickets],
  )

  const openTicket = (t) => {
    setActiveId(t.id)
    setReply('')
  }

  const closeTicket = () => {
    setActiveId(null)
    setReply('')
  }

  const sendReply = () => {
    const text = reply.trim()
    if (!active || !text) return
    data.replyTicket(active.id, text)
    setReply('')
    push({
      tone: 'success',
      title: 'Reply sent',
      message: `Your note was added to ${active.id}.`,
    })
  }

  const changeStatus = (status) => {
    if (!active) return
    data.setTicketStatus(active.id, status)
    push({
      tone: status === 'Resolved' ? 'success' : 'info',
      title: `Ticket marked ${status.toLowerCase()}`,
      message: `${active.id} is now ${status}.`,
    })
  }

  const columns = [
    {
      key: 'id',
      header: 'Ticket',
      render: (t) => <span className="font-mono text-xs text-muted">{t.id}</span>,
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (t) => <span className="font-medium text-ink/90">{t.subject}</span>,
    },
    {
      key: 'member',
      header: 'Member',
      render: (t) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={t.member} size={30} />
          <span className="text-ink/90">{t.member}</span>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (t) => <Badge tone={t.priority === 'High' ? 'gold' : 'neutral'}>{t.priority}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <Badge status={t.status} />,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (t) => <span className="text-muted">{formatDateTime(t.createdAt)}</span>,
    },
  ]

  const actions = (t) => (
    <Button size="sm" variant="secondary" icon={Eye} onClick={() => openTicket(t)}>
      Open
    </Button>
  )

  return (
    <div className="space-y-6">
      <AdminPageHeader description="Member messages from across the resort floor. Open a ticket to read the thread, reply with care, then mark it resolved or pending while you follow up." />

      <div className="overflow-x-auto pb-1 scrollbar-hide">
        <Tabs tabs={statusTabs} value={tab} onChange={setTab} className="flex-nowrap" />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        actions={actions}
        empty={
          <EmptyState
            icon={LifeBuoy}
            title="No tickets in this view"
            message="When a member reaches out, their message will arrive here for a warm reply."
          />
        }
      />

      <SlideOver
        open={Boolean(active)}
        onClose={closeTicket}
        title={active ? active.subject : 'Ticket'}
        subtitle={active ? `${active.id} from ${active.member}` : undefined}
        width="max-w-lg"
        footer={
          active && (
            <>
              <Button variant="ghost" icon={Clock} onClick={() => changeStatus('Pending')}>
                Mark pending
              </Button>
              <Button variant="emerald" icon={CheckCircle2} onClick={() => changeStatus('Resolved')}>
                Mark resolved
              </Button>
            </>
          )
        }
      >
        {active && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <Badge tone={active.priority === 'High' ? 'gold' : 'neutral'}>{active.priority} priority</Badge>
              <Badge status={active.status} />
            </div>

            <div className="space-y-3">
              {active.messages.map((m, i) => (
                <div key={`${active.id}-${i}`} className="rounded-2xl bg-white/[0.03] p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-sm font-semibold text-ink">{m.from}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                      {relativeTime(m.at)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink/90">{m.text}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4">
              <Field
                as="textarea"
                label="Reply to member"
                name="reply"
                rows={4}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a warm, helpful reply."
              />
              <div className="mt-3 flex justify-end">
                <Button icon={Send} onClick={sendReply} disabled={!reply.trim()}>
                  Send reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  )
}
