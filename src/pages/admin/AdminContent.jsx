import { useState } from 'react'
import { Save, FileText, HelpCircle, Megaphone } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Switch from '@/components/ui/Switch'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import AdminPageHeader from '@/components/ui/AdminPageHeader'

// A long value reads best in a textarea, short headlines in a single line input.
const isLong = (value) => (value || '').length > 60

// One editable card per site content block. Local draft state seeds from the stored
// value so editors can type freely, then commit with Save.
function ContentBlockCard({ block, onSave, onToggle }) {
  const [value, setValue] = useState(block.value)
  const [saving, setSaving] = useState(false)
  const dirty = value !== block.value
  const isBanner = block.type === 'banner'

  const handleSave = () => {
    setSaving(true)
    onSave(block.id, value)
    // Brief beat so the action feels intentional, then release the button.
    setTimeout(() => setSaving(false), 250)
  }

  return (
    <div className="glass-dark flex flex-col rounded-3xl border border-primary/15 p-6 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold text-ink">{block.label}</p>
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted">{block.id}</p>
        </div>
        {isBanner && (
          <Badge tone={block.enabled ? 'emerald' : 'neutral'} dot>
            {block.enabled ? 'Live' : 'Hidden'}
          </Badge>
        )}
      </div>

      <div className="mt-4">
        {isLong(value) ? (
          <Field
            as="textarea"
            label="Copy"
            name={`${block.id}-value`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
            placeholder="Write the copy guests will read"
          />
        ) : (
          <Field
            label="Copy"
            name={`${block.id}-value`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write the copy guests will read"
          />
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {isBanner ? (
          <label className="flex items-center gap-2.5 text-sm text-muted">
            <Switch
              checked={!!block.enabled}
              onChange={() => onToggle(block.id, block.enabled)}
              label={`Show ${block.label} on the site`}
            />
            <span>Show on the site</span>
          </label>
        ) : (
          <span className="text-xs text-muted">
            {dirty ? 'Changes are ready to publish.' : 'Live on the site.'}
          </span>
        )}
        <Button size="sm" icon={Save} variant="secondary" onClick={handleSave} loading={saving} disabled={!dirty}>
          Save
        </Button>
      </div>
    </div>
  )
}

export default function AdminContent() {
  const data = useData()
  const { push } = useToast()
  const blocks = data.contentBlocks
  const faqs = data.faqs

  const handleSave = (id, value) => {
    data.updateContent(id, value)
    const block = blocks.find((b) => b.id === id)
    push({
      tone: 'success',
      title: 'Content published',
      message: `${block?.label || 'The block'} is now live on the site.`,
    })
  }

  const handleToggle = (id, enabled) => {
    data.toggleContent(id)
    const block = blocks.find((b) => b.id === id)
    push({
      tone: enabled ? 'info' : 'success',
      title: enabled ? 'Banner hidden' : 'Banner live',
      message: `${block?.label || 'The banner'} is now ${enabled ? 'hidden from' : 'showing across'} the resort site.`,
    })
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        description="Shape the words guests see across the resort site. Edit each block, then publish it live in a single tap."
        actions={<Badge tone="gold" icon={FileText}>{blocks.length} blocks</Badge>}
      />

      <section>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Megaphone className="h-4.5 w-4.5" strokeWidth={2} />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-ink">Site copy</p>
            <p className="text-sm text-muted">Headlines, calls to action, and the promo banner.</p>
          </div>
        </div>

        {blocks.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No content blocks yet"
            message="Content blocks for the resort site will appear here once they are added."
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {blocks.map((block) => (
              <ContentBlockCard key={block.id} block={block} onSave={handleSave} onToggle={handleToggle} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/10 text-accent">
            <HelpCircle className="h-4.5 w-4.5" strokeWidth={2} />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-ink">Guest questions</p>
            <p className="text-sm text-muted">The answers members read on the help page.</p>
          </div>
        </div>

        {faqs.length === 0 ? (
          <EmptyState
            icon={HelpCircle}
            title="No questions yet"
            message="Frequently asked questions for guests will appear here once they are added."
          />
        ) : (
          <div className="glass-dark divide-y divide-white/10 rounded-3xl border border-white/10 shadow-card">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-6">
                <p className="font-display text-base font-semibold text-ink">{faq.q}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
