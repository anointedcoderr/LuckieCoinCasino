import { useState, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Search, CornerDownLeft } from 'lucide-react'
import cx from '@/lib/cx'

// Fast keyboard jump for management. Filters destinations and quick actions.
export default function CommandPalette({ open, onClose, items = [] }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter((it) => `${it.label} ${it.hint || ''} ${it.group || ''}`.toLowerCase().includes(s))
  }, [q, items])

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      const t = setTimeout(() => inputRef.current?.focus(), 20)
      return () => clearTimeout(t)
    }
    return undefined
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [q])

  if (!open) return null

  const run = (it) => {
    onClose?.()
    if (it.to) navigate(it.to)
    else it.onSelect?.()
  }

  const onKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[active]) run(filtered[active])
    } else if (e.key === 'Escape') {
      onClose?.()
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center p-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="absolute inset-0 bg-deep/75 backdrop-blur-sm" onClick={onClose} />
      <div
        className="glass-dark relative w-full max-w-lg overflow-hidden rounded-2xl border border-primary/25 shadow-card"
        style={{ animation: 'coin-fadein 0.2s ease-out both' }}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <Search className="h-4 w-4 text-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search modules and actions"
            className="w-full bg-transparent py-3.5 text-sm text-ink placeholder:text-muted focus:outline-none"
          />
          <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No matches</li>}
          {filtered.map((it, i) => {
            const Icon = it.icon
            return (
              <li key={`${it.label}-${i}`}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => run(it)}
                  className={cx(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',
                    i === active ? 'bg-primary/15 text-ink' : 'text-muted hover:text-ink',
                  )}
                >
                  {Icon && <Icon className="h-4 w-4 text-primary" />}
                  <span className="flex-1">
                    {it.label}
                    {it.group && <span className="ml-2 text-[11px] text-muted">{it.group}</span>}
                  </span>
                  {i === active && <CornerDownLeft className="h-3.5 w-3.5 text-muted" />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>,
    document.body,
  )
}
