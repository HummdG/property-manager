'use client'

import Link from 'next/link'
import {
  Phone,
  Eye,
  Users,
  MapPin,
  FileText,
  MoreHorizontal,
  Clock,
  MessageSquare
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate, getActivityTypeColor, getInitials } from '@/lib/utils'

const typeIcons = {
  CALL: Phone,
  VIEWING: Eye,
  MEETING: Users,
  SITE_VISIT: MapPin,
  PAPERWORK: FileText,
  OTHER: MoreHorizontal
}

export function AgentActivityFeed({ activities = [], showAgent = true, maxItems = 10 }) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No recent activities</p>
      </div>
    )
  }

  const displayActivities = activities.slice(0, maxItems)

  return (
    <div className="space-y-3">
      {displayActivities.map(activity => {
        const Icon = typeIcons[activity.type] || MoreHorizontal

        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
          >
            {/* Activity type icon */}
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0 ${getActivityTypeColor(activity.type)}`}>
              <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-medium text-blue-950 line-clamp-1">
                    {activity.title}
                  </h4>
                  {showAgent && activity.agent?.user && (
                    <Link
                      href={`/admin/agents/${activity.agent.id}`}
                      className="text-sm text-amber-600 hover:text-amber-700"
                    >
                      {activity.agent.user.name}
                    </Link>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {formatDate(activity.date, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {activity.description && (
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {activity.description}
                </p>
              )}

              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                {activity.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {activity.location}
                  </span>
                )}
                {activity.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {activity.duration} min
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function AgentActivityFeedCard({ activities = [], title = 'Recent Activity', viewAllHref }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
          >
            View all
          </Link>
        )}
      </CardHeader>
      <CardContent>
        <AgentActivityFeed activities={activities} />
      </CardContent>
    </Card>
  )
}

