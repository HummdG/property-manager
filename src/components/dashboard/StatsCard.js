import { cn } from '@/lib/utils'

export function StatsCard({ title, value, subtitle, icon: Icon, trend, className }) {
  return (
    <div className={cn('border border-wire bg-cream p-5', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fog">{title}</p>
          <p className="font-display text-[2rem] font-light text-sable mt-1.5 leading-none">{value}</p>
          {subtitle && (
            <p className="text-[0.75rem] text-fog mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              'mt-2 text-[0.75rem] font-medium',
              trend.type === 'up' ? 'text-emerald-600' : 'text-red-500'
            )}>
              {trend.type === 'up' ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 border border-wire flex items-center justify-center flex-shrink-0 ml-4">
            <Icon className="w-4 h-4 text-bronze" />
          </div>
        )}
      </div>
    </div>
  )
}
