import { Wallet, Trophy } from 'lucide-react'
import { currentPlayer } from '@/data/mockData'
import LcBalanceCard from '@/components/ui/LcBalanceCard'
import Reveal from '@/components/ui/Reveal'
import Button from '@/components/ui/Button'

export default function BalancePreview() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-16">
      <Reveal className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary/80">Your club wallet</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            One balance for every game on the floor
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            LuckieCoin is the club currency. Booking bonuses, agent verified purchases, and tournament wins all
            land in a single balance you carry across slots, tables, and poker.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button to="/wallet" icon={Wallet}>
              Open Wallet
            </Button>
            <Button to="/leaderboard" variant="secondary" icon={Trophy}>
              See Leaderboard
            </Button>
          </div>
        </div>
        <LcBalanceCard
          balance={currentPlayer.lcBalance}
          bonusLc={currentPlayer.bonusLc}
          rank={currentPlayer.rank}
          rankMovement={currentPlayer.rankMovement}
          tier={currentPlayer.tier}
          avatarName={currentPlayer.avatarName}
          compact
        />
      </Reveal>
    </section>
  )
}
