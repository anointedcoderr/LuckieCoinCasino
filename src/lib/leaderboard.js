// Leaderboard tab definitions. Each tab decides the sort metric and the highlighted
// stat column, so the same row data drives every view.

export const leaderboardTabs = [
  { key: 'overall', label: 'Overall', metric: 'lcWon', metricLabel: 'LC Won' },
  { key: 'poker', label: 'Poker', metric: 'tournamentsWon', metricLabel: 'Tournaments Won' },
  { key: 'slots', label: 'Slots', metric: 'slotWins', metricLabel: 'Slot Wins' },
  { key: 'blackjack', label: 'Blackjack', metric: 'blackjackWins', metricLabel: 'Blackjack Wins' },
  { key: 'baccarat', label: 'Baccarat', metric: 'baccaratWins', metricLabel: 'Baccarat Wins' },
  { key: 'weekly', label: 'Weekly', metric: 'lcWon', metricLabel: 'LC Won', period: 'weekly' },
  { key: 'monthly', label: 'Monthly', metric: 'lcWon', metricLabel: 'LC Won', period: 'monthly' },
]

export function getTab(key) {
  return leaderboardTabs.find((t) => t.key === key) || leaderboardTabs[0]
}

export function sortByTab(rows = [], key = 'overall') {
  const tab = getTab(key)
  let list = rows.slice()
  if (tab.period) {
    list = list.filter((row) => row.periodFlags && row.periodFlags[tab.period])
  }
  list.sort((a, b) => (b[tab.metric] || 0) - (a[tab.metric] || 0))
  return list.map((row, index) => ({ ...row, displayRank: index + 1 }))
}
