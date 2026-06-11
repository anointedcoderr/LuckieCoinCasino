import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from '@/components/layout/ScrollToTop'
import PublicLayout from '@/components/layout/PublicLayout'
import PlayerLayout from '@/components/layout/PlayerLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import RequireAuth from '@/components/layout/RequireAuth'

import Home from '@/pages/public/Home'
import GamesLobby from '@/pages/public/GamesLobby'
import Slots from '@/pages/public/Slots'
import PokerLobby from '@/pages/public/PokerLobby'
import Leaderboard from '@/pages/public/Leaderboard'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import NotFound from '@/pages/NotFound'

// Authenticated areas are split into their own chunks so guests never download them.
const PlayerDashboard = lazy(() => import('@/pages/player/PlayerDashboard'))
const Wallet = lazy(() => import('@/pages/player/Wallet'))

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminMembers = lazy(() => import('@/pages/admin/AdminMembers'))
const AdminCredit = lazy(() => import('@/pages/admin/AdminCredit'))
const AdminTransactions = lazy(() => import('@/pages/admin/AdminTransactions'))
const AdminCashouts = lazy(() => import('@/pages/admin/AdminCashouts'))
const AdminGames = lazy(() => import('@/pages/admin/AdminGames'))
const AdminTournaments = lazy(() => import('@/pages/admin/AdminTournaments'))
const AdminLeaderboard = lazy(() => import('@/pages/admin/AdminLeaderboard'))
const AdminPromotions = lazy(() => import('@/pages/admin/AdminPromotions'))
const AdminContent = lazy(() => import('@/pages/admin/AdminContent'))
const AdminCommunications = lazy(() => import('@/pages/admin/AdminCommunications'))
const AdminBookings = lazy(() => import('@/pages/admin/AdminBookings'))
const AdminAgents = lazy(() => import('@/pages/admin/AdminAgents'))
const AdminSupport = lazy(() => import('@/pages/admin/AdminSupport'))
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'))
const AdminStaff = lazy(() => import('@/pages/admin/AdminStaff'))
const AdminAudit = lazy(() => import('@/pages/admin/AdminAudit'))
const AdminResponsible = lazy(() => import('@/pages/admin/AdminResponsible'))
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'))

export default function App() {
  return (
    <>
      <div className="noise-overlay" aria-hidden="true" />
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<GamesLobby />} />
          <Route path="/games/slots" element={<Slots />} />
          <Route path="/poker" element={<PokerLobby />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          element={
            <RequireAuth role="player">
              <PlayerLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<PlayerDashboard />} />
          <Route path="/wallet" element={<Wallet />} />
        </Route>

        <Route
          element={
            <RequireAuth role="admin">
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/members" element={<AdminMembers />} />
          <Route path="/admin/credit" element={<AdminCredit />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/cashouts" element={<AdminCashouts />} />
          <Route path="/admin/games" element={<AdminGames />} />
          <Route path="/admin/tournaments" element={<AdminTournaments />} />
          <Route path="/admin/leaderboard" element={<AdminLeaderboard />} />
          <Route path="/admin/promotions" element={<AdminPromotions />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/communications" element={<AdminCommunications />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/agents" element={<AdminAgents />} />
          <Route path="/admin/support" element={<AdminSupport />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/audit" element={<AdminAudit />} />
          <Route path="/admin/responsible" element={<AdminResponsible />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  )
}
