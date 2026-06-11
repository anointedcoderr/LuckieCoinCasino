import { useMemo } from 'react'
import { CalendarCheck, Gift, BadgeCheck, ChevronRight, BedDouble } from 'lucide-react'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { formatNumber } from '@/lib/format'
import DataTable from '@/components/ui/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'
import LcAmount from '@/components/ui/LcAmount'
import EmptyState from '@/components/ui/EmptyState'
import Avatar from '@/components/ui/Avatar'
import AdminPageHeader from '@/components/ui/AdminPageHeader'

// The booking journey moves forward only, Pending welcomes the guest, Confirmed locks
// the suite and bonus, Completed closes out the stay. Completed bookings rest in place.
const nextStatus = { Pending: 'Confirmed', Confirmed: 'Completed' }
const advanceLabel = { Pending: 'Confirm stay', Confirmed: 'Mark completed' }

export default function AdminBookings() {
  const data = useData()
  const { push } = useToast()

  const bookings = data.bookings

  const stats = useMemo(() => {
    const total = bookings.length
    const bonusLc = bookings.reduce((sum, b) => sum + (Number(b.bonusLc) || 0), 0)
    const confirmed = bookings.filter((b) => b.status === 'Confirmed').length
    return { total, bonusLc, confirmed }
  }, [bookings])

  const advance = (booking) => {
    const next = nextStatus[booking.status]
    if (!next) return
    data.updateBooking(booking.id, { status: next })
    push({
      tone: next === 'Completed' ? 'success' : 'info',
      title: `Booking ${next.toLowerCase()}`,
      message: `${booking.guest}, ${booking.bookingType} is now ${next}.`,
    })
  }

  const columns = [
    {
      key: 'id',
      header: 'Booking',
      render: (b) => <span className="font-mono text-xs text-muted">{b.id}</span>,
    },
    {
      key: 'guest',
      header: 'Guest',
      render: (b) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={b.guest} size={30} />
          <span className="text-ink/90">{b.guest}</span>
        </div>
      ),
    },
    {
      key: 'bookingType',
      header: 'Type',
      render: (b) => <span className="text-ink/90">{b.bookingType}</span>,
    },
    {
      key: 'resortLocation',
      header: 'Resort location',
      render: (b) => <span className="text-muted">{b.resortLocation}</span>,
    },
    {
      key: 'bonusLc',
      header: 'Bonus LC',
      align: 'right',
      render: (b) => <LcAmount value={b.bonusLc} showCode={false} className="text-primary" />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (b) => <Badge status={b.status} />,
    },
  ]

  const actions = (b) => {
    const next = nextStatus[b.status]
    if (!next) {
      return (
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">Closed out</span>
      )
    }
    return (
      <Button size="sm" variant="secondary" iconRight={ChevronRight} onClick={() => advance(b)}>
        {advanceLabel[b.status]}
      </Button>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader description="Resort bookings and the welcome bonuses that travel with each guest stay. Move a booking forward as the suite is confirmed and the visit wraps." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total bookings"
          value={formatNumber(stats.total)}
          icon={CalendarCheck}
          accent="primary"
        />
        <StatCard
          label="Bonus LC allocated"
          valueNode={<LcAmount value={stats.bonusLc} showCode={false} className="text-2xl sm:text-3xl" />}
          icon={Gift}
          accent="emerald"
        />
        <StatCard
          label="Confirmed stays"
          value={formatNumber(stats.confirmed)}
          icon={BadgeCheck}
          accent="purple"
        />
      </div>

      <DataTable
        columns={columns}
        rows={bookings}
        actions={actions}
        empty={
          <EmptyState
            icon={BedDouble}
            title="No resort bookings on the calendar yet"
            message="When a guest reserves a suite their stay and welcome bonus will appear here for the front desk."
          />
        }
      />
    </div>
  )
}
