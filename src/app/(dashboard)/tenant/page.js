import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Home, AlertCircle, Calendar, ClipboardList, Building2 } from 'lucide-react'
import { StatsCard } from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils'

async function getTenantData(userId) {
  const tenantProfile = await db.tenantProfile.findUnique({
    where: { userId },
    include: {
      property: {
        include: {
          owner: { select: { name: true, email: true, phone: true } }
        }
      }
    }
  })

  const requests = await db.serviceRequest.findMany({
    where: { requesterId: userId },
    include: {
      category: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  const requestStats = await db.serviceRequest.groupBy({
    by: ['status'],
    where: { requesterId: userId },
    _count: true
  })

  return { tenantProfile, requests, requestStats }
}

export default async function TenantDashboard() {
  const session = await auth()
  const { tenantProfile, requests, requestStats } = await getTenantData(session.user.id)

  const stats = {
    total: requestStats.reduce((sum, s) => sum + s._count, 0),
    pending: requestStats.find(s => s.status === 'PENDING')?._count || 0,
    inProgress: requestStats.filter(s => ['ASSIGNED', 'IN_PROGRESS'].includes(s.status)).reduce((sum, s) => sum + s._count, 0),
    completed: requestStats.find(s => s.status === 'COMPLETED')?._count || 0
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, {session.user.name?.split(' ')[0]}</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Requests"
          value={stats.total}
          icon={ClipboardList}
          subtitle="All time"
          iconColor="amber"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={AlertCircle}
          subtitle="Awaiting response"
          iconColor="blue"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={Building2}
          subtitle="Being worked on"
          iconColor="purple"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={Home}
          subtitle="Resolved issues"
          iconColor="emerald"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Property info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                <Home className="h-4 w-4 text-amber-600" />
              </div>
              My Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tenantProfile?.property ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-blue-950 text-lg">{tenantProfile.property.name}</h3>
                  <p className="text-slate-500 mt-1">
                    {tenantProfile.property.address}, {tenantProfile.property.city}
                  </p>
                  <p className="text-slate-400 text-sm">{tenantProfile.property.postcode}</p>
                </div>

                {tenantProfile.rentAmount && (
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500">Monthly Rent</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                      {formatCurrency(tenantProfile.rentAmount * 100)}
                    </p>
                  </div>
                )}

                {tenantProfile.leaseStart && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="h-4 w-4 text-amber-500" />
                    <span>
                      Lease: {formatDate(tenantProfile.leaseStart)} - {tenantProfile.leaseEnd ? formatDate(tenantProfile.leaseEnd) : 'Ongoing'}
                    </span>
                  </div>
                )}

                {tenantProfile.property.owner && (
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500 mb-2">Landlord</p>
                    <p className="font-semibold text-blue-950">{tenantProfile.property.owner.name}</p>
                    <p className="text-sm text-slate-500">{tenantProfile.property.owner.email}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mx-auto">
                  <Building2 className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 mt-4 font-medium">No property assigned yet</p>
                <p className="text-slate-400 text-sm mt-1">Contact your landlord to get set up</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Requests</CardTitle>
            <Link href="/tenant/issues">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mx-auto">
                  <ClipboardList className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 mt-4 font-medium">No requests yet</p>
                <Link href="/tenant/issues">
                  <Button className="mt-4">
                    Report an Issue
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map(request => (
                  <div
                    key={request.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-blue-950 truncate">{request.title}</p>
                      <p className="text-sm text-slate-500">
                        {request.category?.name} • {formatDate(request.createdAt)}
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
      </div>

      {/* Quick action */}
      {tenantProfile?.property && (
        <Card className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-blue-950">Need something fixed?</h3>
                <p className="text-slate-600 mt-1">Report an issue and we'll get it sorted</p>
              </div>
              <Link href="/tenant/issues?action=new">
                <Button>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
