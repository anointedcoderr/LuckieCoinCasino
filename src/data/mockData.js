// Single source of truth for the LuckieCoinCasino club experience.
// All figures are kept internally consistent: a player balance equals the running
// sum of that player transactions, leaderboard metrics match per player totals, and
// the club metrics aggregate the lists below. These values seed the club for the session.

export const currentPlayer = {
  id: 'p-001',
  avatarName: 'Aurelia Quinn',
  username: 'aurelia.quinn',
  avatarImg: null,
  lcBalance: 8450,
  bonusLc: 1200,
  rank: 3,
  rankMovement: 2,
  tier: 'Gold Club',
  joinedAt: '2026-02-14',
  resortLocation: 'Hawaii Sunset Resort, Sim 4',
  resortBadge: 'Gold Resort Guest',
}

export const users = [
  {
    id: 'p-001',
    avatarName: 'Aurelia Quinn',
    username: 'aurelia.quinn',
    email: 'aurelia.quinn@resortguest.club',
    role: 'player',
    lcBalance: 8450,
    bonusLc: 1200,
    rank: 3,
    tier: 'Gold Club',
    joinedAt: '2026-02-14',
    lastActive: '2026-06-11T09:48:00',
    status: 'Active',
    resortLocation: 'Hawaii Sunset Resort, Sim 4',
  },
  {
    id: 'p-014',
    avatarName: 'Maximilian Roe',
    username: 'max.roe',
    email: 'max.roe@resortguest.club',
    role: 'player',
    lcBalance: 21600,
    bonusLc: 2000,
    rank: 1,
    tier: 'Platinum Club',
    joinedAt: '2026-01-09',
    lastActive: '2026-06-11T08:40:00',
    status: 'Active',
    resortLocation: 'VIP Skydeck, Sim 1',
  },
  {
    id: 'p-027',
    avatarName: 'Seraphina Lux',
    username: 'sera.lux',
    email: 'sera.lux@resortguest.club',
    role: 'player',
    lcBalance: 9400,
    bonusLc: 800,
    rank: 2,
    tier: 'Gold Club',
    joinedAt: '2026-03-01',
    lastActive: '2026-06-10T23:55:00',
    status: 'Active',
    resortLocation: 'Ocean Lounge, Sim 2',
  },
  {
    id: 'p-039',
    avatarName: 'Dorian Vale',
    username: 'dorian.vale',
    email: 'dorian.vale@resortguest.club',
    role: 'player',
    lcBalance: 3120,
    bonusLc: 600,
    rank: 6,
    tier: 'Silver Club',
    joinedAt: '2026-04-22',
    lastActive: '2026-06-09T19:10:00',
    status: 'Suspended',
    resortLocation: 'Garden Pavilion, Sim 3',
  },
  {
    id: 'adm-1',
    avatarName: 'Vivienne Hart',
    username: 'vivienne.hart',
    email: 'vivienne.hart@resort.management',
    role: 'admin',
    lcBalance: 0,
    bonusLc: 0,
    rank: null,
    tier: 'Club Management',
    joinedAt: '2026-01-02',
    lastActive: '2026-06-11T09:55:00',
    status: 'Active',
    resortLocation: 'Resort Operations',
  },
]

