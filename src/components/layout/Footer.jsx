import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { siteConfig } from '@/data/siteConfig'
import { publicNav } from '@/data/navConfig'
import LcCoin from '@/components/ui/LcCoin'
import StatusDot from '@/components/ui/StatusDot'

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-deep/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-10 lg:grid-cols-4 lg:px-16">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2.5">
            <LcCoin size={34} />
            <span className="font-display text-xl font-bold text-ink">
              LuckieCoin<span className="text-primary">Casino</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{siteConfig.description}</p>
          <div className="mt-5">
            <StatusDot tone="emerald" label="Resort systems live" />
          </div>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-primary/80">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {publicNav.map((i) => (
              <li key={i.to}>
                <Link to={i.to} className="lift-on-hover text-muted hover:text-ink">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-primary/80">Club Access</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/register" className="lift-on-hover text-muted hover:text-ink">
                Join Casino Club
              </Link>
            </li>
            <li>
              <Link to="/login" className="lift-on-hover text-muted hover:text-ink">
                Member Log In
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="lift-on-hover text-muted hover:text-ink">
                Player Dashboard
              </Link>
            </li>
            <li>
              <Link to="/wallet" className="lift-on-hover text-muted hover:text-ink">
                LC Wallet
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm sm:flex-row sm:px-10 lg:px-16">
          <p className="text-muted">{siteConfig.credit}</p>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="lift-on-hover inline-flex items-center gap-2 text-muted hover:text-primary"
          >
            <Mail className="h-4 w-4" />
            {siteConfig.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  )
}
