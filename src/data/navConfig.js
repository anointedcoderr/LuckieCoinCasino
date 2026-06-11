import {
  Home,
  Dice5,
  Cherry,
  Spade,
  Trophy,
  LayoutDashboard,
  Wallet,
  Gauge,
  Coins,
  Banknote,
  Gamepad2,
  Users,
  ArrowLeftRight,
  Gift,
  FileText,
  Megaphone,
  BedDouble,
  BadgeCheck,
  LifeBuoy,
  BarChart3,
  Shield,
  ScrollText,
  HeartHandshake,
  Settings,
} from 'lucide-react'

export const publicNav = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Games', to: '/games', icon: Dice5 },
  { label: 'Slots', to: '/games/slots', icon: Cherry },
  { label: 'Poker', to: '/poker', icon: Spade },
  { label: 'Leaderboard', to: '/leaderboard', icon: Trophy },
]

export const publicCtas = [
  { label: 'Log In', to: '/login', variant: 'ghost' },
  { label: 'Join Casino Club', to: '/register', variant: 'primary' },
]

export const playerNav = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Wallet', to: '/wallet', icon: Wallet },
  { label: 'Games Lobby', to: '/games', icon: Dice5 },
  { label: 'Slots', to: '/games/slots', icon: Cherry },
  { label: 'Poker Room', to: '/poker', icon: Spade },
  { label: 'Leaderboard', to: '/leaderboard', icon: Trophy },
]

export const adminNavGroups = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', to: '/admin', icon: Gauge, end: true }],
  },
  {
    title: 'Members and money',
    items: [
      { label: 'Members', to: '/admin/members', icon: Users },
      { label: 'Credit LC', to: '/admin/credit', icon: Coins },
      { label: 'Transactions', to: '/admin/transactions', icon: ArrowLeftRight },
      { label: 'Cashouts', to: '/admin/cashouts', icon: Banknote },
    ],
  },
  {
    title: 'Games and play',
    items: [
      { label: 'Games', to: '/admin/games', icon: Gamepad2 },
      { label: 'Tournaments', to: '/admin/tournaments', icon: Spade },
      { label: 'Leaderboard', to: '/admin/leaderboard', icon: Trophy },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Promotions', to: '/admin/promotions', icon: Gift },
      { label: 'Content', to: '/admin/content', icon: FileText },
      { label: 'Communications', to: '/admin/communications', icon: Megaphone },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Bookings', to: '/admin/bookings', icon: BedDouble },
      { label: 'Agents', to: '/admin/agents', icon: BadgeCheck },
      { label: 'Support', to: '/admin/support', icon: LifeBuoy },
      { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'Platform',
    items: [
      { label: 'Staff and roles', to: '/admin/staff', icon: Shield },
      { label: 'Audit log', to: '/admin/audit', icon: ScrollText },
      { label: 'Responsible gaming', to: '/admin/responsible', icon: HeartHandshake },
      { label: 'Settings', to: '/admin/settings', icon: Settings },
    ],
  },
]

// Flat list kept for the command palette and any simple consumers.
export const adminNav = adminNavGroups.flatMap((g) => g.items)
