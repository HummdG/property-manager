import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export function StatsCard({ title, value, subtitle, icon: Icon, trend, className, iconColor = 'amber' }) {
  const iconColorClasses = {
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600'
  }

  return (
    <Card className={cn('border-slate-200 bg-white hover:shadow-lg transition-shadow duration-300', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-blue-950">{value}</p>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            )}
            {trend && (
              <p className={cn(
                'mt-2 text-sm font-semibold',
                trend.type === 'up' ? 'text-emerald-600' : 'text-red-500'
              )}>
                {trend.type === 'up' ? '↑' : '↓'} {trend.value}
              </p>
            )}
          </div>
          {Icon && (
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', iconColorClasses[iconColor])}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
