import { Link, NavLink, useNavigate } from 'react-router-dom'
import { X, LogOut, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import LcCoin from '@/components/ui/LcCoin'
import LcAmount from '@/components/ui/LcAmount'
import cx from '@/lib/cx'

function NavItem({ item, onClose }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClose}
      className={({ isActive }) =>
        cx(
          'relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition',
          isActive ? 'bg-white/5 text-primary' : 'text-muted hover:bg-white/5 hover:text-ink',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cx(
              'absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-full bg-gold-sheen transition-all',
              isActive ? 'w-1' : 'w-0',
            )}
          />
          {Icon && <Icon className="h-5 w-5" strokeWidth={2.1} />}
          {item.label}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ items = [], groups, variant = 'player', drawer = false, onClose }) {
  const { session, logout } = useAuth()
  const data = useData()
  const navigate = useNavigate()
  const balance = session ? data.balanceOf(session.userId) : 0

  const handleLogout = () => {
    logout()
    onClose?.()
    navigate('/')
  }

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-5">
        <Link to="/" className="flex items-center gap-2.5">
          <LcCoin size={32} />
          <span className="font-display text-base font-bold text-ink">
            LuckieCoin<span className="text-primary">Casino</span>
          </span>
        </Link>
        <button className="text-muted lg:hidden" onClick={onClose} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      {variant === 'player' && (
        <div className="mx-4 mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Club balance</p>
          <div className="mt-1 flex items-center gap-2">
            <LcCoin size={22} />
            <LcAmount value={balance} className="text-lg text-ink" />
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4 scrollbar-hide">
        {groups
          ? groups.map((g) => (
              <div key={g.title}>
                <p className="px-3.5 pb-1.5 font-mono text-[10px] uppercase tracking-wider text-muted/70">{g.title}</p>
                <div className="space-y-1">
                  {g.items.map((item) => (
                    <NavItem key={item.to} item={item} onClose={onClose} />
                  ))}
                </div>
              </div>
            ))
          : items.map((item) => <NavItem key={item.to} item={item} onClose={onClose} />)}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        {variant === 'admin' && (
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-muted transition hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-muted transition hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="glass-dark sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-white/10 lg:flex lg:flex-col">
        {content}
      </aside>
      {drawer && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-deep/70 backdrop-blur-sm" onClick={onClose} />
          <aside
            className="glass-dark absolute left-0 top-0 h-full w-72 border-r border-primary/20"
            style={{ animation: 'coin-fadein 0.25s ease-out both' }}
          >
            {content}
          </aside>
        </div>
      )}
    </>
  )
}
