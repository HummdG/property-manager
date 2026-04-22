'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  Check,
  X,
  Clock
} from 'lucide-react'
import { FollowUpTimeline, FollowUpForm } from '@/components/agent'
import {
  formatDate,
  formatCurrency
} from '@/lib/utils'
import { cn } from '@/lib/utils'

const statusActions = {
  OPEN: [
    { status: 'CONTACTED', label: 'Mark Contacted', icon: Phone },
    { status: 'MEETING_SCHEDULED', label: 'Schedule Meeting', icon: Calendar }
  ],
  CONTACTED: [
    { status: 'MEETING_SCHEDULED', label: 'Schedule Meeting', icon: Calendar },
    { status: 'FOLLOW_UP', label: 'Set Follow-up', icon: Clock }
  ],
  MEETING_SCHEDULED: [
    { status: 'FOLLOW_UP', label: 'Add Follow-up', icon: Clock },
    { status: 'ACCEPTED', label: 'Accept / Close Deal', icon: Check },
    { status: 'REJECTED', label: 'Reject', icon: X }
  ],
  FOLLOW_UP: [
    { status: 'MEETING_SCHEDULED', label: 'Schedule Meeting', icon: Calendar },
    { status: 'ACCEPTED', label: 'Accept / Close Deal', icon: Check },
    { status: 'REJECTED', label: 'Reject', icon: X }
  ]
}

const typePills = {
  RENTAL: 'bg-bronze/10 text-bronze border border-bronze/20',
  PURCHASE: 'bg-sable/5 text-pewter border border-wire',
  VALUATION: 'bg-linen text-fog border border-wire',
  GENERAL: 'bg-linen text-fog border border-wire',
}

const statusPills = {
  OPEN: 'bg-bronze/10 text-bronze border border-bronze/20',
  CONTACTED: 'bg-sable/5 text-pewter border border-wire',
  MEETING_SCHEDULED: 'bg-bronze/15 text-bronze border border-bronze/25',
  FOLLOW_UP: 'bg-linen text-fog border border-wire',
  ACCEPTED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  REJECTED: 'bg-red-50 text-red-600 border border-red-100',
}

