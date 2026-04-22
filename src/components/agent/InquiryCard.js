'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Calendar, MessageSquare, CalendarDays } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const statusConfig = {
  OPEN: 'text-bronze border-bronze/40 bg-bronze/5',
  CONTACTED: 'text-pewter border-wire bg-linen',
  MEETING_SCHEDULED: 'text-sable border-wire bg-linen',
  FOLLOW_UP: 'text-fog border-wire bg-linen',
  ACCEPTED: 'text-emerald-700 border-emerald-300 bg-emerald-50',
  REJECTED: 'text-red-600 border-red-200 bg-red-50',
  CLOSED: 'text-haze border-wire bg-linen',
}

const typeConfig = {
  RENT: 'text-bronze border-bronze/40 bg-bronze/5',
  SALE: 'text-pewter border-wire bg-linen',
}

export function InquiryCard({ inquiry }) {
  const statusCls = statusConfig[inquiry.status] || 'text-haze border-wire bg-linen'
  const typeCls = typeConfig[inquiry.type] || 'text-haze border-wire bg-linen'

  return (
    <Link href={`/agent/inquiries/${inquiry.id}`} className="block group">
      <div className="border border-wire bg-cream group-hover:bg-linen transition-colors">
        <div className="px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
                <h3 className="text-[0.9375rem] font-medium text-sable truncate">
                  {inquiry.clientName}
                </h3>
                <span className={`inline-flex items-center text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 border ${typeCls}`}>
                  {inquiry.type}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[0.75rem] text-fog">
                  <Mail className="h-3 w-3 flex-shrink-0 text-haze" />
                  <span className="truncate">{inquiry.clientEmail}</span>
                </div>
                {inquiry.clientPhone && (
                  <div className="flex items-center gap-2 text-[0.75rem] text-fog">
                    <Phone className="h-3 w-3 flex-shrink-0 text-haze" />
                    <span>{inquiry.clientPhone}</span>
                  </div>
                )}
                {(inquiry.property?.name || inquiry.preferredArea) && (
                  <div className="flex items-center gap-2 text-[0.75rem] text-fog">
                    <MapPin className="h-3 w-3 flex-shrink-0 text-bronze" />
                    <span className="truncate">
                      {inquiry.property?.name || inquiry.preferredArea}
                    </span>
                  </div>
                )}
              </div>

              {inquiry.message && (
                <div className="mt-3 pt-3 border-t border-wire flex items-start gap-2 text-[0.75rem] text-haze">
                  <MessageSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <p className="line-clamp-2">{inquiry.message}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className={`inline-flex items-center text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 border ${statusCls}`}>
                {inquiry.status.replace(/_/g, ' ')}
              </span>
              <div className="flex items-center gap-1.5 text-[0.7rem] text-haze">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(inquiry.createdAt)}</span>
              </div>
              {inquiry.followUps?.length > 0 && (
                <div className="flex items-center gap-1.5 text-[0.7rem] text-fog">
                  <CalendarDays className="h-3 w-3" />
                  <span>{inquiry.followUps.length} follow-up{inquiry.followUps.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
