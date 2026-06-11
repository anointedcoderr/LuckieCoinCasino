// Safe localStorage wrappers. Every read and write is guarded so the club still works
// when storage is unavailable (private windows, blocked storage, server render).

export function safeGet(key) {
  try {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function safeSet(key, value) {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore write failures, the session falls back to seeded data.
  }
}

export function safeRemove(key) {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(key)
  } catch {
    // Ignore removal failures.
  }
}