// Transaction types are exactly: Admin Credit, Tournament Buy-in, Slot Game Play,
// Poker Win, Cashout Request, Booking Bonus. Amounts are signed (credits positive).
export const lcTransactions = [
  // Aurelia Quinn, p-001, runs to 8450
  { id: 'tx-101', userId: 'p-001', type: 'Booking Bonus', amount: 1200, balanceAfter: 1200, ref: 'BK-3391', note: 'Hawaii Sunset Resort booking bonus', createdAt: '2026-02-14T10:05:00' },
  { id: 'tx-102', userId: 'p-001', type: 'Admin Credit', amount: 6000, balanceAfter: 7200, ref: 'CR-0088', note: 'LC purchase verified by agent Lena Cole', createdAt: '2026-03-02T16:22:00' },
  { id: 'tx-103', userId: 'p-001', type: 'Slot Game Play', amount: -450, balanceAfter: 6750, ref: 'SL-Mayan', note: 'Mayan Temple Slot session', createdAt: '2026-03-10T20:14:00' },
  { id: 'tx-104', userId: 'p-001', type: 'Tournament Buy-in', amount: -500, balanceAfter: 6250, ref: 'PT-HRN', note: 'Hawaii Resort Night Poker buy in', createdAt: '2026-03-15T19:00:00' },
  { id: 'tx-105', userId: 'p-001', type: 'Poker Win', amount: 2700, balanceAfter: 8950, ref: 'PT-HRN', note: 'Hawaii Resort Night Poker payout', createdAt: '2026-03-15T23:40:00' },
  { id: 'tx-106', userId: 'p-001', type: 'Cashout Request', amount: -500, balanceAfter: 8450, ref: 'CO-2007', note: 'Cashout requested, handled in world', createdAt: '2026-04-01T12:30:00' },
  // Maximilian Roe, p-014, runs to 21600
  { id: 'tx-201', userId: 'p-014', type: 'Booking Bonus', amount: 2000, balanceAfter: 2000, ref: 'BK-3402', note: 'VIP Skydeck Suite booking bonus', createdAt: '2026-01-09T11:00:00' },
  { id: 'tx-202', userId: 'p-014', type: 'Admin Credit', amount: 18000, balanceAfter: 20000, ref: 'CR-0061', note: 'LC purchase verified by agent Theo Vance', createdAt: '2026-02-01T15:30:00' },
  { id: 'tx-203', userId: 'p-014', type: 'Poker Win', amount: 6000, balanceAfter: 26000, ref: 'PT-VIP', note: 'VIP Weekend Table payout', createdAt: '2026-02-22T23:10:00' },
  { id: 'tx-204', userId: 'p-014', type: 'Tournament Buy-in', amount: -2000, balanceAfter: 24000, ref: 'PT-VIP', note: 'VIP Weekend Table buy in', createdAt: '2026-02-22T20:00:00' },
  { id: 'tx-205', userId: 'p-014', type: 'Slot Game Play', amount: -2400, balanceAfter: 21600, ref: 'SL-Palms', note: 'Golden Palms slot session', createdAt: '2026-03-18T21:30:00' },
  // Seraphina Lux, p-027, runs to 9400
  { id: 'tx-301', userId: 'p-027', type: 'Booking Bonus', amount: 800, balanceAfter: 800, ref: 'BK-3415', note: 'Ocean Lounge Stay booking bonus', createdAt: '2026-03-01T09:20:00' },
  { id: 'tx-302', userId: 'p-027', type: 'Admin Credit', amount: 9000, balanceAfter: 9800, ref: 'CR-0093', note: 'LC purchase verified by agent Lena Cole', createdAt: '2026-03-20T14:05:00' },
  { id: 'tx-303', userId: 'p-027', type: 'Poker Win', amount: 4200, balanceAfter: 14000, ref: 'PT-CEL', note: 'Celebrity Roleplay Poker Night payout', createdAt: '2026-06-10T23:55:00' },
  { id: 'tx-304', userId: 'p-027', type: 'Slot Game Play', amount: -3400, balanceAfter: 10600, ref: 'SL-Ocean', note: 'Ocean Lucky Spin slot session', createdAt: '2026-05-28T18:40:00' },
  { id: 'tx-305', userId: 'p-027', type: 'Cashout Request', amount: -1200, balanceAfter: 9400, ref: 'CO-2009', note: 'Cashout paid through Ocean Lounge agent', createdAt: '2026-03-28T15:45:00' },
]

export const slotGames = [
  { id: 'sl-1', name: 'Mayan Temple Slot', theme: 'mayan', minLC: 50, popularity: 92, mobileReady: true, status: 'Active', type: 'Adventure Slot', reels: '5 reels, 25 lines', blurb: 'Unlock the golden temple and chase the jade jackpot.' },
  { id: 'sl-2', name: 'Resort Fortune', theme: 'fortune', minLC: 25, popularity: 78, mobileReady: true, status: 'Active', type: 'Classic Slot', reels: '3 reels, 5 lines', blurb: 'A warm classic for relaxed resort evenings.' },
  { id: 'sl-3', name: 'Golden Palms', theme: 'palms', minLC: 100, popularity: 85, mobileReady: false, status: 'New', type: 'Luxury Slot', reels: '5 reels, 40 lines', blurb: 'High roller reels under the champagne palms.' },
  { id: 'sl-4', name: 'Ocean Lucky Spin', theme: 'ocean', minLC: 40, popularity: 69, mobileReady: true, status: 'Active', type: 'Resort Slot', reels: '5 reels, 20 lines', blurb: 'Tide pools of LC washing across the reels.' },
]

