import { Menu, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import Avatar from '@/components/ui/Avatar'
import LcCoin from '@/components/ui/LcCoin'
import LcAmount from '@/components/ui/LcAmount'

const titles = {
  '/dashboard': 'Player Dashboard',
  '/wallet': 'LC Wallet',
  '/admin': 'Club Overview',
  '/admin/members': 'Members',
  '/admin/credit': 'Credit LuckieCoin',
  '/admin/transactions': 'Transactions',
  '/admin/cashouts': 'Cashout Requests',
  '/admin/games': 'Games Management',
  '/admin/tournaments': 'Tournaments',
  '/admin/leaderboard': 'Leaderboard',
  '/admin/promotions': 'Promotions',
  '/admin/content': 'Content',
  '/admin/communications': 'Communications',
  '/admin/bookings': 'Resort Bookings',
  '/admin/agents': 'Casino Agents',
  '/admin/support': 'Support',
  '/admin/analytics': 'Analytics',
  '/admin/staff': 'Staff and Roles',
  '/admin/audit': 'Audit Log',
  '/admin/responsible': 'Responsible Gaming',
  '/admin/settings': 'Settings',
}

export default function Topbar({ variant = 'player', onMenu, onCommand }) {
  const { session } = useAuth()
  const data = useData()
  const { pathname } = useLocation()
  const title = titles[pathname] || (variant === 'admin' ? 'Management' : 'Dashboard')
  const balance = session ? data.balanceOf(session.userId) : 0

  return (
    <header className="glass sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6 lg:px-10">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="text-ink lg:hidden" aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="font-display text-lg font-semibold text-ink sm:text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        {variant === 'admin' && onCommand && (
          <button
            onClick={onCommand}
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-muted transition hover:text-ink md:inline-flex"
            aria-label="Open command palette"
          >
            <Search className="h-4 w-4" />
            Search
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px]">Ctrl K</kbd>
          </button>
        )}
        {variant === 'admin' && onCommand && (
          <button onClick={onCommand} className="text-muted transition hover:text-ink md:hidden" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
        )}
        {variant === 'player' && (
          <span className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 sm:inline-flex">
            <LcCoin size={20} />
            <LcAmount value={balance} className="text-sm text-ink" />
          </span>
        )}
        <div className="flex items-center gap-2.5">
          <Avatar name={session?.avatarName} size={36} ring={variant === 'admin' ? 'purple' : 'gold'} />
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-ink">{session?.avatarName}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{session?.tier}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
