import { useState, useEffect, useMemo, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import CommandPalette from '@/components/ui/CommandPalette'
import PageLoader from '@/components/ui/PageLoader'

// Shared shell for the player and management areas: a sidebar that becomes a drawer
// on small screens, a sticky topbar, and the routed content. The management area also
// gets a command palette on Control or Command plus K.
export default function AppShell({ items, groups, variant = 'player' }) {
  const [drawer, setDrawer] = useState(false)
  const [palette, setPalette] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const paletteItems = useMemo(() => {
    const source = groups ? groups.flatMap((g) => g.items.map((it) => ({ ...it, group: g.title }))) : items || []
    return source.map((it) => ({ label: it.label, to: it.to, icon: it.icon, group: it.group }))
  }, [groups, items])

  return (
    <div className="relative min-h-dvh lg:flex">
      <Sidebar items={items} groups={groups} variant={variant} drawer={drawer} onClose={() => setDrawer(false)} />
      <div className="flex min-h-dvh flex-1 flex-col">
        <Topbar
          variant={variant}
          onMenu={() => setDrawer(true)}
          onCommand={variant === 'admin' ? () => setPalette(true) : undefined}
        />
        <main className="relative z-[2] flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <CommandPalette open={palette} onClose={() => setPalette(false)} items={paletteItems} />
    </div>
  )
}