export const tableGames = [
  { id: 'tg-1', name: 'Resort Blackjack', theme: 'blackjack', type: 'Blackjack', minLC: 50, maxLC: 5000, seats: 7, status: 'Live', mobileReady: true, blurb: 'Beat the resort dealer to twenty one at the velvet table.' },
  { id: 'tg-2', name: 'Sunset Baccarat', theme: 'baccarat', type: 'Baccarat', minLC: 100, maxLC: 10000, seats: 9, status: 'Live', mobileReady: true, blurb: 'Player or banker, the elegant sunset call.' },
]

export const pokerTournaments = [
  { id: 'pt-1', title: 'Hawaii Resort Night Poker', buyInLC: 500, prizePool: 12000, seats: { filled: 34, total: 50 }, startTime: '2026-06-11T21:00:00', status: 'Filling', tag: 'Signature Night' },
  { id: 'pt-2', title: 'VIP Weekend Table', buyInLC: 2000, prizePool: 40000, seats: { filled: 8, total: 10 }, startTime: '2026-06-13T20:00:00', status: 'Filling', tag: 'VIP Only' },
  { id: 'pt-3', title: 'Celebrity Roleplay Poker Night', buyInLC: 750, prizePool: 15000, seats: { filled: 50, total: 50 }, startTime: '2026-06-12T22:00:00', status: 'Live', tag: 'Live Now' },
  { id: 'pt-4', title: 'Resort Guest Freeroll', buyInLC: 0, prizePool: 3000, seats: { filled: 120, total: 200 }, startTime: '2026-06-14T18:00:00', status: 'Open', tag: 'Free Entry' },
  { id: 'pt-5', title: 'High Roller LC Table', buyInLC: 5000, prizePool: 120000, seats: { filled: 3, total: 8 }, startTime: '2026-06-15T23:00:00', status: 'Open', tag: 'High Roller' },
]

export const leaderboard = [
  { id: 'p-014', rank: 1, player: 'Maximilian Roe', avatarImg: null, lcPlayed: 84000, lcWon: 21600, tournamentsWon: 5, slotWins: 42, blackjackWins: 18, baccaratWins: 9, rankMovement: 0, resortBadge: 'Platinum Resort Guest', periodFlags: { weekly: true, monthly: true } },
  { id: 'p-027', rank: 2, player: 'Seraphina Lux', avatarImg: null, lcPlayed: 61000, lcWon: 15400, tournamentsWon: 3, slotWins: 55, blackjackWins: 12, baccaratWins: 14, rankMovement: 1, resortBadge: 'Gold Resort Guest', periodFlags: { weekly: true, monthly: true } },
  { id: 'p-001', rank: 3, player: 'Aurelia Quinn', avatarImg: null, lcPlayed: 48000, lcWon: 11900, tournamentsWon: 2, slotWins: 38, blackjackWins: 9, baccaratWins: 6, rankMovement: 2, resortBadge: 'Gold Resort Guest', periodFlags: { weekly: true, monthly: false } },
  { id: 'p-052', rank: 4, player: 'Cassius Wren', avatarImg: null, lcPlayed: 39500, lcWon: 9800, tournamentsWon: 1, slotWins: 27, blackjackWins: 21, baccaratWins: 4, rankMovement: -1, resortBadge: 'Gold Resort Guest', periodFlags: { weekly: true, monthly: true } },
  { id: 'p-066', rank: 5, player: 'Isolde Marsh', avatarImg: null, lcPlayed: 31200, lcWon: 7600, tournamentsWon: 2, slotWins: 19, blackjackWins: 7, baccaratWins: 17, rankMovement: 3, resortBadge: 'Silver Resort Guest', periodFlags: { weekly: false, monthly: true } },
  { id: 'p-039', rank: 6, player: 'Dorian Vale', avatarImg: null, lcPlayed: 24800, lcWon: 5200, tournamentsWon: 0, slotWins: 33, blackjackWins: 5, baccaratWins: 3, rankMovement: -2, resortBadge: 'Silver Resort Guest', periodFlags: { weekly: true, monthly: false } },
  { id: 'p-071', rank: 7, player: 'Beatrix Stone', avatarImg: null, lcPlayed: 19400, lcWon: 4100, tournamentsWon: 1, slotWins: 12, blackjackWins: 14, baccaratWins: 8, rankMovement: 1, resortBadge: 'Silver Resort Guest', periodFlags: { weekly: false, monthly: true } },
  { id: 'p-088', rank: 8, player: 'Lucian Reyes', avatarImg: null, lcPlayed: 15600, lcWon: 3300, tournamentsWon: 0, slotWins: 22, blackjackWins: 6, baccaratWins: 5, rankMovement: 0, resortBadge: 'Bronze Resort Guest', periodFlags: { weekly: true, monthly: true } },
]

