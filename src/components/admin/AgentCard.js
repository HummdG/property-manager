'use client'

import Link from 'next/link'
import {
  MessageSquare,
  CalendarDays,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { getInitials } from '@/lib/utils'

export function AgentCard({ agent }) {
  const subscriptionColors = {
    TRIAL: 'bg-slate-100 text-slate-600 border-slate-200',
    ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    PAST_DUE: 'bg-red-100 text-red-700 border-red-200',
    CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200'
  }

  return (
    <Card className="border-slate-200 hover:shadow-lg hover:border-amber-200 transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar and basic info */}
          <Avatar className="h-14 w-14 ring-2 ring-amber-400/20">
            <AvatarImage src={agent.user?.image} alt={agent.user?.name} />
            <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-500 text-white font-semibold">
              {getInitials(agent.user?.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link
                  href={`/admin/agents/${agent.id}`}
                  className="font-semibold text-blue-950 hover:text-amber-600 transition-colors"
                >
                  {agent.user?.name || 'Unknown Agent'}
                </Link>
                <p className="text-sm text-slate-500">{agent.user?.email}</p>
                {agent.companyName && (
                  <p className="text-sm text-slate-400 mt-0.5">{agent.companyName}</p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/agents/${agent.id}`}>
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/agents/${agent.id}?tab=logs`}>
                      View Logs
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/agents/${agent.id}?tab=locations`}>
                      View Locations
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/inquiries?agentId=${agent.id}`}>
                      View Inquiries
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Status badges */}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={agent.isAvailable
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
              }>
                {agent.isAvailable ? 'Active' : 'Inactive'}
              </Badge>
              {agent.subscription?.status && (
                <Badge variant="outline" className={subscriptionColors[agent.subscription.status]}>
                  {agent.subscription.plan?.name || agent.subscription.status}
                </Badge>
              )}
              {agent.rating > 0 && (
                <div className="flex items-center gap-1 text-sm text-amber-600">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{agent.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-semibold">{agent.stats?.totalInquiries || 0}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Inquiries</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-amber-600">
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold">{agent.stats?.openInquiries || 0}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Open</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-semibold">{agent.stats?.closedInquiries || 0}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Closed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-purple-600">
                  <CalendarDays className="h-4 w-4" />
                  <span className="font-semibold">{agent.stats?.recentLogs || 0}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Logs (7d)</p>
              </div>
            </div>

            {/* Service areas */}
            {agent.serviceAreas?.length > 0 && (
              <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">
                  {agent.serviceAreas.slice(0, 3).join(', ')}
                  {agent.serviceAreas.length > 3 && ` +${agent.serviceAreas.length - 3} more`}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

