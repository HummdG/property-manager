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
        <h1 className="text-2xl font-bold text-blue-950">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your property portfolio</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Properties"
          value={stats.properties}
          icon={Building2}
          subtitle="In your portfolio"
          iconColor="amber"
        />
        <StatsCard
          title="Active Requests"
          value={stats.requests}
          icon={ClipboardList}
          subtitle="Needs attention"
          iconColor="blue"
        />
        <StatsCard
          title="Tenants"
          value={stats.tenants}
          icon={Users}
          subtitle="Currently housed"
          iconColor="emerald"
        />
        <StatsCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon={CreditCard}
          subtitle="Awaiting payment"
          iconColor="purple"
        />
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent service requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Service Requests</CardTitle>
            <Link
              href="/owner/requests"
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentRequests.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">
                No service requests yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentRequests.map(request => (
                  <div
                    key={request.id}
                    className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-blue-950 truncate">
                        {request.title}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {request.property.name} • {request.category?.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link
              href="/owner/properties?action=add"
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 transition-all duration-200 group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 group-hover:bg-amber-200 transition-colors">
                <Building2 className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-950">Add New Property</p>
                <p className="text-sm text-slate-500">Register a property to manage</p>
              </div>
            </Link>
            <Link
              href="/owner/requests"
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all duration-200 group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-950">View Service Requests</p>
                <p className="text-sm text-slate-500">Manage maintenance requests</p>
              </div>
            </Link>
            <Link
              href="/owner/payments"
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-all duration-200 group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                <CreditCard className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-950">Payment History</p>
                <p className="text-sm text-slate-500">Track payments and invoices</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
