import { useMemo, useState } from 'react'
import { Search, History } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { relativeTime } from '@/lib/format'
import AdminPageHeader from '@/components/ui/AdminPageHeader'
import Tabs from '@/components/ui/Tabs'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'

// The known management modules, in the order the spec calls for. We intersect
// with the modules actually present in the log so empty filters never appear.
const MODULE_ORDER = ['Platform', 'Economy', 'Cashouts', 'Members', 'Games', 'Marketing', 'Operations']

// Each module gets a Badge tone so the timeline reads at a glance.
const moduleTone = {
  Platform: 'purple',
  Economy: 'gold',
  Cashouts: 'emerald',
  Members: 'gold',
  Games: 'emerald',
  Marketing: 'purple',
  Operations: 'neutral',
}

export default function AdminAudit() {
  const data = useData()
  const log = data.auditLog
  const [module, setModule] = useState('all')
  const [query, setQuery] = useState('')

  // Distinct modules that exist in the log, kept in the spec order.
  const modules = useMemo(() => {
    const present = new Set(log.map((e) => e.module))
    return MODULE_ORDER.filter((m) => present.has(m))
  }, [log])

  const tabs = useMemo(
    () => [
      { key: 'all', label: 'All', count: log.length },
      ...modules.map((m) => ({ key: m, label: m, count: log.filter((e) => e.module === m).length })),
    ],
    [log, modules],
  )

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase()
    return log.filter((e) => {
      if (module !== 'all' && e.module !== module) return false
      if (!q) return true
      return (
        e.actor.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        e.detail.toLowerCase().includes(q)
      )
    })
  }, [log, module, query])

  return (
    <div className="space-y-6">
      <AdminPageHeader description="A running record of every management action across the resort, newest first. Filter by area or search by name, action, or detail." />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs tabs={tabs} value={module} onChange={setModule} className="flex-wrap" />
        <div className="relative w-full lg:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={2} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search actor, action, or detail"
            aria-label="Search the audit log"
            className="w-full rounded-xl border border-white/10 bg-surface-2/70 py-3 pl-10 pr-4 text-sm text-ink placeholder:text-muted transition focus:border-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={History}
          title="No entries match"
          message="Try a different area or clear the search to see the full record again."
        />
      ) : (
        <div className="glass rounded-3xl border border-white/10 p-6 shadow-card sm:p-8">
          <ol className="relative space-y-7 border-l border-white/10 pl-6 sm:pl-8">
            {entries.map((entry) => (
              <li key={entry.id} className="relative">
                <span
                  className="absolute -left-[1.6rem] top-1.5 h-3 w-3 rounded-full bg-gold-sheen shadow-coin-soft ring-4 ring-surface sm:-left-[2.1rem]"
                  aria-hidden="true"
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <p className="font-display text-base font-semibold text-ink">{entry.action}</p>
                      <Badge tone={moduleTone[entry.module] || 'neutral'}>{entry.module}</Badge>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{entry.detail}</p>
                  </div>
                  <p className="shrink-0 font-mono text-xs text-muted sm:text-right">
                    <span className="text-accent">{entry.actor}</span>
                    <span className="mx-1.5 text-muted/60">.</span>
                    {relativeTime(entry.at)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
