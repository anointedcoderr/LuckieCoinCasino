import { useState } from 'react'
import { Coins, TrendingUp, Banknote, UserCheck } from 'lucide-react'
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
  BarChart,
  Bar,
} from 'recharts'
import { adminMetrics, leaderboard } from '@/data/mockData'
import { useData } from '@/context/DataContext'
import { formatLC, formatNumber } from '@/lib/format'
import AdminPageHeader from '@/components/ui/AdminPageHeader'
import StatCard from '@/components/ui/StatCard'
import ChartCard from '@/components/ui/ChartCard'
import CountUp from '@/components/ui/CountUp'
import Tabs from '@/components/ui/Tabs'

// Shared recharts styling so every panel reads in the club palette.
const tooltipStyle = {
  background: '#141216',
  border: '1px solid rgba(212,175,55,0.25)',
  borderRadius: 12,
  color: '#F6F1E7',
}

const donutColors = ['#D4AF37', '#1F8A5B', '#5B2A86', '#7cc4e0']

const rangeTabs = [
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: '90d', label: '90 days' },
]

export default function AdminAnalytics() {
  const data = useData()
  // The range toggle frames the read for the host. The seeded series stays steady.
  const [range, setRange] = useState('7d')

  const pendingCount = data.cashoutRequests.filter((c) => c.status === 'Pending').length
  const topPlayers = [...leaderboard]
    .sort((a, b) => b.lcWon - a.lcWon)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        description="Read the pulse of the club. Track LC flowing across the floor, where members spend their play, and the names topping the standings."
        actions={<Tabs tabs={rangeTabs} value={range} onChange={setRange} />}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="LC in Circulation"
          icon={Coins}
          valueNode={<CountUp end={adminMetrics.lcInCirculation} format={(v) => formatNumber(Math.round(v))} />}
        />
        <StatCard
          label="LC Credited Today"
          icon={TrendingUp}
          accent="emerald"
          valueNode={<CountUp end={adminMetrics.lcCreditedToday} format={(v) => formatNumber(Math.round(v))} />}
        />
        <StatCard
          label="Pending Cashouts"
          icon={Banknote}
          accent="purple"
          valueNode={<CountUp end={pendingCount} />}
          delta={`${formatLC(adminMetrics.pendingCashoutLc)} waiting`}
          deltaTone="danger"
        />
        <StatCard
          label="Active Members"
          icon={UserCheck}
          accent="emerald"
          valueNode={<CountUp end={adminMetrics.activeMembers} />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <ChartCard title="LC played this week" subtitle="Across every game on the floor" height={300}>
          <AreaChart data={adminMetrics.weeklyLcPlayed} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="analyticsLcWeek" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
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
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: '#F6F1E7' }}
              formatter={(v) => [formatLC(v), 'LC played']}
            />
            <Area type="monotone" dataKey="lc" stroke="#D4AF37" strokeWidth={2} fill="url(#analyticsLcWeek)" />
          </AreaChart>
        </ChartCard>

        <ChartCard title="LC by activity" subtitle="Share of play" height={300}>
          <PieChart>
            <Pie
              data={adminMetrics.lcByActivity}
              dataKey="lc"
              nameKey="name"
              innerRadius={58}
              outerRadius={92}
              paddingAngle={3}
              stroke="none"
            >
              {adminMetrics.lcByActivity.map((entry, i) => (
                <Cell key={entry.name} fill={donutColors[i % donutColors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [formatLC(v), n]} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#9A9189' }} iconType="circle" />
          </PieChart>
        </ChartCard>
      </div>

      <ChartCard title="Top members by LC won" subtitle="Leaders of the standings this period" height={320}>
        <BarChart
          data={topPlayers}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 12, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#9A9189', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          />
          <YAxis
            type="category"
            dataKey="player"
            tick={{ fill: '#9A9189', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={130}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: 'rgba(212,175,55,0.08)' }}
            formatter={(v) => [formatLC(v), 'LC won']}
          />
          <Bar dataKey="lcWon" fill="#D4AF37" radius={[0, 8, 8, 0]} barSize={22} />
        </BarChart>
      </ChartCard>
    </div>
  )
}