export const cashoutRequests = [
  { id: 'CO-2007', userId: 'p-001', avatarName: 'Aurelia Quinn', amountLC: 500, resortLocation: 'Hawaii Sunset Resort, Sim 4', preferredTime: 'Evenings SLT', notes: 'Please page me in world before transfer.', status: 'Pending', requestedAt: '2026-04-01T12:30:00', handledBy: null },
  { id: 'CO-2008', userId: 'p-014', avatarName: 'Maximilian Roe', amountLC: 5000, resortLocation: 'VIP Skydeck, Sim 1', preferredTime: 'Weekend afternoons', notes: 'High roller payout, will confirm in world.', status: 'Approved', requestedAt: '2026-04-03T09:10:00', handledBy: 'Vivienne Hart' },
  { id: 'CO-2009', userId: 'p-027', avatarName: 'Seraphina Lux', amountLC: 1200, resortLocation: 'Ocean Lounge, Sim 2', preferredTime: 'Mornings SLT', notes: '', status: 'Paid', requestedAt: '2026-03-28T15:45:00', handledBy: 'Vivienne Hart' },
  { id: 'CO-2010', userId: 'p-066', avatarName: 'Isolde Marsh', amountLC: 900, resortLocation: 'Garden Pavilion, Sim 3', preferredTime: 'Late nights SLT', notes: 'First cashout, please verify avatar name.', status: 'Pending', requestedAt: '2026-06-10T22:05:00', handledBy: null },
]

export const casinoAgents = [
  { id: 'ag-1', avatarName: 'Lena Cole', role: 'Casino Agent', verifiedPayments: 148, activeSince: '2026-01-05', status: 'Online', contactInWorld: 'lena.cole', lastActive: '2026-06-11T09:30:00' },
  { id: 'ag-2', avatarName: 'Theo Vance', role: 'Casino Agent', verifiedPayments: 96, activeSince: '2026-02-20', status: 'Offline', contactInWorld: 'theo.vance', lastActive: '2026-06-10T20:15:00' },
  { id: 'ag-3', avatarName: 'Marisol Reign', role: 'Senior Agent', verifiedPayments: 213, activeSince: '2025-12-12', status: 'Online', contactInWorld: 'marisol.reign', lastActive: '2026-06-11T09:52:00' },
]

export const resortBookings = [
  { id: 'BK-3391', guest: 'Aurelia Quinn', bookingType: 'Sunset Villa Weekend', resortLocation: 'Hawaii Sunset Resort, Sim 4', bonusLc: 1200, status: 'Completed', bookedAt: '2026-02-14' },
  { id: 'BK-3402', guest: 'Maximilian Roe', bookingType: 'VIP Skydeck Suite', resortLocation: 'VIP Skydeck, Sim 1', bonusLc: 2000, status: 'Completed', bookedAt: '2026-01-09' },
  { id: 'BK-3415', guest: 'Seraphina Lux', bookingType: 'Ocean Lounge Stay', resortLocation: 'Ocean Lounge, Sim 2', bonusLc: 800, status: 'Confirmed', bookedAt: '2026-06-09' },
  { id: 'BK-3420', guest: 'Isolde Marsh', bookingType: 'Garden Pavilion Night', resortLocation: 'Garden Pavilion, Sim 3', bonusLc: 600, status: 'Pending', bookedAt: '2026-06-10' },
]

