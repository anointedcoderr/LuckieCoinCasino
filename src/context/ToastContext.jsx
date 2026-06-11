import { createContext, useContext, useCallback, useRef, useState } from 'react'
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react'
import cx from '@/lib/cx'

const ToastContext = createContext(null)
let idSeq = 0

const toneStyles = {
  success: { icon: CheckCircle2, ring: 'border-accent/45', dot: 'text-accent' },
  error: { icon: XCircle, ring: 'border-danger/50', dot: 'text-danger' },
  warn: { icon: AlertTriangle, ring: 'border-warn/50', dot: 'text-warn' },
  info: { icon: Info, ring: 'border-primary/45', dot: 'text-primary' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const push = useCallback(
    (toast) => {
      const id = ++idSeq
      const item = { id, tone: 'info', duration: 3800, ...toast }
      setToasts((list) => [...list, item])
      timers.current[id] = setTimeout(() => dismiss(id), item.duration)
      return id
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ push, dismiss }}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-3"
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => {
          const cfg = toneStyles[t.tone] || toneStyles.info
          const Icon = cfg.icon
          return (
            <div
              key={t.id}
              className={cx('glass-dark pointer-events-auto rounded-2xl border px-4 py-3 shadow-card', cfg.ring)}
              style={{ animation: 'coin-fadein 0.3s ease-out both' }}
            >
              <div className="flex items-start gap-3">
                <Icon className={cx('mt-0.5 h-5 w-5 shrink-0', cfg.dot)} strokeWidth={2.2} />
                <div className="min-w-0 flex-1">
                  {t.title && <p className="font-display text-sm font-semibold text-ink">{t.title}</p>}
                  {t.message && <p className="mt-0.5 text-sm leading-relaxed text-muted">{t.message}</p>}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-muted transition hover:text-ink"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) return { push: () => {}, dismiss: () => {} }
  return ctx
}