export default function InquiryDetailPage({ params }) {
  const { id } = use(params)
  const router = useRouter()

  const [inquiry, setInquiry] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFollowUpForm, setShowFollowUpForm] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchInquiry()
  }, [id])

  const fetchInquiry = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/agent/inquiries/${id}`)
      if (!response.ok) {
        if (response.status === 404) throw new Error('Inquiry not found')
        throw new Error('Failed to fetch inquiry')
      }
      const data = await response.json()
      setInquiry(data.inquiry)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const updateStatus = async (newStatus) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/agent/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')
      const data = await response.json()
      setInquiry(data.inquiry)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleFollowUpAdded = (followUp) => {
    setInquiry(prev => ({
      ...prev,
      followUps: [followUp, ...(prev.followUps || [])]
    }))
    setShowFollowUpForm(false)
    fetchInquiry()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-bronze" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/agent/inquiries" className="inline-flex items-center gap-2 text-[0.8125rem] text-fog hover:text-bronze transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to inquiries
        </Link>
        <div className="p-5 border border-red-200 bg-red-50 text-[0.8125rem] text-red-600 text-center">
          {error}
        </div>
      </div>
    )
  }

  if (!inquiry) return null

  const availableActions = statusActions[inquiry.status] || []

  return (
    <div className="space-y-5">
      {/* Back link */}
      <Link href="/agent/inquiries" className="inline-flex items-center gap-2 text-[0.8125rem] text-fog hover:text-bronze transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to inquiries
      </Link>

      {/* Header */}
      <div className="border-b border-wire pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Agent Portal</p>
            <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">{inquiry.clientName}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={cn('text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5', typePills[inquiry.type] || 'bg-linen text-fog border border-wire')}>
                {inquiry.type}
              </span>
              <span className={cn('text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5', statusPills[inquiry.status] || 'bg-linen text-fog border border-wire')}>
                {inquiry.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-[0.8125rem] text-fog mt-2">
              Created {formatDate(inquiry.createdAt)}
              {inquiry.source && ` · Source: ${inquiry.source}`}
            </p>
          </div>
          <button
            onClick={() => setShowFollowUpForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-[0.75rem] uppercase tracking-[0.1em] font-medium bg-sable text-cream hover:bg-cobalt transition-colors flex-shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Follow-up
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">

          {/* Status actions */}
          {availableActions.length > 0 && (
            <div className="border border-wire bg-cream">
              <div className="px-5 py-4 border-b border-wire">
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Quick Actions</p>
              </div>
              <div className="p-5 flex flex-wrap gap-2">
                {availableActions.map(action => (
                  <button
                    key={action.status}
                    onClick={() => updateStatus(action.status)}
                    disabled={isUpdating}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-[0.75rem] uppercase tracking-[0.1em] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
                      action.status === 'ACCEPTED'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : action.status === 'REJECTED'
                        ? 'border border-red-200 text-red-600 bg-red-50 hover:bg-red-100'
                        : 'bg-sable text-cream hover:bg-cobalt'
                    )}
                  >
                    {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <action.icon className="h-3.5 w-3.5" />}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message / Notes */}
          {(inquiry.message || inquiry.notes) && (
            <div className="border border-wire bg-cream">
              <div className="px-5 py-4 border-b border-wire">
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Details</p>
              </div>
              <div className="p-5 space-y-4">
                {inquiry.message && (
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-2">Message</p>
                    <p className="text-[0.8125rem] text-sable whitespace-pre-wrap">{inquiry.message}</p>
                  </div>
                )}
                {inquiry.notes && (
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.12em] text-fog font-medium mb-2">Notes</p>
                    <p className="text-[0.8125rem] text-sable whitespace-pre-wrap">{inquiry.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Follow-up timeline */}
          <div className="border border-wire bg-cream">
            <div className="px-5 py-4 border-b border-wire flex items-center justify-between">
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Follow-up History</p>
              <button
                onClick={() => setShowFollowUpForm(true)}
                className="flex items-center gap-1.5 text-[0.7rem] uppercase tracking-[0.1em] font-medium text-fog hover:text-bronze transition-colors"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>
            <div className="p-5">
              <FollowUpTimeline followUps={inquiry.followUps} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">

          {/* Contact info */}
          <div className="border border-wire bg-cream">
            <div className="px-5 py-4 border-b border-wire">
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Contact Information</p>
            </div>
            <div className="p-5 space-y-3">
              <a
                href={`mailto:${inquiry.clientEmail}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 border border-wire bg-linen flex items-center justify-center flex-shrink-0 group-hover:border-bronze/40 transition-colors">
                  <Mail className="h-4 w-4 text-bronze" />
                </div>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.08em] text-fog font-medium">Email</p>
                  <p className="text-[0.8125rem] text-sable group-hover:text-bronze transition-colors">{inquiry.clientEmail}</p>
                </div>
              </a>
              {inquiry.clientPhone && (
                <a
                  href={`tel:${inquiry.clientPhone}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 border border-wire bg-linen flex items-center justify-center flex-shrink-0 group-hover:border-bronze/40 transition-colors">
                    <Phone className="h-4 w-4 text-bronze" />
                  </div>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.08em] text-fog font-medium">Phone</p>
                    <p className="text-[0.8125rem] text-sable group-hover:text-bronze transition-colors">{inquiry.clientPhone}</p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Requirements */}
          {(inquiry.budget || inquiry.preferredArea || inquiry.scheduledAt) && (
            <div className="border border-wire bg-cream">
              <div className="px-5 py-4 border-b border-wire">
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Requirements</p>
              </div>
              <div className="p-5 space-y-3">
                {inquiry.budget && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 border border-wire bg-linen flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-4 w-4 text-bronze" />
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.08em] text-fog font-medium">Budget</p>
                      <p className="text-[0.8125rem] font-medium text-sable">{formatCurrency(inquiry.budget * 100)}</p>
                    </div>
                  </div>
                )}
                {inquiry.preferredArea && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 border border-wire bg-linen flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-4 w-4 text-bronze" />
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.08em] text-fog font-medium">Preferred Area</p>
                      <p className="text-[0.8125rem] font-medium text-sable">{inquiry.preferredArea}</p>
                    </div>
                  </div>
                )}
                {inquiry.scheduledAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 border border-wire bg-linen flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-bronze" />
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.08em] text-fog font-medium">Scheduled</p>
                      <p className="text-[0.8125rem] font-medium text-sable">{formatDate(inquiry.scheduledAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Linked property */}
          {inquiry.property && (
            <div className="border border-wire bg-cream">
              <div className="px-5 py-4 border-b border-wire">
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Linked Property</p>
              </div>
              <div className="p-5">
                <div className="px-4 py-3 border border-wire bg-linen">
                  <p className="text-[0.8125rem] font-medium text-sable">{inquiry.property.name}</p>
                  <p className="text-[0.75rem] text-fog mt-0.5">{inquiry.property.address}</p>
                  {inquiry.property.city && (
                    <p className="text-[0.75rem] text-fog">{inquiry.property.city}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Follow-up form modal */}
      <FollowUpForm
        inquiryId={id}
        open={showFollowUpForm}
        onOpenChange={setShowFollowUpForm}
        onSuccess={handleFollowUpAdded}
      />
    </div>
  )
}
