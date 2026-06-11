import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import cx from '@/lib/cx'

// Right side detail and edit panel. Keeps the admin in context of the list behind it.
export default function SlideOver({ open, onClose, title, subtitle, footer, width = 'max-w-md', children }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[95]" role="dialog" aria-modal="true" aria-label={title || 'Panel'}>
      <div className="absolute inset-0 bg-deep/70 backdrop-blur-sm" onClick={onClose} />
      <aside
        className={cx(
          'glass-dark absolute right-0 top-0 flex h-full w-full flex-col border-l border-primary/20 shadow-card',
          width,
        )}
        style={{ animation: 'slide-in 0.3s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-muted transition hover:text-ink" aria-label="Close panel">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 p-5">{footer}</div>}
      </aside>
    </div>,
    document.body,
  )
}
