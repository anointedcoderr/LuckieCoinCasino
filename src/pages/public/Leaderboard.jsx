import { useState } from 'react'
import { Trophy } from 'lucide-react'
import { leaderboard, currentPlayer } from '@/data/mockData'
import { leaderboardTabs, sortByTab } from '@/lib/leaderboard'
import SectionHeading from '@/components/ui/SectionHeading'
import Tabs from '@/components/ui/Tabs'
import LeaderboardTable from '@/components/ui/LeaderboardTable'
import EmptyState from '@/components/ui/EmptyState'

export default function Leaderboard() {
  const [tab, setTab] = useState('overall')
  const rows = sortByTab(leaderboard, tab)
  const tabItems = leaderboardTabs.map((t) => ({ key: t.key, label: t.label }))

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-32 sm:px-10 sm:pt-36 lg:px-16">
      <SectionHeading
        eyebrow="Club champions"
        title="The leaderboard"
        flourish="across every game"
        subtitle="Track the top resort guests by LC won, tournaments, slots, blackjack, and baccarat. Your row is highlighted in gold."
      />

      <div className="mt-8 overflow-x-auto pb-1 scrollbar-hide">
        <Tabs tabs={tabItems} value={tab} onChange={setTab} className="flex-nowrap" />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={Trophy}
          title="No ranked players yet"
          message="As guests play through the week, the standings will fill in here."
        />
      ) : (
        <div className="mt-8">
          <LeaderboardTable rows={rows} tab={tab} highlightId={currentPlayer.id} />
        </div>
      )}
    </div>
  )
}
