import { Trophy } from 'lucide-react'
import { leaderboard, currentPlayer } from '@/data/mockData'
import SectionHeading from '@/components/ui/SectionHeading'
import LeaderboardTable from '@/components/ui/LeaderboardTable'
import Button from '@/components/ui/Button'
import Reveal from '@/components/ui/Reveal'

export default function LeaderboardPreview() {
  return (
    <section className="relative bg-deep/40 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Club champions" title="This week on the leaderboard" />
          <Button to="/leaderboard" variant="secondary" icon={Trophy}>
            Full leaderboard
          </Button>
        </div>
        <Reveal className="mt-8">
          <LeaderboardTable rows={leaderboard.slice(0, 5)} tab="overall" highlightId={currentPlayer.id} compact />
        </Reveal>
      </div>
    </section>
  )
}
