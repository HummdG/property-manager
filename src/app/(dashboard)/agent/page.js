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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatDate, getInquiryStatusColor, getInquiryTypeColor } from '@/lib/utils'

async function getAgentStats(agentId) {
  const [
    openInquiries,
    totalInquiries,
    todayLogs,
    closedThisMonth,
    rentInquiries,
    saleInquiries,
    maintenanceInquiries
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
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
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
    db.inquiry.count({ where: { agentId, type: 'SALE' } }),
    db.inquiry.count({ where: { agentId, type: 'MAINTENANCE' } })
  ])

  return {
    openInquiries,
    totalInquiries,
    todayLogs,
    closedThisMonth,
    rentInquiries,
    saleInquiries,
    maintenanceInquiries
  }
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
      inquiry: {
        select: { clientName: true, type: true }
      }
    },
    orderBy: { scheduledAt: 'asc' },
    take: 5
  })
}

async function getOrCreateAgentProfile(userId) {
  let profile = await db.agentProfile.findUnique({
    where: { userId }
  })

  if (!profile) {
    profile = await db.agentProfile.create({
      data: { userId }
    })
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

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Agent Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage your inquiries and track your activities</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Open Inquiries"
          value={stats.openInquiries}
          icon={MessageSquare}
          subtitle="Needs follow-up"
          iconColor="amber"
        />
        <StatsCard
          title="Today's Activities"
          value={stats.todayLogs}
          icon={CalendarDays}
          subtitle="Logged today"
          iconColor="blue"
        />
        <StatsCard
          title="Closed This Month"
          value={stats.closedThisMonth}
          icon={CheckCircle}
          subtitle="Deals closed"
          iconColor="emerald"
        />
        <StatsCard
          title="Total Inquiries"
          value={stats.totalInquiries}
          icon={TrendingUp}
          subtitle="All time"
          iconColor="purple"
        />
      </div>

      {/* Inquiry breakdown */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-950">{stats.rentInquiries}</p>
              <p className="text-sm text-slate-500">Rent Inquiries</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-950">{stats.saleInquiries}</p>
              <p className="text-sm text-slate-500">Sale Inquiries</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-950">{stats.maintenanceInquiries}</p>
              <p className="text-sm text-slate-500">Maintenance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent inquiries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Inquiries</CardTitle>
            <Link
              href="/agent/inquiries"
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentInquiries.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">
                No inquiries yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentInquiries.map(inquiry => (
                  <Link
                    key={inquiry.id}
                    href={`/agent/inquiries/${inquiry.id}`}
                    className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0 hover:bg-slate-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-blue-950 truncate">
                        {inquiry.clientName}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {inquiry.property?.name || inquiry.preferredArea || 'General inquiry'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(inquiry.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={getInquiryTypeColor(inquiry.type)}>
                        {inquiry.type}
                      </Badge>
                      <Badge variant="outline" className={getInquiryStatusColor(inquiry.status)}>
                        {inquiry.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming follow-ups */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Follow-ups</CardTitle>
            <Link
              href="/agent/inquiries?filter=follow_up"
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingFollowUps.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">
                No upcoming follow-ups scheduled
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingFollowUps.map(followUp => (
                  <div
                    key={followUp.id}
                    className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-blue-950 truncate">
                        {followUp.title}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {followUp.inquiry.clientName} • {followUp.inquiry.type}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(followUp.scheduledAt)}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {followUp.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/agent/inquiries?action=add"
            className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 transition-all duration-200 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 group-hover:bg-amber-200 transition-colors">
              <MessageSquare className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-blue-950">New Inquiry</p>
              <p className="text-sm text-slate-500">Add new lead</p>
            </div>
          </Link>
          <Link
            href="/agent/logs/new"
            className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all duration-200 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
              <CalendarDays className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-blue-950">Log Activity</p>
              <p className="text-sm text-slate-500">Record daily work</p>
            </div>
          </Link>
          <Link
            href="/agent/inquiries?status=MEETING_SCHEDULED"
            className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-all duration-200 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
              <Clock className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-blue-950">Scheduled Meetings</p>
              <p className="text-sm text-slate-500">View upcoming</p>
            </div>
          </Link>
          <Link
            href="/agent/subscription"
            className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-100 hover:border-purple-200 transition-all duration-200 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 group-hover:bg-purple-200 transition-colors">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-blue-950">Subscription</p>
              <p className="text-sm text-slate-500">Manage plan</p>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}


