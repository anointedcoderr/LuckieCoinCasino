import { useMemo, useState } from 'react'
import { Trophy, RotateCcw, Star, Gauge } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { leaderboard } from '@/data/mockData'
import { leaderboardTabs, sortByTab, getTab } from '@/lib/leaderboard'
import AdminPageHeader from '@/components/ui/AdminPageHeader'
import Tabs from '@/components/ui/Tabs'
import Button from '@/components/ui/Button'
import LeaderboardTable from '@/components/ui/LeaderboardTable'

// Leaderboard management. The same standings power every player facing board, so the
// tabs here mirror the live views and the reset actions are recorded to the audit log.
export default function AdminLeaderboard() {
  const data = useData()
  const { push } = useToast()
  const [tab, setTab] = useState('overall')

  const cfg = getTab(tab)
  const rows = useMemo(() => sortByTab(leaderboard, tab), [tab])
  const topPlayer = rows[0]?.player

  const resetBoard = (period) => {
    const detail = `Cleared the ${period} standings and started a fresh cycle`
    data.logAction('Reset leaderboard', 'Games', detail)
    push({
      tone: 'success',
      title: `${period === 'weekly' ? 'Weekly' : 'Monthly'} board reset`,
      message: `The ${period} standings have been cleared for the new cycle.`,
    })
  }

  const featureTop = () => {
    if (!topPlayer) {
      push({ tone: 'info', title: 'No standings yet', message: 'There is no top player to feature on this board.' })
      return
    }
    data.logAction('Featured leaderboard player', 'Games', `Featured ${topPlayer} on the ${cfg.label} board`)
    push({
      tone: 'success',
      title: 'Player featured',
      message: `${topPlayer} is now spotlighted on the ${cfg.label} board.`,
    })
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        description="Review the resort standings, refresh the weekly and monthly cycles, and spotlight the player leading each board."
        actions={
          <>
            <Button variant="secondary" size="sm" icon={RotateCcw} onClick={() => resetBoard('weekly')}>
              Reset weekly
            </Button>
            <Button variant="secondary" size="sm" icon={RotateCcw} onClick={() => resetBoard('monthly')}>
              Reset monthly
            </Button>
            <Button variant="primary" size="sm" icon={Star} onClick={featureTop}>
              Feature top player
            </Button>
          </>
        }
      />

      <div className="glass flex items-start gap-4 rounded-3xl border border-white/10 p-5 shadow-card">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Gauge className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Scoring metric</p>
          <p className="mt-1 text-sm leading-relaxed text-ink">
            The <span className="font-medium text-primary">{cfg.label}</span> board ranks members by{' '}
            <span className="font-medium text-accent-2-light">{cfg.metricLabel}</span>
            {cfg.period
              ? `, limited to play within the current ${cfg.period} cycle.`
              : ', drawn from their full resort history.'}
          </p>
        </div>
      </div>

      <Tabs tabs={leaderboardTabs} value={tab} onChange={setTab} />

      <LeaderboardTable rows={rows} tab={tab} />

      <div className="flex items-center gap-2 text-xs text-muted">
        <Trophy className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
        <span className="font-mono uppercase tracking-wider">
          {rows.length} {rows.length === 1 ? 'player' : 'players'} on the {cfg.label} board
        </span>
      </div>
    </div>
  )
}
