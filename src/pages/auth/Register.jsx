import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { resortLocations } from '@/data/mockData'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import LcCoin from '@/components/ui/LcCoin'
import CoinRain from '@/components/ui/CoinRain'

export default function Register() {
  const [form, setForm] = useState({
    avatarName: '',
    username: '',
    resortLocation: resortLocations[0],
    password: '',
    confirm: '',
    guest: true,
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const { register } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.avatarName.trim()) errs.avatarName = 'Enter your SecondLife avatar name.'
    if (form.password.length < 4) errs.password = 'Use at least 4 characters.'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('sending')
    setTimeout(() => {
      const s = register(form)
      setStatus('idle')
      push({
        tone: 'success',
        title: `Welcome to the Club, ${s.avatarName}`,
        message: 'Your booking bonus LuckieCoin is ready to play.',
      })
      navigate('/dashboard')
    }, 800)
  }

  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 pb-16 pt-28">
      <CoinRain count={7} />
      <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-2/15 blur-[120px]" />
      <div className="glass-dark relative w-full max-w-lg rounded-3xl border border-primary/20 p-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <LcCoin size={48} glow="strong" />
          <h1 className="mt-4 font-display text-2xl font-bold text-ink">Join the Casino Club</h1>
          <p className="mt-1 text-sm text-muted">
            Create your club membership and claim your resort booking bonus.
          </p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="SecondLife avatar name"
              name="avatarName"
              value={form.avatarName}
              onChange={set('avatarName')}
              placeholder="Aurelia Quinn"
              error={errors.avatarName}
              required
            />
            <Field
              label="Username"
              name="username"
              value={form.username}
              onChange={set('username')}
              placeholder="aurelia.quinn"
            />
          </div>
          <Field
            label="Resort location"
            name="resortLocation"
            as="select"
            value={form.resortLocation}
            onChange={set('resortLocation')}
            options={resortLocations}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="Create a password"
              error={errors.password}
              autoComplete="new-password"
              required
            />
            <Field
              label="Confirm password"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={set('confirm')}
              placeholder="Repeat password"
              error={errors.confirm}
              autoComplete="new-password"
              required
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={form.guest}
              onChange={set('guest')}
              className="h-4 w-4 rounded border-white/20 bg-surface-2 accent-primary"
            />
            I am a resort guest
          </label>
          <Button type="submit" fullWidth size="lg" icon={UserPlus} loading={status === 'sending'}>
            Create Club Membership
          </Button>
        </form>

        <p className="mt-7 text-center text-sm text-muted">
          Already a member?{' '}
          <Link to="/login" className="font-medium text-primary lift-on-hover">
            Log in to the Club
          </Link>
        </p>
      </div>
    </section>
  )
}
