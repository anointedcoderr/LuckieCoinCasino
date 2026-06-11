// LC math helpers. Balances are always derived from the transaction list so seeded
// data and runtime changes within a session stay consistent.

export function deriveBalance(transactions = []) {
  return transactions.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0)
}

export function sumByType(transactions = [], type) {
  return transactions
    .filter((tx) => tx.type === type)
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0)
}

export function totalCredited(transactions = []) {
  return transactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0)
}

export function totalSpent(transactions = []) {
  return transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
}

export function transactionsForUser(transactions = [], userId) {
  return transactions
    .filter((tx) => tx.userId === userId)
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
