import { useState } from 'react'
import { Banknote } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { resortLocations } from '@/data/mockData'
import Modal from '@/components/ui/Modal'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import LcAmount from '@/components/ui/LcAmount'

export default function CashoutModal({ open, onClose }) {
  const { session } = useAuth()
  const data = useData()
  const { push } = useToast()
  const balance = session ? data.balanceOf(session.userId) : 0
  const [form, setForm] = useState({
    amount: '',
    resortLocation: session?.resortLocation || resortLocations[0],
    preferredTime: 'Evenings SLT',
    notes: '',
  })
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = () => {
    const amt = Number(form.amount)
    if (!amt || amt <= 0) {
      setError('Enter an amount of LC to cash out.')
      return
    }
    if (amt > balance) {
      setError('Amount is more than your current balance.')
      return
    }
    data.requestCashout({
      userId: session.userId,
      avatarName: session.avatarName,
      amountLC: amt,
      resortLocation: form.resortLocation,
      preferredTime: form.preferredTime,
      notes: form.notes,
    })
    push({ tone: 'success', title: 'Cashout requested', message: 'The resort team will handle your payout in world.' })
    setForm((f) => ({ ...f, amount: '', notes: '' }))
    setError('')
    onClose?.()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request a cashout"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} icon={Banknote}>
            Submit request
          </Button>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-muted">
        Cashouts are handled through the in world resort process. Enter your details and the resort team will arrange
        your payout.
      </p>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/[0.03] p-3 text-sm">
        <span className="text-muted">Available balance</span>
        <LcAmount value={balance} className="text-primary" />
      </div>
      <div className="mt-4 space-y-4">
        <Field
          label="Amount of LC"
          name="amount"
          type="number"
          value={form.amount}
          onChange={set('amount')}
          placeholder="500"
          error={error}
          required
        />
        <Field
          label="In world avatar name"
          name="avatar"
          value={session?.avatarName || ''}
          onChange={() => {}}
          hint="Linked to your club membership"
          readOnly
        />
        <Field
          label="Resort location"
          as="select"
          name="resortLocation"
          value={form.resortLocation}
          onChange={set('resortLocation')}
          options={resortLocations}
        />
        <Field
          label="Preferred cashout time"
          name="preferredTime"
          value={form.preferredTime}
          onChange={set('preferredTime')}
          placeholder="Evenings SLT"
        />
        <Field
          label="Notes"
          as="textarea"
          name="notes"
          value={form.notes}
          onChange={set('notes')}
          placeholder="Anything the resort team should know"
          rows={3}
        />
      </div>
    </Modal>
  )
}
