import { Card, CardContent, CardHeader } from '@/components/ui/card'

function SkeletonCard () {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-slate-100 animate-pulse" />
          <div className="h-7 w-16 rounded bg-slate-100 animate-pulse" />
          <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
        </div>
        <div className="h-10 w-10 rounded-xl bg-slate-100 animate-pulse" />
      </div>
    </div>
  )
}

function SkeletonListItem () {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
      <div className="h-8 w-8 rounded-full bg-slate-100 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 rounded bg-slate-100 animate-pulse" />
        <div className="h-3 w-28 rounded bg-slate-100 animate-pulse" />
      </div>
      <div className="h-5 w-16 rounded bg-slate-100 animate-pulse" />
    </div>
  )
}

export default function AdminDashboardLoading () {
  return (
    <div className="space-y-6">
      {/* Page header skeleton */}
      <div>
        <div className="h-7 w-52 rounded bg-slate-100 animate-pulse" />
        <div className="h-4 w-40 rounded bg-slate-100 animate-pulse mt-2" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Agent insights skeleton */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-5 w-32 rounded bg-slate-100 animate-pulse" />
          </div>
          <div className="h-8 w-28 rounded bg-slate-100 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-slate-100">
                <div className="h-4 w-24 rounded bg-slate-100 animate-pulse mb-2" />
                <div className="h-7 w-12 rounded bg-slate-100 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-slate-100 animate-pulse mb-3" />
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonListItem key={i} />
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-4 w-36 rounded bg-slate-100 animate-pulse mb-3" />
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonListItem key={i} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent requests & users skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="h-5 w-32 rounded bg-slate-100 animate-pulse" />
            <div className="h-8 w-20 rounded bg-slate-100 animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="h-5 w-28 rounded bg-slate-100 animate-pulse" />
            <div className="h-8 w-28 rounded bg-slate-100 animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonListItem key={i} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* User distribution skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
            <div className="h-5 w-36 rounded bg-slate-100 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="h-5 w-16 rounded bg-slate-100 animate-pulse" />
                <div className="h-8 w-10 rounded bg-slate-100 animate-pulse mt-2" />
                <div className="h-3 w-12 rounded bg-slate-100 animate-pulse mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


