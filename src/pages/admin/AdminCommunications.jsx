import { useState } from 'react'
import { Megaphone, Send, Users, Radio } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { formatDateTime } from '@/lib/format'
import AdminPageHeader from '@/components/ui/AdminPageHeader'
import StatCard from '@/components/ui/StatCard'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'

// Member communications. Compose a club wide note to a chosen audience and review
// everything that has gone out from the resort lounge.
export default function AdminCommunications() {
  const data = useData()
  const { push } = useToast()
  const segments = data.segments

  const [form, setForm] = useState({
    title: '',
    body: '',
    audience: segments[0] || '',
  })
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: '' }))
  }

  const send = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'Give the note a title.'
    if (!form.body.trim()) next.body = 'Write a short message for members.'
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    data.createAnnouncement({
      title: form.title.trim(),
      body: form.body.trim(),
      audience: form.audience,
    })
    push({
      tone: 'success',
      title: 'Announcement sent',
      message: `"${form.title.trim()}" is on its way to ${form.audience}.`,
    })
    setForm({ title: '', body: '', audience: segments[0] || '' })
    setErrors({})
  }

  const sentCount = data.announcements.filter((a) => a.status === 'Sent').length
  const scheduledCount = data.announcements.filter((a) => a.status === 'Scheduled').length

  const columns = [
    {
      key: 'title',
      header: 'Announcement',
      render: (r) => (
        <div className="min-w-[220px]">
          <p className="font-medium text-ink/90">{r.title}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted">{r.body}</p>
        </div>
      ),
    },
    {
      key: 'audience',
      header: 'Audience',
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 text-ink/90">
          <Users className="h-3.5 w-3.5 text-accent-2-light" strokeWidth={2.2} />
          {r.audience}
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: (r) => <Badge status={r.status} dot /> },
    {
      key: 'sentAt',
      header: 'Sent',
      align: 'right',
      render: (r) => <span className="font-mono text-xs text-muted">{formatDateTime(r.sentAt)}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <AdminPageHeader description="Send club wide notes to members and keep a clear record of every announcement that leaves the resort lounge." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Announcements" value={data.announcements.length} icon={Megaphone} />
        <StatCard label="Delivered" value={sentCount} icon={Radio} accent="emerald" />
        <StatCard label="Scheduled" value={scheduledCount} icon={Send} accent="purple" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="glass-dark rounded-3xl border border-primary/15 p-6 shadow-card">
          <p className="font-display text-lg font-semibold text-ink">Compose a note</p>
          <p className="mt-1 text-sm text-muted">
            Speak directly to the floor. Choose an audience, then share the news in your own warm voice.
          </p>
          <div className="mt-5 space-y-4">
            <Field
              label="Title"
              name="title"
              value={form.title}
              onChange={set('title')}
              placeholder="High Roller LC Table opens Monday"
              error={errors.title}
              required
            />
            <Field
              label="Message"
              as="textarea"
              name="body"
              value={form.body}
              onChange={set('body')}
              rows={5}
              placeholder="Tell members what is happening and when, in a sentence or two."
              error={errors.body}
              required
            />
            <Field
              label="Audience"
              as="select"
              name="audience"
              value={form.audience}
              onChange={set('audience')}
              options={segments}
            />
            <Button fullWidth icon={Send} onClick={send}>
              Send announcement
            </Button>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-lg font-semibold text-ink">Announcement history</p>
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
              {data.announcements.length} total
            </span>
          </div>
          <DataTable
            columns={columns}
            rows={data.announcements}
            empty={
              <EmptyState
                icon={Megaphone}
                title="No announcements yet"
                message="Your first note to members will appear here once you send it from the compose card."
              />
            }
          />
        </div>
      </div>
    </div>
  )
}
