import { db } from '@/lib/db'
import Link from 'next/link'
import {
  Users,
  Building2,
  TrendingUp,
  AlertCircle,
  UserCheck,
  MessageSquare,
  CalendarDays,
  MapPin,
  Phone,
  Eye,
  FileText,
  MoreHorizontal,
  Activity,
  FileCheck,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  UserPlus
} from 'lucide-react'
import { StatsCard } from '@/components/dashboard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate, getInitials, getActivityTypeColor } from '@/lib/utils'

const typeIcons = {
  CALL: Phone,
  VIEWING: Eye,
  MEETING: Users,
  SITE_VISIT: MapPin,
  PAPERWORK: FileText,
  OTHER: MoreHorizontal
}

const typeLabels = {
  CALL: 'Calls',
  VIEWING: 'Viewings',
  MEETING: 'Meetings',
  SITE_VISIT: 'Site Visits',
  PAPERWORK: 'Paperwork',
  OTHER: 'Other'
}

const eventTypeConfig = {
  USER_REGISTERED: { icon: UserPlus, color: 'bg-blue-100 text-blue-600', label: 'User Registered' },
  USER_TOGGLED_ACTIVE: { icon: Users, color: 'bg-orange-100 text-orange-600', label: 'User Toggled' },
  PROPERTY_CREATED: { icon: Building2, color: 'bg-emerald-100 text-emerald-600', label: 'Property Created' },
  PROPERTY_UPDATED: { icon: Building2, color: 'bg-amber-100 text-amber-600', label: 'Property Updated' },
  PROPERTY_LISTED: { icon: Eye, color: 'bg-green-100 text-green-600', label: 'Property Listed' },
  PROPERTY_DELETED: { icon: Trash2, color: 'bg-red-100 text-red-600', label: 'Property Deleted' },
  INQUIRY_CREATED: { icon: MessageSquare, color: 'bg-cyan-100 text-cyan-600', label: 'Inquiry Created' },
  INQUIRY_UPDATED: { icon: MessageSquare, color: 'bg-teal-100 text-teal-600', label: 'Inquiry Updated' },
  INQUIRY_DELETED: { icon: Trash2, color: 'bg-red-100 text-red-600', label: 'Inquiry Deleted' },
  FOLLOW_UP_CREATED: { icon: CalendarDays, color: 'bg-violet-100 text-violet-600', label: 'Follow-Up Created' },
  AGENT_LOG_CREATED: { icon: CalendarDays, color: 'bg-sky-100 text-sky-600', label: 'Log Created' },
  DOCUMENT_UPLOADED: { icon: FileText, color: 'bg-indigo-100 text-indigo-600', label: 'Document Uploaded' }
}

const defaultEventConfig = { icon: Activity, color: 'bg-slate-100 text-slate-600', label: 'Event' }

function timeAgo (date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString('en-AE', { month: 'short', day: 'numeric' })
}

