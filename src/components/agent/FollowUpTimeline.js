'use client'

import {
  Phone,
  Eye,
  Users,
  MapPin,
  FileText,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
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

const outcomeIcons = {
  accepted: CheckCircle,
  deal_closed: CheckCircle,
  rejected: XCircle,
  client_declined: XCircle,
  rescheduled: Clock
}

export function FollowUpTimeline({ followUps }) {
  if (!followUps || followUps.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No follow-ups recorded yet</p>
        <p className="text-sm mt-1">Add a follow-up to track your progress</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

      <div className="space-y-6">
        {followUps.map((followUp, index) => {
          const Icon = typeIcons[followUp.type] || MoreHorizontal
          const OutcomeIcon = followUp.outcome
            ? outcomeIcons[followUp.outcome.toLowerCase()]
            : null

          return (
            <div key={followUp.id} className="relative flex gap-4">
              {/* Icon */}
              <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white ${getActivityTypeColor(followUp.type)} flex-shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-blue-950">
                      {followUp.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {followUp.type}
                      </Badge>
                      {followUp.outcome && (
                        <Badge
                          className={
                            followUp.outcome.toLowerCase().includes('accept') ||
                            followUp.outcome.toLowerCase().includes('closed')
                              ? 'bg-emerald-100 text-emerald-700'
                              : followUp.outcome.toLowerCase().includes('reject') ||
                                followUp.outcome.toLowerCase().includes('decline')
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }
                        >
                          {OutcomeIcon && <OutcomeIcon className="h-3 w-3 mr-1" />}
                          {followUp.outcome}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <div>{formatDate(followUp.createdAt)}</div>
                    {followUp.scheduledAt && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(followUp.scheduledAt)}
                      </div>
                    )}
                  </div>
                </div>

                {followUp.description && (
                  <p className="mt-2 text-sm text-slate-600">
                    {followUp.description}
                  </p>
                )}

                {followUp.notes && (
                  <div className="mt-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-500">
                    <span className="font-medium text-slate-600">Notes: </span>
                    {followUp.notes}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}



