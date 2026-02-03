import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export function StatsCard({ title, value, subtitle, icon: Icon, trend, className }) {
  return (
    <Card className={cn('bg-slate-900 border-slate-800', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-100">{value}</p>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
            {trend && (
              <p className={cn(
                'mt-2 text-sm font-medium',
                trend.type === 'up' ? 'text-emerald-400' : 'text-red-400'
              )}>
                {trend.type === 'up' ? '↑' : '↓'} {trend.value}
              </p>
            )}
          </div>
          {Icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/10">
              <Icon className="h-6 w-6 text-teal-400" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

