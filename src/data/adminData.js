// Admin side seed data: staff, roles and permissions, audit log, promotions,
// announcements, support, content, settings, and responsible gaming. These seed the
// management control center for the session.

export const roleDefs = [
  { key: 'super', label: 'Super Admin', desc: 'Full control over every module and setting.' },
  { key: 'manager', label: 'Manager', desc: 'Day to day club operations and games.' },
  { key: 'finance', label: 'Finance', desc: 'Credits, cashouts, and reports.' },
  { key: 'agent', label: 'Casino Agent', desc: 'Verify in world payments and assist guests.' },
  { key: 'support', label: 'Support', desc: 'Member support and tickets.' },
]

// Permission keys grouped by module. The super role holds every permission.
export const permissionCatalog = [
  { module: 'Members', keys: ['members.view', 'members.edit', 'members.suspend'] },
  { module: 'Economy', keys: ['economy.credit', 'economy.deduct', 'economy.reverse'] },
  { module: 'Cashouts', keys: ['cashouts.view', 'cashouts.approve', 'cashouts.rules'] },
  { module: 'Games', keys: ['games.manage', 'tournaments.manage', 'leaderboard.manage'] },
  { module: 'Marketing', keys: ['promotions.manage', 'content.manage', 'comms.send'] },
  { module: 'Operations', keys: ['bookings.manage', 'agents.manage', 'support.handle'] },
  { module: 'Platform', keys: ['staff.manage', 'settings.manage', 'audit.view', 'responsible.manage'] },
]

const allKeys = permissionCatalog.flatMap((g) => g.keys)

export const rolePermissions = {
  super: allKeys,
  manager: [
    'members.view',
    'members.edit',
    'cashouts.view',
    'games.manage',
    'tournaments.manage',
    'leaderboard.manage',
    'promotions.manage',
    'content.manage',
    'bookings.manage',
    'agents.manage',
    'support.handle',
  ],
  finance: ['members.view', 'economy.credit', 'economy.deduct', 'economy.reverse', 'cashouts.view', 'cashouts.approve', 'cashouts.rules', 'audit.view'],
  agent: ['members.view', 'economy.credit', 'cashouts.view', 'bookings.manage'],
  support: ['members.view', 'support.handle', 'comms.send'],
}

export const staff = [
  { id: 'st-1', name: 'Vivienne Hart', username: 'vivienne.hart', email: 'vivienne.hart@resort.management', role: 'super', status: 'Active', lastActive: '2026-06-11T09:55:00' },
  { id: 'st-2', name: 'Marcus Vane', username: 'marcus.vane', email: 'marcus.vane@resort.management', role: 'finance', status: 'Active', lastActive: '2026-06-11T08:30:00' },
  { id: 'st-3', name: 'Lena Cole', username: 'lena.cole', email: 'lena.cole@resort.management', role: 'agent', status: 'Active', lastActive: '2026-06-11T09:30:00' },
  { id: 'st-4', name: 'Priya Anand', username: 'priya.anand', email: 'priya.anand@resort.management', role: 'support', status: 'Active', lastActive: '2026-06-10T21:14:00' },
  { id: 'st-5', name: 'Tobias Frost', username: 'tobias.frost', email: 'tobias.frost@resort.management', role: 'manager', status: 'Suspended', lastActive: '2026-05-30T12:00:00' },
]

export const auditLog = [
  { id: 'au-1', at: '2026-06-11T09:55:00', actor: 'Vivienne Hart', action: 'Logged in', module: 'Platform', detail: 'Management session started' },
  { id: 'au-2', at: '2026-06-11T09:12:00', actor: 'Vivienne Hart', action: 'Credited LC', module: 'Economy', detail: 'Credited 6,000 LC to Aurelia Quinn' },
  { id: 'au-3', at: '2026-06-11T08:42:00', actor: 'Marcus Vane', action: 'Approved cashout', module: 'Cashouts', detail: 'Approved CO-2008 for Maximilian Roe' },
  { id: 'au-4', at: '2026-06-10T20:05:00', actor: 'Tobias Frost', action: 'Disabled game', module: 'Games', detail: 'Set Golden Palms to Maintenance' },
  { id: 'au-5', at: '2026-06-10T18:30:00', actor: 'Priya Anand', action: 'Resolved ticket', module: 'Operations', detail: 'Closed ticket TK-1042' },
  { id: 'au-6', at: '2026-06-10T14:00:00', actor: 'Vivienne Hart', action: 'Issued booking bonus', module: 'Operations', detail: 'Allocated 600 LC to Isolde Marsh' },
]

export const promoCodes = [
  { id: 'pc-1', code: 'RESORTGOLD', bonusLc: 1000, uses: 42, maxUses: 200, status: 'Active', expiresAt: '2026-07-31' },
  { id: 'pc-2', code: 'WEEKENDVIP', bonusLc: 2500, uses: 18, maxUses: 50, status: 'Active', expiresAt: '2026-06-30' },
  { id: 'pc-3', code: 'WELCOME500', bonusLc: 500, uses: 310, maxUses: 1000, status: 'Active', expiresAt: '2026-12-31' },
  { id: 'pc-4', code: 'SUMMER24', bonusLc: 750, uses: 90, maxUses: 90, status: 'Expired', expiresAt: '2026-03-01' },
]

