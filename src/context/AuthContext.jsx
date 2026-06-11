import { createContext, useContext, useCallback, useState } from 'react'
import { users, currentPlayer } from '@/data/mockData'
import { safeGet, safeSet, safeRemove } from '@/lib/storage'

// Session holds who is signed in for this visit. Financial figures come from the
// data store, keyed by userId, so balances stay live across the club screens.

const AuthContext = createContext(null)
const STORAGE_KEY = 'lcc.session'

const playerUser =
  users.find((u) => u.id === currentPlayer.id) || users.find((u) => u.role === 'player')
const adminUser = users.find((u) => u.role === 'admin')

function sessionFromUser(u) {
  if (!u) return null
  return {
    role: u.role,
    userId: u.id,
    avatarName: u.avatarName,
    username: u.username,
    tier: u.tier,
    resortLocation: u.resortLocation,
  }
}

// A seeded player session so the club lounge is open on first visit.
const defaultSession = sessionFromUser(playerUser)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => safeGet(STORAGE_KEY) ?? defaultSession)

  const login = useCallback((role = 'player') => {
    const target = role === 'admin' ? adminUser : playerUser
    const next = sessionFromUser(target)
    setSession(next)
    safeSet(STORAGE_KEY, next)
    return next
  }, [])

  // New memberships open against the seeded club profile so every player screen is
  // populated, while keeping the guest chosen display name for a personal welcome.
  const register = useCallback((form = {}) => {
    const base = sessionFromUser(playerUser)
    const next = {
      ...base,
      ...(form.avatarName ? { avatarName: form.avatarName } : {}),
      ...(form.username ? { username: form.username } : {}),
      ...(form.resortLocation ? { resortLocation: form.resortLocation } : {}),
    }
    setSession(next)
    safeSet(STORAGE_KEY, next)
    return next
  }, [])

  const logout = useCallback(() => {
    setSession(null)
    safeRemove(STORAGE_KEY)
  }, [])

  const value = {
    session,
    isAuthed: Boolean(session),
    isPlayer: session?.role === 'player',
    isAdmin: session?.role === 'admin',
    userId: session?.userId ?? null,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
