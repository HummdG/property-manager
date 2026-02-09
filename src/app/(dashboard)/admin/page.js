import { db } from '@/lib/db'
import Link from 'next/link'
import {
  Users,
  Building2,
  ClipboardList,
  Wrench,
  TrendingUp,
  AlertCircle,
  UserCheck,
  MessageSquare,
  CalendarDays,
  MapPin,
  Star,
  Phone,
  Eye,
  FileText,
  MoreHorizontal,
  Activity,
  FileCheck,
  ArrowRight
} from 'lucide-react'
import { StatsCard } from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate, getStatusColor, getInitials, getActivityTypeColor } from '@/lib/utils'

const typeIcons = {
  CALL: Phone,
  VIEWING: Eye,
  MEETING: Users,
  SITE_VISIT: MapPin,
  PAPERWORK: FileText,
  OTHER: MoreHorizontal
}

async function getAdminStats() {
  const [users, properties, requests, traders, agents] = await Promise.all([
    db.user.count(),
    db.property.count(),
    db.serviceRequest.count(),
    db.traderProfile.count(),
    db.agentProfile.count()
  ])

  const usersByRole = await db.user.groupBy({
    by: ['role'],
    _count: true
  })

  const pendingRequests = await db.serviceRequest.count({
    where: { status: 'PENDING' }
  })

  const recentRequests = await db.serviceRequest.findMany({
    include: {
      property: { select: { name: true } },
      category: { select: { name: true } },
      requester: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
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

  // Agent-specific stats
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
    where: {
      date: { gte: todayStart }
    }
  })

  const todayLocations = await db.agentLocationLog.count({
    where: {
      timestamp: { gte: todayStart }
    }
  })

  // Top agents by inquiries this month
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const topAgents = await db.agentProfile.findMany({
    include: {
      user: {
        select: { name: true, email: true, image: true }
      },
      _count: {
        select: { inquiries: true }
      }
    },
    orderBy: {
      inquiries: { _count: 'desc' }
    },
    take: 5
  })

  // Recent agent activities
  const recentAgentLogs = await db.agentDailyLog.findMany({
    include: {
      agent: {
        include: {
          user: {
            select: { id: true, name: true, image: true }
          }
        }
      }
    },
    orderBy: { date: 'desc' },
    take: 8
  })

  return {
    totals: { users, properties, requests, traders, agents },
    usersByRole,
    pendingRequests,
    recentRequests,
    recentUsers,
    agentStats: {
      total: agents,
      active: activeAgents,
      openInquiries,
      todayLogs,
      todayLocations
    },
    topAgents,
    recentAgentLogs
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  const roleColors = {
    OWNER: 'bg-blue-100 text-blue-700 border-blue-200',
    TENANT: 'bg-purple-100 text-purple-700 border-purple-200',
    TRADER: 'bg-amber-100 text-amber-700 border-amber-200',
    AGENT: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    ADMIN: 'bg-red-100 text-red-700 border-red-200'
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of the platform</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Total Users"
          value={stats.totals.users}
          icon={Users}
          subtitle="Registered accounts"
          iconColor="amber"
        />
        <StatsCard
          title="Properties"
          value={stats.totals.properties}
          icon={Building2}
          subtitle="In the system"
          iconColor="blue"
        />
        <StatsCard
          title="Service Requests"
          value={stats.totals.requests}
          icon={ClipboardList}
          subtitle={`${stats.pendingRequests} pending`}
          iconColor="purple"
        />
        <StatsCard
          title="Traders"
          value={stats.totals.traders}
          icon={Wrench}
          subtitle="Active contractors"
          iconColor="emerald"
        />
        <StatsCard
          title="Agents"
          value={stats.agentStats.total}
          icon={UserCheck}
          subtitle={`${stats.agentStats.active} active`}
          iconColor="blue"
        />
      </div>

      {/* Alert for pending requests */}
      {stats.pendingRequests > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200">
                  <AlertCircle className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-950">{stats.pendingRequests} pending requests</h3>
                  <p className="text-slate-600 text-sm">Need to be assigned to traders</p>
                </div>
              </div>
              <Link href="/admin/requests?status=PENDING">
                <Button>
                  Review Requests
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Access - Logs & Events */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/logs">
          <Card className="group border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                    <FileCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-950">Agent Logs</h3>
                    <p className="text-sm text-slate-500">View all agent daily activity logs</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/events">
          <Card className="group border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-200 cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-950">System Events</h3>
                    <p className="text-sm text-slate-500">Audit log of all system actions</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Agent Insights Section */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-blue-50/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <UserCheck className="h-4 w-4 text-emerald-600" />
            </div>
            Agent Insights
          </CardTitle>
          <Link href="/admin/agents">
            <Button variant="outline" size="sm">
              View All Agents
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4 mb-6">
            <div className="p-4 rounded-xl bg-white border border-slate-100">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">Open Inquiries</span>
              </div>
              <p className="text-2xl font-bold text-blue-950">{stats.agentStats.openInquiries}</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-100">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm font-medium">Today's Logs</span>
              </div>
              <p className="text-2xl font-bold text-blue-950">{stats.agentStats.todayLogs}</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-100">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Location Check-ins</span>
              </div>
              <p className="text-2xl font-bold text-blue-950">{stats.agentStats.todayLocations}</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-100">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <UserCheck className="h-4 w-4" />
                <span className="text-sm font-medium">Active Agents</span>
              </div>
              <p className="text-2xl font-bold text-blue-950">{stats.agentStats.active}</p>
            </div>
          </div>

          {/* Top agents and recent activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top agents */}
            <div>
              <h4 className="text-sm font-semibold text-slate-500 mb-3">Top Agents</h4>
              <div className="space-y-2">
                {stats.topAgents.length === 0 ? (
                  <p className="text-slate-400 text-sm py-4 text-center">No agents yet</p>
                ) : (
                  stats.topAgents.map((agent, index) => (
                    <Link
                      key={agent.id}
                      href={`/admin/agents/${agent.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-amber-200 transition-colors"
                    >
                      <span className="text-sm font-semibold text-slate-400 w-4">{index + 1}</span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={agent.user?.image} />
                        <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-500 text-white text-xs">
                          {getInitials(agent.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-blue-950 truncate">{agent.user?.name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-sm font-semibold text-blue-950">{agent._count.inquiries}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Recent agent activity */}
            <div>
              <h4 className="text-sm font-semibold text-slate-500 mb-3">Recent Agent Activity</h4>
              <div className="space-y-2">
                {stats.recentAgentLogs.length === 0 ? (
                  <p className="text-slate-400 text-sm py-4 text-center">No recent activity</p>
                ) : (
                  stats.recentAgentLogs.slice(0, 5).map(log => {
                    const Icon = typeIcons[log.type] || MoreHorizontal
                    return (
                      <Link
                        key={log.id}
                        href={`/admin/agents/${log.agent.id}?tab=logs`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-amber-200 transition-colors"
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${getActivityTypeColor(log.type)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-blue-950 truncate">{log.title}</p>
                          <p className="text-xs text-slate-500">{log.agent.user?.name}</p>
                        </div>
                        <span className="text-xs text-slate-400">
                          {formatDate(log.date, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </Link>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Requests</CardTitle>
            <Link href="/admin/requests">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentRequests.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">No requests yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentRequests.map(request => (
                  <div
                    key={request.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-blue-950 truncate">{request.title}</p>
                      <p className="text-sm text-slate-500">
                        {request.property?.name} • {request.category?.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        by {request.requester?.name} • {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Users</CardTitle>
            <Link href="/admin/users">
              <Button variant="outline" size="sm">
                Manage Users
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-blue-950 truncate">{user.name}</p>
                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={roleColors[user.role]}>
                      {user.role}
                    </Badge>
                    {!user.isActive && (
                      <Badge variant="destructive">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
            User Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-5">
            {stats.usersByRole.map(item => (
              <div key={item.role} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <Badge className={roleColors[item.role]}>
                  {item.role}
                </Badge>
                <p className="text-3xl font-bold text-blue-950 mt-2">{item._count}</p>
                <p className="text-sm text-slate-500">users</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
