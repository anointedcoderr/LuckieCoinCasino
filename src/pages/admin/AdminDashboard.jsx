import {
  Users,
  UserCheck,
  Coins,
  Banknote,
  TrendingUp,
  Spade,
  ArrowUpRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { adminMetrics } from '@/data/mockData'
import { useData } from '@/context/DataContext'
import { formatLC, formatNumber, relativeTime } from '@/lib/format'
import StatCard from '@/components/ui/StatCard'
import ChartCard from '@/components/ui/ChartCard'
import CountUp from '@/components/ui/CountUp'
import Badge from '@/components/ui/Badge'
import LcAmount from '@/components/ui/LcAmount'
import Button from '@/components/ui/Button'

const tooltipStyle = {
  background: '#141216',
  border: '1px solid rgba(212,175,55,0.25)',
  borderRadius: 12,
  color: '#F6F1E7',
}

const donutColors = ['#D4AF37', '#1F8A5B', '#5B2A86', '#7cc4e0']

const activityTone = {
  'Admin Credit': 'emerald',
  'Cashout Request': 'warn',
  'Poker Win': 'gold',
  'Booking Bonus': 'emerald',
  'Slot Game Play': 'neutral',
}

export default function AdminDashboard() {
  const data = useData()
  const pendingCount = data.cashoutRequests.filter((c) => c.status === 'Pending').length
  const liveTournaments = data.tournaments.filter((t) => t.status === 'Live').length

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Members" icon={Users} valueNode={<CountUp end={adminMetrics.totalMembers} />} delta="+18 this month" />
        <StatCard label="Active Members" icon={UserCheck} accent="emerald" valueNode={<CountUp end={adminMetrics.activeMembers} />} />
        <StatCard label="LC in Circulation" icon={Coins} valueNode={<CountUp end={adminMetrics.lcInCirculation} format={(v) => formatNumber(Math.round(v))} />} />
        <StatCard label="Pending Cashouts" icon={Banknote} accent="purple" valueNode={<CountUp end={pendingCount} />} delta={`${formatLC(adminMetrics.pendingCashoutLc)} waiting`} deltaTone="danger" />
        <StatCard label="LC Credited Today" icon={TrendingUp} accent="emerald" valueNode={<CountUp end={adminMetrics.lcCreditedToday} format={(v) => formatNumber(Math.round(v))} />} />
        <StatCard label="Tournaments Live" icon={Spade} valueNode={<CountUp end={liveTournaments} />} delta="Celebrity Roleplay Poker Night" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <ChartCard title="LC played this week" subtitle="Across all games" height={280}>
          <AreaChart data={adminMetrics.weeklyLcPlayed} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="lcWeek" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1F8A5B" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#1F8A5B" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: '#9A9189', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: '#9A9189', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={52}
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
            />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#F6F1E7' }} formatter={(v) => [formatLC(v), 'LC played']} />
            <Area type="monotone" dataKey="lc" stroke="#1F8A5B" strokeWidth={2} fill="url(#lcWeek)" />
          </AreaChart>
        </ChartCard>

        <ChartCard title="LC by activity" subtitle="Share of play" height={280}>
          <PieChart>
            <Pie data={adminMetrics.lcByActivity} dataKey="lc" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3} stroke="none">
              {adminMetrics.lcByActivity.map((e, i) => (
                <Cell key={e.name} fill={donutColors[i % donutColors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [formatLC(v), n]} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#9A9189' }} iconType="circle" />
          </PieChart>
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="glass rounded-3xl p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-base font-semibold text-ink">Recent activity</p>
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Live feed</span>
          </div>
          <ul className="space-y-3">
            {data.activity.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0">
                <div className="flex min-w-0 items-center gap-3">
                  <Badge tone={activityTone[a.type] || 'neutral'}>{a.type}</Badge>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-ink/90">{a.detail}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                      {a.actor} | {relativeTime(a.at)}
                    </p>
                  </div>
                </div>
                <LcAmount value={a.amountLC} showCode={false} className="shrink-0 text-primary" />
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-dark rounded-3xl border border-primary/15 p-6 shadow-card">
          <p className="font-display text-base font-semibold text-ink">Management shortcuts</p>
          <div className="mt-4 flex flex-col gap-3">
            <Button to="/admin/credit" icon={Coins} iconRight={ArrowUpRight} fullWidth>
              Credit LuckieCoin
            </Button>
            <Button to="/admin/cashouts" variant="secondary" icon={Banknote} fullWidth>
              Review cashouts
            </Button>
            <Button to="/admin/games" variant="secondary" icon={Spade} fullWidth>
              Manage games
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
