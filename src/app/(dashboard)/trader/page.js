import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import { Briefcase, CheckCircle, Clock, AlertCircle, Wrench } from 'lucide-react'
import { StatsCard } from '@/components/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, getStatusColor, getPriorityColor } from '@/lib/utils'

async function getTraderData(userId) {
  const traderProfile = await db.traderProfile.findUnique({
    where: { userId },
    include: {
      categories: true
    }
  })

  const jobs = await db.jobAssignment.findMany({
    where: { traderId: userId },
    include: {
      serviceRequest: {
        include: {
          property: { select: { name: true, address: true, city: true } },
          category: { select: { name: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => !j.acceptedAt && !j.completedAt).length,
    inProgress: jobs.filter(j => j.acceptedAt && !j.completedAt).length,
    completed: jobs.filter(j => j.completedAt).length
  }

  return { traderProfile, jobs, stats }
}

export default async function TraderDashboard() {
  const session = await auth()
  const { traderProfile, jobs, stats } = await getTraderData(session.user.id)

  const recentJobs = jobs.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Welcome back, {session.user.name?.split(' ')[0]}
          {traderProfile?.companyName && ` • ${traderProfile.companyName}`}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Jobs"
          value={stats.total}
          icon={Briefcase}
          subtitle="All time"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          subtitle="Awaiting acceptance"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={Wrench}
          subtitle="Currently working"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          subtitle="Finished jobs"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent jobs */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-100">Recent Jobs</CardTitle>
            <Link href="/trader/jobs">
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentJobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-12 w-12 text-slate-700 mx-auto" />
                <p className="text-slate-500 mt-4">No jobs assigned yet</p>
                <p className="text-slate-600 text-sm mt-1">You'll see jobs here when they're assigned to you</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentJobs.map(job => (
                  <div
                    key={job.id}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg bg-slate-800/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-200 truncate">
                        {job.serviceRequest.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {job.serviceRequest.property.name} • {job.serviceRequest.category?.name}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {formatDate(job.assignedAt)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(job.serviceRequest.status)}>
                      {job.serviceRequest.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile summary */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-slate-100">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {traderProfile ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Completed Jobs</p>
                    <p className="text-2xl font-bold text-teal-400">{traderProfile.completedJobs}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Rating</p>
                    <p className="text-2xl font-bold text-amber-400">
                      {traderProfile.rating > 0 ? traderProfile.rating.toFixed(1) : 'N/A'}
                    </p>
                  </div>
                </div>

                {traderProfile.hourlyRate && (
                  <div className="pt-4 border-t border-slate-800">
                    <p className="text-sm text-slate-400">Hourly Rate</p>
                    <p className="text-xl font-semibold text-slate-100">£{traderProfile.hourlyRate}/hr</p>
                  </div>
                )}

                {traderProfile.categories.length > 0 && (
                  <div className="pt-4 border-t border-slate-800">
                    <p className="text-sm text-slate-400 mb-2">Specializations</p>
                    <div className="flex flex-wrap gap-2">
                      {traderProfile.categories.map(cat => (
                        <Badge key={cat.id} variant="outline" className="text-slate-300 border-slate-700">
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800">
                  <p className="text-sm text-slate-400 mb-2">Status</p>
                  <Badge className={traderProfile.isAvailable 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }>
                    {traderProfile.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-slate-500">Profile not set up yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending jobs alert */}
      {stats.pending > 0 && (
        <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-amber-400" />
                <div>
                  <h3 className="font-semibold text-slate-100">You have {stats.pending} pending job{stats.pending > 1 ? 's' : ''}</h3>
                  <p className="text-slate-400 text-sm">Review and accept to get started</p>
                </div>
              </div>
              <Link href="/trader/jobs?filter=pending">
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                  View Pending Jobs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