async function getAdminStats() {
  const [users, properties, agents] = await Promise.all([
    db.user.count(),
    db.property.count(),
    db.agentProfile.count()
  ])

  const usersByRole = await db.user.groupBy({
    by: ['role'],
    _count: true
  })

  const recentUsers = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true
    }
  })

  const activeAgents = await db.agentProfile.count({
    where: { isAvailable: true }
  })

  const openInquiries = await db.inquiry.count({
    where: {
      status: { in: ['OPEN', 'CONTACTED', 'MEETING_SCHEDULED', 'FOLLOW_UP'] }
    }
  })

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayLogs = await db.agentDailyLog.count({
    where: { date: { gte: todayStart } }
  })

  const todayLocations = await db.agentLocationLog.count({
    where: { timestamp: { gte: todayStart } }
  })

  const topAgents = await db.agentProfile.findMany({
    include: {
      user: { select: { name: true, email: true, image: true } },
      _count: { select: { inquiries: true } }
    },
    orderBy: { inquiries: { _count: 'desc' } },
    take: 5
  })

  const recentAgentLogs = await db.agentDailyLog.findMany({
    include: {
      agent: {
        include: { user: { select: { id: true, name: true, image: true } } }
      }
    },
    orderBy: { date: 'desc' },
    take: 8
  })

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const lastWeekStart = new Date(weekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)

  const [thisWeekLogs, lastWeekLogs, thisWeekByType, topAgentsThisWeek] = await Promise.all([
    db.agentDailyLog.count({ where: { date: { gte: weekStart } } }),
    db.agentDailyLog.count({ where: { date: { gte: lastWeekStart, lt: weekStart } } }),
    db.agentDailyLog.groupBy({
      by: ['type'],
      where: { date: { gte: weekStart } },
      _count: true,
      orderBy: { _count: { type: 'desc' } }
    }),
    db.agentDailyLog.groupBy({
      by: ['agentId'],
      where: { date: { gte: weekStart } },
      _count: true,
      orderBy: { _count: { type: 'desc' } },
      take: 3
    })
  ])

  const topAgentIds = topAgentsThisWeek.map(a => a.agentId)
  const topAgentProfiles = topAgentIds.length > 0
    ? await db.agentProfile.findMany({
      where: { id: { in: topAgentIds } },
      include: { user: { select: { name: true, image: true } } }
    })
    : []

  const topAgentsWeekly = topAgentsThisWeek.map(a => {
    const profile = topAgentProfiles.find(p => p.id === a.agentId)
    return { agentId: a.agentId, count: a._count, name: profile?.user?.name, image: profile?.user?.image }
  })

  const recentEvents = await db.systemEvent.findMany({
    orderBy: { createdAt: 'desc' },
    take: 8
  })

  const eventUserIds = [...new Set(recentEvents.filter(e => e.userId).map(e => e.userId))]
  const eventUsers = eventUserIds.length > 0
    ? await db.user.findMany({
      where: { id: { in: eventUserIds } },
      select: { id: true, name: true }
    })
    : []

  const recentEventsWithUsers = recentEvents.map(event => ({
    ...event,
    userName: eventUsers.find(u => u.id === event.userId)?.name || null
  }))

  return {
    totals: { users, properties, agents },
    usersByRole,
    recentUsers,
    agentStats: {
      total: agents,
      active: activeAgents,
      openInquiries,
      todayLogs,
      todayLocations
    },
    topAgents,
    recentAgentLogs,
    weeklyLogs: {
      thisWeek: thisWeekLogs,
      lastWeek: lastWeekLogs,
      byType: thisWeekByType.reduce((acc, item) => {
        acc[item.type] = item._count
        return acc
      }, {}),
      topAgents: topAgentsWeekly
    },
    recentEvents: recentEventsWithUsers
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  const rolePills = {
    OWNER: 'bg-bronze/10 text-bronze border border-bronze/20',
    TENANT: 'bg-sable/5 text-pewter border border-wire',
    AGENT: 'bg-sable/8 text-pewter border border-wire',
    ADMIN: 'bg-red-50 text-red-600 border border-red-100'
  }

  return (
    <div className="space-y-5">
      <div className="border-b border-wire pb-5">
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Administration</p>
        <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">Platform Overview</h1>
      </div>

      <div className="grid gap-px sm:grid-cols-3 bg-wire border border-wire">
        <StatsCard title="Total Users" value={stats.totals.users} icon={Users} subtitle="Registered accounts" />
        <StatsCard title="Properties" value={stats.totals.properties} icon={Building2} subtitle="In the system" />
        <StatsCard title="Agents" value={stats.agentStats.total} icon={UserCheck} subtitle={`${stats.agentStats.active} active`} />
      </div>

      {/* Agent Logs Summary */}
      <div className="border border-wire bg-cream">
        <div className="flex items-center justify-between px-6 py-4 border-b border-wire">
          <div className="flex items-center gap-3">
            <FileCheck className="h-4 w-4 text-bronze" />
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Agent Logs Summary</p>
          </div>
          <Link
            href="/admin/logs"
            className="flex items-center gap-1.5 text-[0.75rem] text-pewter hover:text-sable transition-colors"
          >
            View All Logs <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-px sm:grid-cols-3 bg-wire">
          <div className="bg-cream p-5">
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-3">This Week</p>
            <div className="flex items-end gap-2">
              <p className="font-display text-[2.5rem] font-light text-sable leading-none">{stats.weeklyLogs.thisWeek}</p>
              {(() => {
                const diff = stats.weeklyLogs.thisWeek - stats.weeklyLogs.lastWeek
                const pct = stats.weeklyLogs.lastWeek > 0
                  ? Math.round((diff / stats.weeklyLogs.lastWeek) * 100)
                  : stats.weeklyLogs.thisWeek > 0 ? 100 : 0
                if (diff > 0) return <span className="flex items-center text-[0.7rem] font-medium text-emerald-600 mb-1.5"><ArrowUpRight className="h-3 w-3" />+{pct}%</span>
                if (diff < 0) return <span className="flex items-center text-[0.7rem] font-medium text-red-500 mb-1.5"><ArrowDownRight className="h-3 w-3" />{pct}%</span>
                return <span className="text-[0.7rem] text-haze mb-1.5">No change</span>
              })()}
            </div>
            <p className="text-[0.7rem] text-haze mt-1">Last week: {stats.weeklyLogs.lastWeek}</p>
          </div>

          <div className="bg-cream p-5">
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-3">Activity Breakdown</p>
            {Object.keys(stats.weeklyLogs.byType).length === 0 ? (
              <p className="text-[0.75rem] text-haze">No logs this week</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(stats.weeklyLogs.byType).map(([type, count]) => {
                  const Icon = typeIcons[type] || MoreHorizontal
                  return (
                    <div key={type} className="flex items-center gap-1.5 px-2 py-1 border border-wire bg-linen">
                      <Icon className="h-3 w-3 text-bronze" />
                      <span className="text-[0.7rem] text-pewter">{typeLabels[type] || type}</span>
                      <span className="text-[0.65rem] text-fog font-medium">{count}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="bg-cream p-5">
            <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-3">Most Active This Week</p>
            {stats.weeklyLogs.topAgents.length === 0 ? (
              <p className="text-[0.75rem] text-haze">No agent activity this week</p>
            ) : (
              <div className="space-y-2.5">
                {stats.weeklyLogs.topAgents.map((agent, idx) => (
                  <div key={agent.agentId} className="flex items-center gap-2.5">
                    <span className="text-[0.65rem] font-medium text-bronze w-3">{idx + 1}</span>
                    <Avatar className="h-5 w-5 ring-1 ring-bronze/20">
                      <AvatarImage src={agent.image} />
                      <AvatarFallback className="bg-bronze/15 text-bronze text-[8px] font-medium">
                        {getInitials(agent.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[0.8125rem] text-sable flex-1 truncate">{agent.name || 'Unknown'}</span>
                    <span className="text-[0.7rem] text-fog">{agent.count} logs</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent System Events */}
      <div className="border border-wire bg-cream">
        <div className="flex items-center justify-between px-6 py-4 border-b border-wire">
          <div className="flex items-center gap-3">
            <Activity className="h-4 w-4 text-bronze" />
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Recent System Events</p>
          </div>
          <Link
            href="/admin/events"
            className="flex items-center gap-1.5 text-[0.75rem] text-pewter hover:text-sable transition-colors"
          >
            View All Events <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="px-6 py-2">
          {stats.recentEvents.length === 0 ? (
            <div className="text-center py-10">
              <Activity className="h-7 w-7 text-wire mx-auto mb-2" />
              <p className="text-[0.8125rem] text-haze">No system events recorded yet</p>
            </div>
          ) : (
            <div>
              {stats.recentEvents.map((event, idx) => {
                const config = eventTypeConfig[event.type] || defaultEventConfig
                const EventIcon = config.icon
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 py-3.5 border-b border-wire/60 last:border-0"
                  >
                    <div className="relative flex flex-col items-center flex-shrink-0">
                      <div className="w-7 h-7 border border-wire bg-linen flex items-center justify-center">
                        <EventIcon className="h-3.5 w-3.5 text-bronze" />
                      </div>
                      {idx < stats.recentEvents.length - 1 && (
                        <div className="w-px h-3 bg-wire mt-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[0.65rem] uppercase tracking-[0.12em] text-bronze font-medium">
                          {config.label}
                        </span>
                        {event.userName && (
                          <span className="text-[0.75rem] text-fog">by {event.userName}</span>
                        )}
                      </div>
                      {event.metadata && typeof event.metadata === 'object' && (
                        <p className="text-[0.8125rem] text-pewter mt-0.5 truncate">
                          {event.metadata.propertyName
                            || event.metadata.clientName
                            || event.metadata.userName
                            || event.metadata.title
                            || ''}
                        </p>
                      )}
                    </div>
                    <span className="text-[0.7rem] text-haze flex-shrink-0 pt-0.5">
                      {timeAgo(event.createdAt)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Agent Insights */}
      <div className="border border-wire bg-cream">
        <div className="flex items-center justify-between px-6 py-4 border-b border-wire">
          <div className="flex items-center gap-3">
            <UserCheck className="h-4 w-4 text-bronze" />
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Agent Insights</p>
          </div>
          <Link
            href="/admin/agents"
            className="flex items-center gap-1.5 text-[0.75rem] text-pewter hover:text-sable transition-colors"
          >
            View All Agents <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid gap-px sm:grid-cols-4 bg-wire border border-wire">
            {[
              { label: 'Open Inquiries', value: stats.agentStats.openInquiries, Icon: MessageSquare },
              { label: "Today's Logs", value: stats.agentStats.todayLogs, Icon: CalendarDays },
              { label: 'Location Check-ins', value: stats.agentStats.todayLocations, Icon: MapPin },
              { label: 'Active Agents', value: stats.agentStats.active, Icon: UserCheck },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="bg-cream p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-3.5 w-3.5 text-bronze" />
                  <p className="text-[0.65rem] uppercase tracking-[0.1em] text-fog font-medium">{label}</p>
                </div>
                <p className="font-display text-[1.75rem] font-light text-sable leading-none">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium mb-3">Top Agents</p>
              <div className="space-y-px border border-wire">
                {stats.topAgents.length === 0 ? (
                  <p className="text-[0.8125rem] text-haze py-6 text-center bg-cream">No agents yet</p>
                ) : (
                  stats.topAgents.map((agent, index) => (
                    <Link
                      key={agent.id}
                      href={`/admin/agents/${agent.id}`}
                      className="flex items-center gap-3 p-3.5 bg-cream hover:bg-linen border-b border-wire last:border-0 transition-colors"
                    >
                      <span className="text-[0.7rem] font-medium text-bronze w-3">{index + 1}</span>
                      <Avatar className="h-7 w-7 ring-1 ring-bronze/20">
                        <AvatarImage src={agent.user?.image} />
                        <AvatarFallback className="bg-bronze/15 text-bronze text-[9px] font-medium">
                          {getInitials(agent.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-[0.8125rem] text-sable flex-1 truncate">{agent.user?.name}</p>
                      <div className="flex items-center gap-1.5 text-[0.75rem] text-fog">
                        <MessageSquare className="h-3 w-3 text-bronze" />
                        {agent._count.inquiries}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium mb-3">Recent Agent Activity</p>
              <div className="space-y-px border border-wire">
                {stats.recentAgentLogs.length === 0 ? (
                  <p className="text-[0.8125rem] text-haze py-6 text-center bg-cream">No recent activity</p>
                ) : (
                  stats.recentAgentLogs.slice(0, 5).map(log => {
                    const Icon = typeIcons[log.type] || MoreHorizontal
                    return (
                      <Link
                        key={log.id}
                        href={`/admin/agents/${log.agent.id}?tab=logs`}
                        className="flex items-center gap-3 p-3.5 bg-cream hover:bg-linen border-b border-wire last:border-0 transition-colors"
                      >
                        <div className="w-7 h-7 border border-wire bg-linen flex items-center justify-center flex-shrink-0">
                          <Icon className="h-3.5 w-3.5 text-bronze" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.8125rem] text-sable truncate">{log.title}</p>
                          <p className="text-[0.7rem] text-fog">{log.agent.user?.name}</p>
                        </div>
                        <span className="text-[0.7rem] text-haze flex-shrink-0">
                          {formatDate(log.date)}
                        </span>
                      </Link>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent users */}
      <div className="border border-wire bg-cream">
        <div className="flex items-center justify-between px-5 py-4 border-b border-wire">
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Recent Users</p>
          <Link href="/admin/users" className="text-[0.75rem] text-pewter hover:text-sable transition-colors">
            Manage Users
          </Link>
        </div>
        <div className="divide-y divide-wire/60">
          {stats.recentUsers.map(user => (
            <div key={user.id} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-linen transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-[0.8125rem] font-medium text-sable truncate">{user.name}</p>
                <p className="text-[0.75rem] text-fog truncate mt-0.5">{user.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[0.65rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 ${rolePills[user.role]}`}>
                  {user.role}
                </span>
                {!user.isActive && (
                  <span className="text-[0.65rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 bg-red-50 text-red-500 border border-red-100">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User distribution */}
      <div className="border border-wire bg-cream">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-wire">
          <TrendingUp className="h-4 w-4 text-bronze" />
          <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">User Distribution</p>
        </div>
        <div className="grid gap-px sm:grid-cols-4 bg-wire p-px">
          {stats.usersByRole.map(item => (
            <div key={item.role} className="bg-cream p-5">
              <span className={`text-[0.6rem] uppercase tracking-[0.1em] font-medium px-2 py-0.5 ${rolePills[item.role] || 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                {item.role}
              </span>
              <p className="font-display text-[2rem] font-light text-sable mt-3 leading-none">{item._count}</p>
              <p className="text-[0.7rem] text-haze mt-1">users</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
