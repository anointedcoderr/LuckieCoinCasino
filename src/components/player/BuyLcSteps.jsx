import { useData } from '@/context/DataContext'
import Badge from '@/components/ui/Badge'

const steps = [
  'Contact a casino agent in world.',
  'Pay with the resort approved in world currency.',
  'The agent verifies your payment.',
  'Management credits your LuckieCoin balance.',
]

export default function BuyLcSteps() {
  const { agents } = useData()
  return (
    <div>
      <ol className="space-y-2.5">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm text-muted">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 font-mono text-xs text-primary">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
      <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-primary/80">Casino agents</p>
      <div className="mt-3 space-y-2">
        {agents.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-2xl bg-white/[0.03] p-3">
            <div>
              <p className="text-sm font-medium text-ink">{a.avatarName}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{a.role}</p>
            </div>
            <Badge status={a.status} dot />
          </div>
        ))}
      </div>
    </div>
  )
}
