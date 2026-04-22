'use client'

import { Phone, Eye, Users, MapPin, FileText, MoreHorizontal, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const typeConfig = {
  CALL: { icon: Phone, iconCls: 'text-bronze', bgCls: 'bg-bronze/10 border-bronze/30', badgeCls: 'text-bronze border-bronze/40 bg-bronze/5' },
  VIEWING: { icon: Eye, iconCls: 'text-sable', bgCls: 'bg-linen border-wire', badgeCls: 'text-pewter border-wire bg-linen' },
  MEETING: { icon: Users, iconCls: 'text-pewter', bgCls: 'bg-linen border-wire', badgeCls: 'text-pewter border-wire bg-linen' },
  SITE_VISIT: { icon: MapPin, iconCls: 'text-bronze', bgCls: 'bg-bronze/10 border-bronze/30', badgeCls: 'text-bronze border-bronze/40 bg-bronze/5' },
  PAPERWORK: { icon: FileText, iconCls: 'text-fog', bgCls: 'bg-linen border-wire', badgeCls: 'text-fog border-wire bg-linen' },
  OTHER: { icon: MoreHorizontal, iconCls: 'text-haze', bgCls: 'bg-linen border-wire', badgeCls: 'text-haze border-wire bg-linen' },
}

export function ActivityLogEntry({ log }) {
  const config = typeConfig[log.type] || typeConfig.OTHER
  const Icon = config.icon

  return (
    <div className="flex items-start gap-4 border border-wire bg-cream px-5 py-4 hover:bg-linen transition-colors">
      <div className={`w-9 h-9 border flex items-center justify-center flex-shrink-0 ${config.bgCls}`}>
        <Icon className={`h-4 w-4 ${config.iconCls}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="text-[0.9375rem] font-medium text-sable leading-snug">{log.title}</h4>
            <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
              <span className={`text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 border ${config.badgeCls}`}>
                {log.type.replace('_', ' ')}
              </span>
              {log.location && (
                <span className="flex items-center gap-1 text-[0.75rem] text-fog">
                  <MapPin className="h-3 w-3 text-bronze flex-shrink-0" />
                  {log.location}
                </span>
              )}
              {log.duration && (
                <span className="flex items-center gap-1 text-[0.75rem] text-fog">
                  <Clock className="h-3 w-3 text-haze flex-shrink-0" />
                  {log.duration} min
                </span>
              )}
            </div>
          </div>
          <span className="text-[0.7rem] text-haze flex-shrink-0 tabular-nums">
            {formatDate(log.date, { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {log.description && (
          <p className="mt-2.5 text-[0.8125rem] text-fog line-clamp-2">{log.description}</p>
        )}
      </div>
    </div>
  )
}
