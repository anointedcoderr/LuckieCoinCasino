import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { publicNav } from '@/data/navConfig'
import { useAuth } from '@/context/AuthContext'
import LcCoin from '@/components/ui/LcCoin'
import Button from '@/components/ui/Button'
import cx from '@/lib/cx'

function Wordmark({ size = 'text-lg sm:text-xl' }) {
  return (
    <span className={cx('font-display font-bold tracking-wide text-ink', size)}>
      LuckieCoin<span className="text-primary">Casino</span>
    </span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { isAuthed, isAdmin } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        className={cx(
          'mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-2.5 transition-all sm:px-6',
          scrolled ? 'glass border-primary/20' : 'border-transparent',
        )}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <LcCoin size={34} glow="soft" />
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {publicNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cx(
                  'lift-on-hover rounded-full px-3.5 py-2 text-sm font-medium transition',
                  isActive ? 'text-primary' : 'text-muted hover:text-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthed ? (
            <Button size="sm" to={isAdmin ? '/admin' : '/dashboard'}>
              {isAdmin ? 'Management' : 'My Dashboard'}
            </Button>
          ) : (
            <>
              <Button size="sm" variant="ghost" to="/login">
                Log In
              </Button>
              <Button size="sm" to="/register">
                Join Casino Club
              </Button>
            </>
          )}
        </div>

        <button
          className="text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div
          className="glass-dark mx-auto mt-3 max-w-7xl rounded-3xl border border-primary/20 p-4 lg:hidden"
          style={{ animation: 'coin-fadein 0.25s ease-out both' }}
        >
          <div className="flex flex-col gap-1">
            {publicNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cx(
                    'rounded-2xl px-4 py-3 text-sm font-medium',
                    isActive ? 'bg-primary/15 text-primary' : 'text-ink/90 hover:bg-white/5',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
            {isAuthed ? (
              <Button fullWidth to={isAdmin ? '/admin' : '/dashboard'}>
                {isAdmin ? 'Management' : 'My Dashboard'}
              </Button>
            ) : (
              <>
                <Button fullWidth variant="secondary" to="/login">
                  Log In
                </Button>
                <Button fullWidth to="/register">
                  Join Casino Club
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