export const resortLocations = [
  'Hawaii Sunset Resort, Sim 4',
  'VIP Skydeck, Sim 1',
  'Ocean Lounge, Sim 2',
  'Garden Pavilion, Sim 3',
  'Celebrity Stage, Sim 5',
]

export const creditReasons = [
  'In-world payment verified',
  'Booking bonus',
  'Promotion bonus',
  'Manual adjustment',
  'Tournament prize',
  'Refund',
]

export const adminMetrics = {
  totalMembers: 312,
  activeMembers: 248,
  lcInCirculation: 1840000,
  pendingCashouts: 2,
  pendingCashoutLc: 1400,
  lcCreditedToday: 6000,
  bonusLcIssued: 4600,
  tournamentsLive: 1,
  topGame: 'Mayan Temple Slot',
  weeklyLcPlayed: [
    { day: 'Mon', lc: 120000 },
    { day: 'Tue', lc: 98000 },
    { day: 'Wed', lc: 143000 },
    { day: 'Thu', lc: 110000 },
    { day: 'Fri', lc: 188000 },
    { day: 'Sat', lc: 240000 },
    { day: 'Sun', lc: 205000 },
  ],
  lcByActivity: [
    { name: 'Slots', lc: 520000 },
    { name: 'Poker', lc: 610000 },
    { name: 'Blackjack', lc: 240000 },
    { name: 'Baccarat', lc: 180000 },
  ],
}

// Light weight per player series for the dashboard activity chart.
export const currentPlayerWeekly = [
  { day: 'Mon', lc: 640 },
  { day: 'Tue', lc: 980 },
  { day: 'Wed', lc: 420 },
  { day: 'Thu', lc: 1500 },
  { day: 'Fri', lc: 1120 },
  { day: 'Sat', lc: 2700 },
  { day: 'Sun', lc: 1340 },
]

export const recentActivity = [
  { id: 'ac-1', type: 'Admin Credit', actor: 'Vivienne Hart', detail: 'Credited Aurelia Quinn after agent verification', amountLC: 6000, at: '2026-06-11T09:12:00' },
  { id: 'ac-2', type: 'Cashout Request', actor: 'Maximilian Roe', detail: 'Requested cashout, pending review', amountLC: 5000, at: '2026-06-11T08:40:00' },
  { id: 'ac-3', type: 'Poker Win', actor: 'Seraphina Lux', detail: 'Won Celebrity Roleplay Poker Night', amountLC: 4200, at: '2026-06-10T23:55:00' },
  { id: 'ac-4', type: 'Booking Bonus', actor: 'Isolde Marsh', detail: 'Garden Pavilion Night booking bonus issued', amountLC: 600, at: '2026-06-10T14:00:00' },
  { id: 'ac-5', type: 'Slot Game Play', actor: 'Cassius Wren', detail: 'Mayan Temple Slot session', amountLC: 800, at: '2026-06-10T11:32:00' },
]

export const promotions = [
  { id: 'promo-1', title: 'First Stay Bonus', detail: 'Book your first resort stay and receive bonus LuckieCoin on arrival.', bonusLc: 1000, tag: 'New Guests' },
  { id: 'promo-2', title: 'Weekend High Roller', detail: 'Extra LC matched on verified purchases every resort weekend.', bonusLc: 2500, tag: 'Weekend' },
  { id: 'promo-3', title: 'Leaderboard Champion', detail: 'Top the weekly leaderboard for a champagne gold LC reward.', bonusLc: 5000, tag: 'Competition' },
]

export const howItWorksSteps = [
  { step: 1, title: 'Join the Casino Club', detail: 'Resort guests join the club and unlock the LuckieCoin lounge.' },
  { step: 2, title: 'Book a stay for bonus LC', detail: 'Every resort booking adds bonus LuckieCoin to your club balance.' },
  { step: 3, title: 'Buy more LC in world', detail: 'A casino agent verifies your in world payment and management credits your LC.' },
  { step: 4, title: 'Play, win, and cash out', detail: 'Play the games, climb the leaderboard, and request cashout handled by the resort team.' },
]
