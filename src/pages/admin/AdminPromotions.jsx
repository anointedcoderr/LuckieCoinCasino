import { useState } from 'react'
import { Gift, Plus, Trash2, Ticket, Power, PowerOff, Sparkles } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { formatDate } from '@/lib/format'
import AdminPageHeader from '@/components/ui/AdminPageHeader'
import DataTable from '@/components/ui/DataTable'
import Modal from '@/components/ui/Modal'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import LcAmount from '@/components/ui/LcAmount'
import ProgressBar from '@/components/ui/ProgressBar'
import EmptyState from '@/components/ui/EmptyState'

const emptyPromo = { title: '', detail: '', bonusLc: '', tag: '' }
const emptyCode = { code: '', bonusLc: '', maxUses: '', expiresAt: '' }

export default function AdminPromotions() {
  const data = useData()
  const { push } = useToast()

  const [promoOpen, setPromoOpen] = useState(false)
  const [codeOpen, setCodeOpen] = useState(false)
  const [removing, setRemoving] = useState(null)
  const [promoForm, setPromoForm] = useState(emptyPromo)
  const [codeForm, setCodeForm] = useState(emptyCode)
  const [promoError, setPromoError] = useState('')
  const [codeError, setCodeError] = useState('')

  const setPromo = (k) => (e) => setPromoForm((f) => ({ ...f, [k]: e.target.value }))
  const setCode = (k) => (e) => setCodeForm((f) => ({ ...f, [k]: e.target.value }))

  const openPromo = () => {
    setPromoForm(emptyPromo)
    setPromoError('')
    setPromoOpen(true)
  }

  const openCode = () => {
    setCodeForm(emptyCode)
    setCodeError('')
    setCodeOpen(true)
  }

  const savePromo = () => {
    const bonus = Number(promoForm.bonusLc)
    if (!promoForm.title.trim()) {
      setPromoError('Give the promotion a title.')
      return
    }
    if (!bonus || bonus <= 0) {
      setPromoError('Enter a bonus amount of LC.')
      return
    }
    data.createPromotion({
      title: promoForm.title.trim(),
      detail: promoForm.detail.trim() || 'A new reward for our members.',
      bonusLc: bonus,
      tag: promoForm.tag.trim() || 'New',
    })
    push({ tone: 'success', title: 'Promotion added', message: `${promoForm.title.trim()} is now live for members.` })
    setPromoOpen(false)
    setPromoForm(emptyPromo)
  }

  const saveCode = () => {
    const bonus = Number(codeForm.bonusLc)
    const max = Number(codeForm.maxUses)
    if (!codeForm.code.trim()) {
      setCodeError('Enter a code for members to redeem.')
      return
    }
    if (!bonus || bonus <= 0) {
      setCodeError('Enter a bonus amount of LC.')
      return
    }
    data.createPromoCode({
      code: codeForm.code.trim().toUpperCase(),
      bonusLc: bonus,
      maxUses: max && max > 0 ? max : 100,
      expiresAt: codeForm.expiresAt || null,
    })
    push({ tone: 'success', title: 'Code created', message: `${codeForm.code.trim().toUpperCase()} is ready to share.` })
    setCodeOpen(false)
    setCodeForm(emptyCode)
  }

  const confirmRemove = () => {
    if (!removing) return
    data.removePromotion(removing.id)
    push({ tone: 'info', title: 'Promotion removed', message: `${removing.title} is no longer shown to members.` })
    setRemoving(null)
  }

  const toggleCode = (row) => {
    const next = row.status === 'Active' ? 'Disabled' : 'Active'
    data.setPromoCodeStatus(row.id, next)
    push({
      tone: next === 'Active' ? 'success' : 'warn',
      title: next === 'Active' ? 'Code enabled' : 'Code disabled',
      message: `${row.code} is now ${next.toLowerCase()}.`,
    })
  }

  const codeColumns = [
    { key: 'code', header: 'Code', render: (r) => <span className="font-mono text-sm font-semibold text-ink">{r.code}</span> },
    { key: 'bonusLc', header: 'Bonus', align: 'right', render: (r) => <LcAmount value={r.bonusLc} showCode={false} className="text-primary" /> },
    {
      key: 'uses',
      header: 'Uses',
      render: (r) => (
        <div className="min-w-[150px]">
          <div className="mb-1 flex items-center justify-between font-mono text-[11px] text-muted">
            <span>{r.uses} of {r.maxUses}</span>
          </div>
          <ProgressBar value={r.uses} max={r.maxUses} />
        </div>
      ),
    },
    { key: 'status', header: 'Status', render: (r) => <Badge status={r.status === 'Disabled' || r.status === 'Expired' ? 'Closed' : r.status}>{r.status}</Badge> },
    { key: 'expiresAt', header: 'Expires', render: (r) => <span className="text-muted">{r.expiresAt ? formatDate(r.expiresAt) : 'No expiry'}</span> },
  ]

  const codeActions = (r) => {
    const enabling = r.status !== 'Active'
    return (
      <Button
        size="sm"
        variant="secondary"
        icon={enabling ? Power : PowerOff}
        onClick={() => toggleCode(r)}
      >
        {enabling ? 'Enable' : 'Disable'}
      </Button>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        description="Shape the rewards members see across the resort. Publish promotions for the lounge and manage the redeemable codes your team shares in world."
        actions={
          <>
            <Button variant="secondary" icon={Ticket} onClick={openCode}>
              New code
            </Button>
            <Button icon={Plus} onClick={openPromo}>
              New promotion
            </Button>
          </>
        }
      />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Live promotions</h2>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{data.promotions.length} active</span>
        </div>

        {data.promotions.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {data.promotions.map((promo) => (
              <article
                key={promo.id}
                className="glass-dark flex flex-col rounded-3xl border border-primary/15 p-6 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Sparkles className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <Badge tone="purple">{promo.tag}</Badge>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{promo.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{promo.detail}</p>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Bonus</p>
                    <LcAmount value={promo.bonusLc} className="text-base text-accent" />
                  </div>
                  <Button size="sm" variant="ghost" icon={Trash2} onClick={() => setRemoving(promo)}>
                    Remove
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Gift}
            title="No promotions are live right now"
            message="Add a promotion to feature a fresh reward in the LuckieCoin lounge."
            action={
              <Button icon={Plus} onClick={openPromo}>
                New promotion
              </Button>
            }
          />
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Promo codes</h2>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{data.promoCodes.length} codes</span>
        </div>

        <DataTable
          columns={codeColumns}
          rows={data.promoCodes}
          actions={codeActions}
          empty={
            <EmptyState
              icon={Ticket}
              title="No promo codes yet"
              message="Create a code your team can share for members to redeem bonus LuckieCoin."
              action={
                <Button icon={Ticket} onClick={openCode}>
                  New code
                </Button>
              }
            />
          }
        />
      </section>

      <Modal
        open={promoOpen}
        onClose={() => setPromoOpen(false)}
        title="New promotion"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPromoOpen(false)}>
              Cancel
            </Button>
            <Button icon={Plus} onClick={savePromo}>
              Publish promotion
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field
            label="Title"
            name="title"
            value={promoForm.title}
            onChange={setPromo('title')}
            placeholder="Weekend High Roller"
            error={promoError && !promoForm.title.trim() ? promoError : ''}
            required
          />
          <Field
            label="Detail"
            as="textarea"
            name="detail"
            value={promoForm.detail}
            onChange={setPromo('detail')}
            placeholder="Describe the reward members will see in the lounge."
            rows={3}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Bonus LC"
              name="bonusLc"
              type="number"
              value={promoForm.bonusLc}
              onChange={setPromo('bonusLc')}
              placeholder="2500"
              error={promoError && promoForm.title.trim() ? promoError : ''}
              required
            />
            <Field
              label="Tag"
              name="tag"
              value={promoForm.tag}
              onChange={setPromo('tag')}
              placeholder="Weekend"
              hint="Short label shown on the card."
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        title="New code"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCodeOpen(false)}>
              Cancel
            </Button>
            <Button icon={Ticket} onClick={saveCode}>
              Create code
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field
            label="Code"
            name="code"
            value={codeForm.code}
            onChange={setCode('code')}
            placeholder="RESORTGOLD"
            hint="Members enter this code to redeem the bonus."
            error={codeError && !codeForm.code.trim() ? codeError : ''}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Bonus LC"
              name="bonusLc"
              type="number"
              value={codeForm.bonusLc}
              onChange={setCode('bonusLc')}
              placeholder="1000"
              error={codeError && codeForm.code.trim() ? codeError : ''}
              required
            />
            <Field
              label="Max uses"
              name="maxUses"
              type="number"
              value={codeForm.maxUses}
              onChange={setCode('maxUses')}
              placeholder="200"
              hint="Defaults to 100 if left blank."
            />
          </div>
          <Field
            label="Expires"
            name="expiresAt"
            type="date"
            value={codeForm.expiresAt}
            onChange={setCode('expiresAt')}
            hint="Leave blank for no expiry."
          />
        </div>
      </Modal>

      <Modal
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        title="Remove promotion"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRemoving(null)}>
              Keep it
            </Button>
            <Button variant="danger" icon={Trash2} onClick={confirmRemove}>
              Remove promotion
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-muted">
          {removing ? `${removing.title} will no longer appear to members. You can add it again at any time.` : ''}
        </p>
      </Modal>
    </div>
  )
}