export const announcements = [
  { id: 'an-1', title: 'Celebrity Roleplay Poker Night is live', body: 'Take your seat tonight at the Celebrity Stage. Doors open at 22:00 SLT.', audience: 'All members', status: 'Sent', sentAt: '2026-06-10T18:00:00' },
  { id: 'an-2', title: 'Double booking bonus weekend', body: 'Every resort stay booked this weekend earns double bonus LuckieCoin.', audience: 'Gold and above', status: 'Sent', sentAt: '2026-06-08T10:00:00' },
  { id: 'an-3', title: 'High Roller LC Table opens Monday', body: 'A new eight seat high roller table joins the poker room.', audience: 'High rollers', status: 'Scheduled', sentAt: '2026-06-15T09:00:00' },
]

export const supportTickets = [
  { id: 'TK-1051', subject: 'Cashout timing question', member: 'Aurelia Quinn', status: 'Open', priority: 'Normal', createdAt: '2026-06-11T07:20:00', lastReply: 'Aurelia Quinn', messages: [{ from: 'Aurelia Quinn', text: 'How long does a cashout usually take to reach me in world?', at: '2026-06-11T07:20:00' }] },
  { id: 'TK-1049', subject: 'Bonus LC not showing', member: 'Isolde Marsh', status: 'Pending', priority: 'High', createdAt: '2026-06-10T22:40:00', lastReply: 'Priya Anand', messages: [{ from: 'Isolde Marsh', text: 'My Garden Pavilion booking bonus has not appeared yet.', at: '2026-06-10T22:40:00' }, { from: 'Priya Anand', text: 'Thank you, I am checking with the agent now.', at: '2026-06-10T23:05:00' }] },
  { id: 'TK-1042', subject: 'Slot froze mid spin', member: 'Cassius Wren', status: 'Resolved', priority: 'Normal', createdAt: '2026-06-09T15:10:00', lastReply: 'Priya Anand', messages: [{ from: 'Cassius Wren', text: 'Mayan Temple Slot froze on a spin.', at: '2026-06-09T15:10:00' }, { from: 'Priya Anand', text: 'Resolved, your LC was returned. Apologies for the pause.', at: '2026-06-09T16:30:00' }] },
]

export const contentBlocks = [
  { id: 'hero-title', label: 'Home hero headline', value: 'Your Resort Casino Club Experience', type: 'text' },
  { id: 'hero-sub', label: 'Home hero subheadline', value: 'where your resort stay turns into a VIP casino night', type: 'text' },
  { id: 'cta-band', label: 'Closing call to action', value: 'Your stay just got luckier', type: 'text' },
  { id: 'promo-banner', label: 'Promo banner', value: 'Double booking bonus this weekend across every resort location.', type: 'banner', enabled: true },
]

export const faqs = [
  { id: 'faq-1', q: 'How do I receive bonus LuckieCoin?', a: 'Every resort booking adds bonus LC to your club balance once your stay is confirmed.' },
  { id: 'faq-2', q: 'How do I buy more LC?', a: 'Contact a casino agent in world, pay with the approved currency, and management credits your balance once the agent verifies it.' },
  { id: 'faq-3', q: 'How does cashout work?', a: 'Request a cashout from your wallet and the resort team arranges your payout through the in world process.' },
]

export const siteSettings = {
  general: {
    siteName: 'LuckieCoinCasino',
    tagline: 'Your Resort Casino Club Experience',
    contactEmail: 'anointedcoder@gmail.com',
    community: 'Resort guest community of over 1000 members',
  },
  branding: { primary: '#D4AF37', accent: '#1F8A5B', accent2: '#5B2A86' },
  currency: { name: 'LuckieCoin', symbol: 'LC', decimals: 0 },
  features: { slots: true, poker: true, blackjack: true, baccarat: true, leaderboard: true, promotions: true },
  maintenanceMode: false,
}

export const cashoutRules = {
  minLC: 200,
  maxLC: 50000,
  cooldownHours: 24,
  dailyLimitLC: 20000,
  feePct: 0,
}

export const lcPackages = [
  { id: 'lp-1', lc: 1000, note: 'Starter buy in' },
  { id: 'lp-2', lc: 5000, note: 'Resort guest favorite' },
  { id: 'lp-3', lc: 20000, note: 'High roller' },
]

export const segments = ['All members', 'Gold and above', 'Platinum', 'New this month', 'High rollers']

export const rgDefaults = { dailyLossLimitLC: 5000, sessionMinutes: 120, dailyPlayLimitLC: 10000 }

export const rgPlayers = [
  { userId: 'p-001', dailyLossLimitLC: 3000, sessionMinutes: 120, selfExcludedUntil: null, status: 'Active' },
  { userId: 'p-014', dailyLossLimitLC: 10000, sessionMinutes: 240, selfExcludedUntil: null, status: 'Active' },
  { userId: 'p-039', dailyLossLimitLC: 1000, sessionMinutes: 60, selfExcludedUntil: '2026-07-01', status: 'Cooling off' },
]
