import LcCoin from './LcCoin'

export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted">
        <LcCoin size={40} spin glow="soft" />
        <p className="font-mono text-xs uppercase tracking-wider">Loading</p>
      </div>
    </div>
  )
}
