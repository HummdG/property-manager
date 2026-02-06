'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Calendar, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, getInquiryStatusColor, getInquiryTypeColor } from '@/lib/utils'

export function InquiryCard({ inquiry, showAgent = false }) {
  return (
    <Link href={`/agent/inquiries/${inquiry.id}`}>
      <Card className="border-slate-200 hover:shadow-lg hover:border-amber-200 transition-all duration-300 cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Client info */}
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-blue-950 truncate">
                  {inquiry.clientName}
                </h3>
                <Badge className={getInquiryTypeColor(inquiry.type)}>
                  {inquiry.type}
                </Badge>
              </div>

              {/* Contact details */}
              <div className="space-y-1 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{inquiry.clientEmail}</span>
                </div>
                {inquiry.clientPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{inquiry.clientPhone}</span>
                  </div>
                )}
                {(inquiry.property?.name || inquiry.preferredArea) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">
                      {inquiry.property?.name || inquiry.preferredArea}
                    </span>
                  </div>
                )}
              </div>

              {/* Message preview */}
              {inquiry.message && (
                <div className="mt-3 flex items-start gap-2 text-sm text-slate-400">
                  <MessageSquare className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <p className="line-clamp-2">{inquiry.message}</p>
                </div>
              )}
            </div>

            {/* Status and date */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <Badge variant="outline" className={getInquiryStatusColor(inquiry.status)}>
                {inquiry.status.replace('_', ' ')}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(inquiry.createdAt)}</span>
              </div>
              {inquiry.followUps?.length > 0 && (
                <span className="text-xs text-slate-400">
                  {inquiry.followUps.length} follow-up{inquiry.followUps.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}


