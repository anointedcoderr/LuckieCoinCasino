import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogIn, User, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import LcCoin from '@/components/ui/LcCoin'
import CoinRain from '@/components/ui/CoinRain'

export default function Login() {
  const [form, setForm] = useState({ identity: '', password: '' })
  const [status, setStatus] = useState('idle')
  const { login } = useAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const enter = (role) => {
    setStatus('sending')
    setTimeout(() => {
      const s = login(role)
      setStatus('idle')
      push({ tone: 'success', title: `Welcome back, ${s.avatarName}`, message: 'You are in the club lounge.' })
      navigate(role === 'admin' ? '/admin' : from && from.startsWith('/') ? from : '/dashboard')
    }, 700)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    enter('player')
  }

  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 pb-16 pt-28">
      <CoinRain count={7} />
      <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
      <div className="glass-dark relative w-full max-w-md rounded-3xl border border-primary/20 p-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <LcCoin size={48} glow="strong" />
          <h1 className="mt-4 font-display text-2xl font-bold text-ink">Welcome back to the Club</h1>
          <p className="mt-1 text-sm text-muted">Sign in to play, track your LuckieCoin, and join the tables.</p>
        </div>

        <form className="mt-7 space-y-4" onSubmit={onSubmit}>
          <Field
            label="Username or email"
            name="identity"
            type="text"
            value={form.identity}
            onChange={set('identity')}
            placeholder="aurelia.quinn"
            autoComplete="username"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="Your club password"
            autoComplete="current-password"
          />
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-muted">
              <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-surface-2 accent-primary" />
              Remember me
            </label>
            <span className="text-muted">Resort guests only</span>
          </div>
          <Button type="submit" fullWidth size="lg" icon={LogIn} loading={status === 'sending'}>
            Enter the Club
          </Button>
        </form>

        <div className="mt-6">
          <p className="text-center font-mono text-[10px] uppercase tracking-wider text-muted">Quick access</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              onClick={() => enter('player')}
              className="glass lift-on-hover flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-ink"
            >
              <User className="h-4 w-4 text-primary" />
              Player access
            </button>
            <button
              onClick={() => enter('admin')}
              className="glass lift-on-hover flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm text-ink"
            >
              <ShieldCheck className="h-4 w-4 text-accent-2-light" />
              Management
            </button>
          </div>
        </div>

        <p className="mt-7 text-center text-sm text-muted">
          New to the resort?{' '}
          <Link to="/register" className="font-medium text-primary lift-on-hover">
            Join the Casino Club
          </Link>
        </p>
      </div>
    </section>
  )
}
