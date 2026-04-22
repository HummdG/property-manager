import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  MessageSquare,
  CalendarDays,
  CheckCircle,
  TrendingUp,
  Clock,
  Home,
  DollarSign
} from 'lucide-react'
import { StatsCard } from '@/components/dashboard'
import Link from 'next/link'
import { formatDate, cn } from '@/lib/utils'

const statusStyles = {
  OPEN:               'bg-bronze/10 text-bronze border-bronze/20',
  CONTACTED:          'bg-linen text-fog border-wire',
  MEETING_SCHEDULED:  'bg-bronze/10 text-bronze border-bronze/20',
  FOLLOW_UP:          'bg-linen text-fog border-wire',
  ACCEPTED:           'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED:           'bg-red-50 text-red-600 border-red-200',
  CLOSED:             'bg-linen text-fog border-wire',
}

const typeStyles = {
  RENT: 'bg-linen text-sable border-wire',
  SALE: 'bg-sable text-cream border-sable',
}

async function getAgentStats(agentId) {
  const [
    openInquiries,
    totalInquiries,
    todayLogs,
    closedThisMonth,
    rentInquiries,
    saleInquiries
  ] = await Promise.all([
    db.inquiry.count({
      where: {
        agentId,
        status: { in: ['OPEN', 'CONTACTED', 'MEETING_SCHEDULED', 'FOLLOW_UP'] }
      }
    }),
    db.inquiry.count({ where: { agentId } }),
    db.agentDailyLog.count({
      where: {
        agentId,
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }
    }),
    db.inquiry.count({
      where: {
        agentId,
        status: { in: ['ACCEPTED', 'CLOSED'] },
        closedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    db.inquiry.count({ where: { agentId, type: 'RENT' } }),
    db.inquiry.count({ where: { agentId, type: 'SALE' } })
  ])

  return { openInquiries, totalInquiries, todayLogs, closedThisMonth, rentInquiries, saleInquiries }
}

async function getRecentInquiries(agentId) {
  return db.inquiry.findMany({
    where: { agentId },
    include: {
      property: { select: { name: true, address: true } },
      followUps: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  })
}

async function getUpcomingFollowUps(agentId) {
  return db.inquiryFollowUp.findMany({
    where: {
      inquiry: { agentId },
      completedAt: null,
      scheduledAt: { gte: new Date() }
    },
    include: {
      inquiry: { select: { clientName: true, type: true } }
    },
    orderBy: { scheduledAt: 'asc' },
    take: 5
  })
}

async function getOrCreateAgentProfile(userId) {
  let profile = await db.agentProfile.findUnique({ where: { userId } })
  if (!profile) {
    profile = await db.agentProfile.create({ data: { userId } })
  }
  return profile
}

export default async function AgentDashboard() {
  const session = await auth()
  const agentProfile = await getOrCreateAgentProfile(session.user.id)

  const [stats, recentInquiries, upcomingFollowUps] = await Promise.all([
    getAgentStats(agentProfile.id),
    getRecentInquiries(agentProfile.id),
    getUpcomingFollowUps(agentProfile.id)
  ])

  const firstName = session.user.name?.split(' ')[0] || 'Agent'

  return (
    <div className="space-y-5">
      <div className="border-b border-wire pb-5">
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Agent Portal</p>
        <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">
          Welcome back, <span className="text-bronze">{firstName}</span>
        </h1>
        <p className="text-[0.7rem] text-fog mt-1 uppercase tracking-[0.1em]">Real Estate Agent</p>
      </div>

      <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-wire border border-wire">
        <StatsCard title="Open Inquiries" value={stats.openInquiries} icon={MessageSquare} subtitle="Needs follow-up" />
        <StatsCard title="Today's Activities" value={stats.todayLogs} icon={CalendarDays} subtitle="Logged today" />
        <StatsCard title="Closed This Month" value={stats.closedThisMonth} icon={CheckCircle} subtitle="Deals closed" />
        <StatsCard title="Total Inquiries" value={stats.totalInquiries} icon={TrendingUp} subtitle="All time" />
      </div>

      <div className="grid gap-px sm:grid-cols-2 bg-wire border border-wire">
        {[
          { label: 'Rent Inquiries', value: stats.rentInquiries, Icon: Home },
          { label: 'Sale Inquiries', value: stats.saleInquiries, Icon: DollarSign },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="bg-cream p-5 flex items-center gap-4">
            <div className="w-10 h-10 border border-wire bg-linen flex items-center justify-center flex-shrink-0">
              <Icon className="h-4 w-4 text-bronze" />
            </div>
            <div>
              <p className="font-display text-[1.75rem] font-light text-sable leading-none">{value}</p>
              <p className="text-[0.7rem] text-fog mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="border border-wire bg-cream">
          <div className="flex items-center justify-between px-5 py-4 border-b border-wire">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Recent Inquiries</p>
            <Link href="/agent/inquiries" className="text-[0.75rem] text-bronze hover:text-sable transition-colors">
              View all
            </Link>
          </div>
          <div className="divide-y divide-wire/60">
            {recentInquiries.length === 0 ? (
              <p className="text-[0.8125rem] text-haze py-8 text-center">No inquiries yet</p>
            ) : (
              recentInquiries.map(inquiry => (
                <Link
                  key={inquiry.id}
                  href={`/agent/inquiries/${inquiry.id}`}
                  className="flex items-start justify-between gap-4 px-5 py-3.5 hover:bg-linen transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.8125rem] font-medium text-sable truncate">{inquiry.clientName}</p>
                    <p className="text-[0.75rem] text-fog truncate mt-0.5">
                      {inquiry.property?.name || inquiry.preferredArea || 'General inquiry'}
                    </p>
                    <p className="text-[0.7rem] text-haze mt-0.5">{formatDate(inquiry.createdAt)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={cn('text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 border', typeStyles[inquiry.type] || 'bg-linen text-fog border-wire')}>
                      {inquiry.type}
                    </span>
                    <span className={cn('text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 border', statusStyles[inquiry.status] || 'bg-linen text-fog border-wire')}>
                      {inquiry.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="border border-wire bg-cream">
          <div className="flex items-center justify-between px-5 py-4 border-b border-wire">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Upcoming Follow-ups</p>
            <Link href="/agent/inquiries?filter=follow_up" className="text-[0.75rem] text-bronze hover:text-sable transition-colors">
              View all
            </Link>
          </div>
          <div className="divide-y divide-wire/60">
            {upcomingFollowUps.length === 0 ? (
              <p className="text-[0.8125rem] text-haze py-8 text-center">No upcoming follow-ups scheduled</p>
            ) : (
              upcomingFollowUps.map(followUp => (
                <div
                  key={followUp.id}
                  className="flex items-start justify-between gap-4 px-5 py-3.5 hover:bg-linen transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.8125rem] font-medium text-sable truncate">{followUp.title}</p>
                    <p className="text-[0.75rem] text-fog truncate mt-0.5">
                      {followUp.inquiry.clientName} · {followUp.inquiry.type}
                    </p>
                    <p className="text-[0.7rem] text-haze mt-0.5">{formatDate(followUp.scheduledAt)}</p>
                  </div>
                  <span className="text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 border border-wire bg-linen text-fog">
                    {followUp.type.replace(/_/g, ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="border border-wire bg-cream">
        <div className="px-5 py-4 border-b border-wire">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Quick Actions</p>
        </div>
        <div className="grid gap-px sm:grid-cols-3 bg-wire">
          {[
            { href: '/agent/inquiries?action=add', label: 'New Inquiry', sub: 'Add new lead', Icon: MessageSquare },
            { href: '/agent/logs/new', label: 'Log Activity', sub: 'Record daily work', Icon: CalendarDays },
            { href: '/agent/inquiries?status=MEETING_SCHEDULED', label: 'Scheduled Meetings', sub: 'View upcoming', Icon: Clock },
          ].map(({ href, label, sub, Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-4 p-5 bg-cream hover:bg-linen border-r border-wire last:border-0 transition-colors group"
            >
              <div className="w-10 h-10 border border-wire bg-linen group-hover:border-bronze/30 group-hover:bg-bronze/5 flex items-center justify-center flex-shrink-0 transition-colors">
                <Icon className="h-4 w-4 text-bronze" />
              </div>
              <div>
                <p className="text-[0.8125rem] font-medium text-sable">{label}</p>
                <p className="text-[0.7rem] text-fog mt-0.5">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
