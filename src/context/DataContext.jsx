import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import * as seed from '@/data/mockData'
import * as admin from '@/data/adminData'
import { useAuth } from '@/context/AuthContext'
import { transactionsForUser } from '@/lib/money'

// Live in world seeded data for the session. Mutations from the management screens
// reflect immediately on the player screens because both read from this single store.
// Every management action is recorded to the audit log. Refreshing re-seeds the data.

const DataContext = createContext(null)
let seq = 9000
const nextId = (p) => `${p}-${++seq}`
const nowIso = () => new Date().toISOString()
const clone = (arr, deep = false) =>
  arr.map((item) => (deep ? JSON.parse(JSON.stringify(item)) : { ...item }))

export function DataProvider({ children }) {
  const { session } = useAuth()
  const actor = session?.role === 'admin' ? session.avatarName : 'Management'

  const [users, setUsers] = useState(() => clone(seed.users))
  const [transactions, setTransactions] = useState(() => clone(seed.lcTransactions))
  const [cashoutRequests, setCashoutRequests] = useState(() => clone(seed.cashoutRequests))
  const [slotGames, setSlotGames] = useState(() => clone(seed.slotGames))
  const [tableGames, setTableGames] = useState(() => clone(seed.tableGames))
  const [tournaments, setTournaments] = useState(() => clone(seed.pokerTournaments, true))
  const [activity, setActivity] = useState(() => clone(seed.recentActivity))
  const [promotions, setPromotions] = useState(() => clone(seed.promotions))
  const [agents, setAgents] = useState(() => clone(seed.casinoAgents))
  const [bookings, setBookings] = useState(() => clone(seed.resortBookings))

  const [staff, setStaff] = useState(() => clone(admin.staff))
  const [auditLog, setAuditLog] = useState(() => clone(admin.auditLog))
  const [promoCodes, setPromoCodes] = useState(() => clone(admin.promoCodes))
  const [announcements, setAnnouncements] = useState(() => clone(admin.announcements))
  const [tickets, setTickets] = useState(() => clone(admin.supportTickets, true))
  const [contentBlocks, setContentBlocks] = useState(() => clone(admin.contentBlocks))
  const [settings, setSettings] = useState(() => JSON.parse(JSON.stringify(admin.siteSettings)))
  const [cashoutRules, setCashoutRules] = useState(() => ({ ...admin.cashoutRules }))
  const [rgPlayers, setRgPlayers] = useState(() => clone(admin.rgPlayers))

  const logAction = useCallback(
    (action, module, detail) => {
      setAuditLog((list) => [{ id: nextId('au'), at: nowIso(), actor, action, module, detail }, ...list])
    },
    [actor],
  )

  // Selectors
  const getUser = useCallback((userId) => users.find((u) => u.id === userId) || null, [users])
  const balanceOf = useCallback((userId) => users.find((u) => u.id === userId)?.lcBalance ?? 0, [users])
  const userTransactions = useCallback((userId) => transactionsForUser(transactions, userId), [transactions])

  // Economy
  const applyDelta = useCallback((userId, delta) => {
    let after = 0
    let name = ''
    setUsers((list) =>
      list.map((u) => {
        if (u.id === userId) {
          after = Math.max(0, u.lcBalance + delta)
          name = u.avatarName
          return { ...u, lcBalance: after }
        }
        return u
      }),
    )
    return { after, name }
  }, [])

  const creditLc = useCallback(
    ({ userId, amount, reason, note, agentName }) => {
      const amt = Math.abs(Number(amount) || 0)
      if (!userId || !amt) return null
      const { after, name } = applyDelta(userId, amt)
      const tx = { id: nextId('tx'), userId, type: 'Admin Credit', amount: amt, balanceAfter: after, ref: nextId('CR'), note: note || reason || 'Manual credit', createdAt: nowIso() }
      setTransactions((l) => [tx, ...l])
      setActivity((l) => [{ id: nextId('ac'), type: 'Admin Credit', actor: name, detail: `Credited ${name}${agentName ? `, verified by ${agentName}` : ''}`, amountLC: amt, at: nowIso() }, ...l])
      logAction('Credited LC', 'Economy', `Credited ${amt.toLocaleString('en-US')} LC to ${name}`)
      return tx
    },
    [applyDelta, logAction],
  )

  const deductLc = useCallback(
    ({ userId, amount, reason, note }) => {
      const amt = Math.abs(Number(amount) || 0)
      if (!userId || !amt) return null
      const { after, name } = applyDelta(userId, -amt)
      const tx = { id: nextId('tx'), userId, type: 'Slot Game Play', amount: -amt, balanceAfter: after, ref: nextId('ADJ'), note: note || reason || 'Manual adjustment', createdAt: nowIso() }
      setTransactions((l) => [tx, ...l])
      logAction('Deducted LC', 'Economy', `Deducted ${amt.toLocaleString('en-US')} LC from ${name}`)
      return tx
    },
    [applyDelta, logAction],
  )

  const reverseTransaction = useCallback(
    (txId) => {
      const orig = transactions.find((t) => t.id === txId)
      if (!orig) return null
      const { after, name } = applyDelta(orig.userId, -orig.amount)
      const tx = { id: nextId('tx'), userId: orig.userId, type: 'Admin Credit', amount: -orig.amount, balanceAfter: after, ref: `REV-${orig.ref}`, note: `Reversal of ${orig.type} (${orig.ref})`, createdAt: nowIso() }
      setTransactions((l) => [tx, ...l])
      logAction('Reversed transaction', 'Economy', `Reversed ${orig.ref} for ${name}`)
      return tx
    },
    [transactions, applyDelta, logAction],
  )

  // Cashouts
  const requestCashout = useCallback(
    ({ userId, avatarName, amountLC, resortLocation, preferredTime, notes }) => {
      const amt = Math.abs(Number(amountLC) || 0)
      if (!userId || !amt) return null
      const id = nextId('CO')
      const { after } = applyDelta(userId, -amt)
      const tx = { id: nextId('tx'), userId, type: 'Cashout Request', amount: -amt, balanceAfter: after, ref: id, note: 'Cashout requested, handled in world', createdAt: nowIso() }
      setTransactions((l) => [tx, ...l])
      const request = { id, userId, avatarName, amountLC: amt, resortLocation, preferredTime, notes: notes || '', status: 'Pending', requestedAt: nowIso(), handledBy: null }
      setCashoutRequests((l) => [request, ...l])
      setActivity((l) => [{ id: nextId('ac'), type: 'Cashout Request', actor: avatarName, detail: 'Requested cashout, pending review', amountLC: amt, at: nowIso() }, ...l])
      return request
    },
    [applyDelta],
  )

  const setCashoutStatus = useCallback(
    (id, status, handledBy) => {
      setCashoutRequests((l) => l.map((c) => (c.id === id ? { ...c, status, handledBy: handledBy || actor } : c)))
      logAction(`${status} cashout`, 'Cashouts', `Marked ${id} as ${status}`)
    },
    [logAction, actor],
  )

  const updateCashoutRules = useCallback(
    (patch) => {
      setCashoutRules((r) => ({ ...r, ...patch }))
      logAction('Updated cashout rules', 'Cashouts', 'Changed cashout limits or fees')
    },
    [logAction],
  )

  // Members
  const setUserStatus = useCallback(
    (userId, status) => {
      setUsers((l) => l.map((u) => (u.id === userId ? { ...u, status } : u)))
      const name = getUser(userId)?.avatarName
      logAction('Updated member status', 'Members', `Set ${name} to ${status}`)
    },
    [getUser, logAction],
  )
  const setUserTier = useCallback(
    (userId, tier) => {
      setUsers((l) => l.map((u) => (u.id === userId ? { ...u, tier } : u)))
      logAction('Updated member tier', 'Members', `Set ${getUser(userId)?.avatarName} to ${tier}`)
    },
    [getUser, logAction],
  )
  const updateUser = useCallback(
    (userId, patch) => {
      setUsers((l) => l.map((u) => (u.id === userId ? { ...u, ...patch } : u)))
      logAction('Edited member', 'Members', `Updated ${getUser(userId)?.avatarName}`)
    },
    [getUser, logAction],
  )
  const addMember = useCallback(
    (data) => {
      const id = nextId('p')
      setUsers((l) => [{ id, role: 'player', lcBalance: 0, bonusLc: 0, rank: null, tier: 'Silver Club', status: 'Active', joinedAt: nowIso().slice(0, 10), lastActive: nowIso(), ...data }, ...l])
      logAction('Created member', 'Members', `Added ${data.avatarName}`)
      return id
    },
    [logAction],
  )

  // Games
  const setSlotStatus = useCallback((id, status) => { setSlotGames((l) => l.map((g) => (g.id === id ? { ...g, status } : g))); logAction('Updated slot', 'Games', `Set ${id} to ${status}`) }, [logAction])
  const setTableStatus = useCallback((id, status) => { setTableGames((l) => l.map((g) => (g.id === id ? { ...g, status } : g))); logAction('Updated table', 'Games', `Set ${id} to ${status}`) }, [logAction])
  const setTournamentStatus = useCallback((id, status) => { setTournaments((l) => l.map((t) => (t.id === id ? { ...t, status } : t))); logAction('Updated tournament', 'Games', `Set ${id} to ${status}`) }, [logAction])
  const updateGame = useCallback((id, patch) => { setSlotGames((l) => l.map((g) => (g.id === id ? { ...g, ...patch } : g))); logAction('Edited game', 'Games', `Updated ${id}`) }, [logAction])
  const addSlotGame = useCallback(
    (game) => {
      setSlotGames((l) => [{ id: nextId('sl'), theme: 'fortune', minLC: 25, popularity: 0, mobileReady: true, status: 'New', type: 'Resort Slot', reels: '5 reels', blurb: 'Newly added to the resort floor.', ...game }, ...l])
      logAction('Added game', 'Games', `Added ${game.name}`)
    },
    [logAction],
  )
  const createTournament = useCallback(
    (data) => {
      setTournaments((l) => [{ id: nextId('pt'), buyInLC: 0, prizePool: 0, seats: { filled: 0, total: 50 }, startTime: nowIso(), status: 'Open', tag: 'New', ...data }, ...l])
      logAction('Created tournament', 'Games', `Created ${data.title}`)
    },
    [logAction],
  )

  // Marketing
  const createPromotion = useCallback((data) => { setPromotions((l) => [{ id: nextId('promo'), tag: 'New', ...data }, ...l]); logAction('Created promotion', 'Marketing', `Added ${data.title}`) }, [logAction])
  const removePromotion = useCallback((id) => { setPromotions((l) => l.filter((p) => p.id !== id)); logAction('Removed promotion', 'Marketing', `Removed ${id}`) }, [logAction])
  const createPromoCode = useCallback((data) => { setPromoCodes((l) => [{ id: nextId('pc'), uses: 0, maxUses: 100, status: 'Active', ...data }, ...l]); logAction('Created promo code', 'Marketing', `Added ${data.code}`) }, [logAction])
  const setPromoCodeStatus = useCallback((id, status) => { setPromoCodes((l) => l.map((p) => (p.id === id ? { ...p, status } : p))); logAction('Updated promo code', 'Marketing', `Set ${id} to ${status}`) }, [logAction])
  const createAnnouncement = useCallback(
    (data) => {
      setAnnouncements((l) => [{ id: nextId('an'), status: 'Sent', sentAt: nowIso(), ...data }, ...l])
      logAction('Sent announcement', 'Marketing', `Sent "${data.title}" to ${data.audience}`)
    },
    [logAction],
  )
  const updateContent = useCallback((id, value) => { setContentBlocks((l) => l.map((c) => (c.id === id ? { ...c, value } : c))); logAction('Edited content', 'Marketing', `Updated ${id}`) }, [logAction])
  const toggleContent = useCallback((id) => { setContentBlocks((l) => l.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))); logAction('Toggled content', 'Marketing', `Toggled ${id}`) }, [logAction])

  // Support
  const replyTicket = useCallback(
    (id, text) => {
      setTickets((l) => l.map((t) => (t.id === id ? { ...t, status: 'Pending', lastReply: actor, messages: [...t.messages, { from: actor, text, at: nowIso() }] } : t)))
      logAction('Replied to ticket', 'Operations', `Replied on ${id}`)
    },
    [logAction, actor],
  )
  const setTicketStatus = useCallback((id, status) => { setTickets((l) => l.map((t) => (t.id === id ? { ...t, status } : t))); logAction('Updated ticket', 'Operations', `Set ${id} to ${status}`) }, [logAction])

  // Bookings and agents
  const updateBooking = useCallback((id, patch) => { setBookings((l) => l.map((b) => (b.id === id ? { ...b, ...patch } : b))); logAction('Updated booking', 'Operations', `Updated ${id}`) }, [logAction])
  const setAgentStatus = useCallback((id, status) => { setAgents((l) => l.map((a) => (a.id === id ? { ...a, status } : a))); logAction('Updated agent', 'Operations', `Set ${id} to ${status}`) }, [logAction])
  const addAgent = useCallback((data) => { setAgents((l) => [{ id: nextId('ag'), role: 'Casino Agent', verifiedPayments: 0, status: 'Online', activeSince: nowIso().slice(0, 10), ...data }, ...l]); logAction('Added agent', 'Operations', `Added ${data.avatarName}`) }, [logAction])

  // Staff and platform
  const setStaffRole = useCallback((id, role) => { setStaff((l) => l.map((s) => (s.id === id ? { ...s, role } : s))); logAction('Changed staff role', 'Platform', `Set ${id} to ${role}`) }, [logAction])
  const setStaffStatus = useCallback((id, status) => { setStaff((l) => l.map((s) => (s.id === id ? { ...s, status } : s))); logAction('Updated staff', 'Platform', `Set ${id} to ${status}`) }, [logAction])
  const addStaff = useCallback((data) => { setStaff((l) => [{ id: nextId('st'), role: 'support', status: 'Active', lastActive: nowIso(), ...data }, ...l]); logAction('Invited staff', 'Platform', `Invited ${data.name}`) }, [logAction])
  const updateSettings = useCallback((section, patch) => { setSettings((s) => ({ ...s, [section]: { ...s[section], ...patch } })); logAction('Updated settings', 'Platform', `Changed ${section} settings`) }, [logAction])
  const toggleFeature = useCallback((key) => { setSettings((s) => ({ ...s, features: { ...s.features, [key]: !s.features[key] } })); logAction('Toggled feature', 'Platform', `Toggled ${key}`) }, [logAction])
  const setMaintenance = useCallback((on) => { setSettings((s) => ({ ...s, maintenanceMode: on })); logAction('Maintenance mode', 'Platform', on ? 'Enabled maintenance mode' : 'Disabled maintenance mode') }, [logAction])
  const setRgLimit = useCallback((userId, patch) => { setRgPlayers((l) => l.map((r) => (r.userId === userId ? { ...r, ...patch } : r))); logAction('Updated player limits', 'Platform', `Updated limits for ${getUser(userId)?.avatarName || userId}`) }, [getUser, logAction])

  // Derived
  const recentCredits = useMemo(() => transactions.filter((t) => t.type === 'Admin Credit').slice(0, 8), [transactions])
  const players = useMemo(() => users.filter((u) => u.role === 'player'), [users])

  const value = {
    users, players, transactions, cashoutRequests, slotGames, tableGames, tournaments, activity,
    promotions, agents, bookings, staff, auditLog, promoCodes, announcements, tickets, contentBlocks,
    faqs: admin.faqs, settings, cashoutRules, rgPlayers, lcPackages: admin.lcPackages, segments: admin.segments,
    roleDefs: admin.roleDefs, permissionCatalog: admin.permissionCatalog, rolePermissions: admin.rolePermissions,
    recentCredits,
    getUser, balanceOf, userTransactions,
    creditLc, deductLc, reverseTransaction,
    requestCashout, setCashoutStatus, updateCashoutRules,
    setUserStatus, setUserTier, updateUser, addMember,
    setSlotStatus, setTableStatus, setTournamentStatus, updateGame, addSlotGame, createTournament,
    createPromotion, removePromotion, createPromoCode, setPromoCodeStatus, createAnnouncement, updateContent, toggleContent,
    replyTicket, setTicketStatus, updateBooking, setAgentStatus, addAgent,
    setStaffRole, setStaffStatus, addStaff, updateSettings, toggleFeature, setMaintenance, setRgLimit,
    logAction,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within a DataProvider')
  return ctx
}
