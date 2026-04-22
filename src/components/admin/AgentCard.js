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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function AgentCard({ agent }) {
  const initials = getInitials(agent.user?.name)

  return (
    <div className="bg-cream border border-wire hover:border-bronze/30 transition-colors duration-200">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Initials block */}
          <div className="w-11 h-11 bg-sable flex items-center justify-center flex-shrink-0">
            <span className="font-display text-[0.875rem] font-medium text-cream tracking-wide">
              {initials}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/admin/agents/${agent.id}`}
                  className="font-display text-[1rem] font-medium text-sable hover:text-bronze transition-colors duration-150 leading-tight block truncate"
                >
                  {agent.user?.name || 'Unknown Agent'}
                </Link>
                <p className="text-[0.75rem] text-fog mt-0.5 truncate">{agent.user?.email}</p>
                {agent.companyName && (
                  <p className="text-[0.75rem] text-bronze mt-0.5 truncate">{agent.companyName}</p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-7 h-7 flex items-center justify-center text-haze hover:text-sable transition-colors flex-shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-cream border border-wire rounded-none shadow-none min-w-[160px] p-0"
                >
                  {[
                    { label: 'View Details', href: `/admin/agents/${agent.id}` },
                    { label: 'View Logs', href: `/admin/agents/${agent.id}?tab=logs` },
                    { label: 'View Locations', href: `/admin/agents/${agent.id}?tab=locations` },
                    { label: 'View Inquiries', href: `/admin/inquiries?agentId=${agent.id}` },
                  ].map((item) => (
                    <DropdownMenuItem key={item.label} asChild className="rounded-none">
                      <Link
                        href={item.href}
                        className="px-4 py-2.5 text-[0.75rem] text-pewter hover:text-sable hover:bg-linen cursor-pointer block w-full border-b border-wire last:border-0"
                      >
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Status + Rating */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className={cn(
                'inline-flex items-center px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] font-medium border',
                agent.isAvailable
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-linen text-fog border-wire'
              )}>
                {agent.isAvailable ? 'Active' : 'Inactive'}
              </span>
              {agent.approvalStatus && (
                <span className={cn(
                  'inline-flex items-center px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] font-medium border',
                  agent.approvalStatus === 'APPROVED' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  agent.approvalStatus === 'SUBMITTED' && 'bg-amber-50 text-amber-700 border-amber-200',
                  agent.approvalStatus === 'REJECTED' && 'bg-red-50 text-red-600 border-red-200',
                  agent.approvalStatus === 'DRAFT' && 'bg-linen text-fog border-wire',
                )}>
                  {agent.approvalStatus === 'SUBMITTED' ? 'Pending Review' : agent.approvalStatus.charAt(0) + agent.approvalStatus.slice(1).toLowerCase()}
                </span>
              )}
              {agent.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-bronze fill-bronze" />
                  <span className="text-[0.75rem] text-pewter font-medium">{agent.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-px bg-wire border-t border-wire mt-5">
          {[
            { icon: MessageSquare, value: agent.stats?.totalInquiries || 0, label: 'Inquiries' },
            { icon: Clock, value: agent.stats?.openInquiries || 0, label: 'Open' },
            { icon: CheckCircle, value: agent.stats?.closedInquiries || 0, label: 'Closed' },
            { icon: CalendarDays, value: agent.stats?.recentLogs || 0, label: 'Logs (7d)' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-linen px-3 py-3 text-center">
              <p className="font-display text-[1rem] font-light text-sable leading-none">{value}</p>
              <p className="text-[0.6rem] uppercase tracking-[0.08em] text-fog mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Service areas */}
        {agent.serviceAreas?.length > 0 && (
          <div className="flex items-center gap-2 mt-3.5">
            <MapPin className="h-3 w-3 text-bronze flex-shrink-0" />
            <span className="text-[0.75rem] text-fog truncate">
              {agent.serviceAreas.slice(0, 3).join(', ')}
              {agent.serviceAreas.length > 3 && (
                <span className="text-haze"> +{agent.serviceAreas.length - 3} more</span>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
