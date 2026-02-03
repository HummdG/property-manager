import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { Building2, ClipboardList, Users, CreditCard } from 'lucide-react'
import { StatsCard } from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatDate, getStatusColor } from '@/lib/utils'

async function getOwnerStats(userId) {
  const [properties, requests, tenants, pendingPayments] = await Promise.all([
    db.property.count({ where: { ownerId: userId } }),
    db.serviceRequest.count({
      where: {
        property: { ownerId: userId },
        status: { in: ['PENDING', 'IN_PROGRESS', 'ASSIGNED'] }
      }
    }),
    db.tenantProfile.count({
      where: { property: { ownerId: userId } }
    }),
    db.payment.count({
      where: {
        serviceRequest: { property: { ownerId: userId } },
        status: 'PENDING'
      }
    })
  ])

  return { properties, requests, tenants, pendingPayments }
}

async function getRecentRequests(userId) {
  return db.serviceRequest.findMany({
    where: { property: { ownerId: userId } },
    include: {
      property: { select: { name: true, address: true } },
      category: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  })
}

export default async function OwnerDashboard() {
  const session = await auth()
  const [stats, recentRequests] = await Promise.all([
    getOwnerStats(session.user.id),
    getRecentRequests(session.user.id)
  ])

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your property portfolio</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Properties"
          value={stats.properties}
          icon={Building2}
          subtitle="In your portfolio"
        />
        <StatsCard
          title="Active Requests"
          value={stats.requests}
          icon={ClipboardList}
          subtitle="Needs attention"
        />
        <StatsCard
          title="Tenants"
          value={stats.tenants}
          icon={Users}
          subtitle="Currently housed"
        />
        <StatsCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={CreditCard}
          subtitle="Awaiting payment"
        />
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent service requests */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-100">Recent Service Requests</CardTitle>
            <Link
              href="/owner/requests"
              className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentRequests.length === 0 ? (
              <p className="text-slate-500 text-sm py-8 text-center">
                No service requests yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentRequests.map(request => (
                  <div
                    key={request.id}
                    className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-200 truncate">
                        {request.title}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {request.property.name} • {request.category?.name}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {formatDate(request.createdAt)}
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

        {/* Quick actions */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-slate-100">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link
              href="/owner/properties?action=add"
              className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 group-hover:bg-teal-500/20 transition-colors">
                <Building2 className="h-5 w-5 text-teal-400" />
              </div>
              <div>
                <p className="font-medium text-slate-200">Add New Property</p>
                <p className="text-sm text-slate-500">Register a property to manage</p>
              </div>
            </Link>
            <Link
              href="/owner/requests"
              className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                <ClipboardList className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-slate-200">View Service Requests</p>
                <p className="text-sm text-slate-500">Manage maintenance requests</p>
              </div>
            </Link>
            <Link
              href="/owner/payments"
              className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <CreditCard className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-slate-200">Payment History</p>
                <p className="text-sm text-slate-500">Track payments and invoices</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

