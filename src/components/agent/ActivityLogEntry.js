'use client'

import {
  Phone,
  Eye,
  Users,
  MapPin,
  FileText,
  MoreHorizontal,
  Clock
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, getActivityTypeColor } from '@/lib/utils'

const typeIcons = {
  CALL: Phone,
  VIEWING: Eye,
  MEETING: Users,
  SITE_VISIT: MapPin,
  PAPERWORK: FileText,
  OTHER: MoreHorizontal
}

export function ActivityLogEntry({ log }) {
  const Icon = typeIcons[log.type] || MoreHorizontal

  return (
    <Card className="border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 ${getActivityTypeColor(log.type)}`}>
            <Icon className="h-6 w-6" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold text-blue-950">
                  {log.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                  <Badge variant="outline" className="text-xs">
                    {log.type}
                  </Badge>
                  {log.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {log.location}
                    </span>
                  )}
                  {log.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {log.duration} min
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-400 text-right">
                {formatDate(log.date, {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            {log.description && (
              <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                {log.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



