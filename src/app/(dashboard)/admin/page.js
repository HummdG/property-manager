import { db } from '@/lib/db'
import Link from 'next/link'
import { Users, Building2, ClipboardList, Wrench, TrendingUp, AlertCircle } from 'lucide-react'
import { StatsCard } from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, getStatusColor } from '@/lib/utils'

async function getAdminStats() {
  const [users, properties, requests, traders] = await Promise.all([
    db.user.count(),
    db.property.count(),
    db.serviceRequest.count(),
    db.traderProfile.count()
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

  return {
    totals: { users, properties, requests, traders },
    usersByRole,
    pendingRequests,
    recentRequests,
    recentUsers
  }
}

export default async function AdminDashboard() {
  const stats = await getAdminStats()

  const roleColors = {
    OWNER: 'bg-blue-100 text-blue-700 border-blue-200',
    TENANT: 'bg-purple-100 text-purple-700 border-purple-200',
    TRADER: 'bg-amber-100 text-amber-700 border-amber-200',
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="grid gap-4 sm:grid-cols-4">
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
