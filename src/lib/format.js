// Formatting helpers shared across the club. LC figures always render with grouping
// so balances and stats line up in tabular columns.

export function formatNumber(value) {
  const n = Number(value) || 0
  return n.toLocaleString('en-US')
}

export function formatLC(value, { showCode = true, signed = false } = {}) {
  const n = Number(value) || 0
  const abs = Math.abs(n).toLocaleString('en-US')
  let sign = ''
  if (signed) sign = n > 0 ? '+' : n < 0 ? '-' : ''
  else if (n < 0) sign = '-'
  return `${sign}${abs}${showCode ? ' LC' : ''}`
}

export function formatDateTime(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function relativeTime(value) {
  if (!value) return ''
  const d = new Date(value).getTime()
  const now = new Date('2026-06-11T10:00:00').getTime()
  const diff = Math.round((d - now) / 1000)
  const abs = Math.abs(diff)
  const fmt = (n, unit) => `${n} ${unit}${n === 1 ? '' : 's'} ${diff < 0 ? 'ago' : 'from now'}`
  if (abs < 60) return 'just now'
  if (abs < 3600) return fmt(Math.round(abs / 60), 'minute')
  if (abs < 86400) return fmt(Math.round(abs / 3600), 'hour')
  return fmt(Math.round(abs / 86400), 'day')
}

// Returns a friendly countdown label from the seeded current moment to a start time.
export function timeUntil(value) {
  if (!value) return ''
  const target = new Date(value).getTime()
  const now = new Date('2026-06-11T10:00:00').getTime()
  let diff = Math.round((target - now) / 1000)
  if (diff <= 0) return 'In play now'
  const days = Math.floor(diff / 86400)
  diff -= days * 86400
  const hours = Math.floor(diff / 3600)
  diff -= hours * 3600
  const minutes = Math.floor(diff / 60)
  if (days > 0) return `Starts in ${days}d ${hours}h`
  if (hours > 0) return `Starts in ${hours}h ${minutes}m`
  return `Starts in ${minutes}m`
}

export function initials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}
