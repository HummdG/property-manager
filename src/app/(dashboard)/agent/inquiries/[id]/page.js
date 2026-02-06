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
  Edit,
  Plus,
  Check,
  X,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FollowUpTimeline, FollowUpForm } from '@/components/agent'
import {
  formatDate,
  formatCurrency,
  getInquiryStatusColor,
  getInquiryTypeColor
} from '@/lib/utils'

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
        if (response.status === 404) {
          throw new Error('Inquiry not found')
        }
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
    // Refetch to get updated status
    fetchInquiry()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          href="/agent/inquiries"
          className="inline-flex items-center text-slate-500 hover:text-blue-950"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to inquiries
        </Link>
        <div className="p-6 bg-red-50 text-red-600 rounded-lg text-center">
          {error}
        </div>
      </div>
    )
  }

  if (!inquiry) return null

  const availableActions = statusActions[inquiry.status] || []

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/agent/inquiries"
        className="inline-flex items-center text-slate-500 hover:text-blue-950 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to inquiries
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-blue-950">{inquiry.clientName}</h1>
            <Badge className={getInquiryTypeColor(inquiry.type)}>
              {inquiry.type}
            </Badge>
            <Badge variant="outline" className={getInquiryStatusColor(inquiry.status)}>
              {inquiry.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-slate-500">
            Created on {formatDate(inquiry.createdAt)}
            {inquiry.source && ` • Source: ${inquiry.source}`}
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFollowUpForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Follow-up
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status actions */}
          {availableActions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-slate-500">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {availableActions.map(action => (
                  <Button
                    key={action.status}
                    variant={action.status === 'REJECTED' ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => updateStatus(action.status)}
                    disabled={isUpdating}
                    className={
                      action.status === 'ACCEPTED'
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : action.status === 'REJECTED'
                        ? 'text-red-600 hover:bg-red-50 border-red-200'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                    }
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Message/Notes */}
          {(inquiry.message || inquiry.notes) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {inquiry.message && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">Message</h4>
                    <p className="text-slate-700 whitespace-pre-wrap">{inquiry.message}</p>
                  </div>
                )}
                {inquiry.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">Notes</h4>
                    <p className="text-slate-700 whitespace-pre-wrap">{inquiry.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Follow-up timeline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Follow-up History</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFollowUpForm(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              <FollowUpTimeline followUps={inquiry.followUps} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a
                href={`mailto:${inquiry.clientEmail}`}
                className="flex items-center gap-3 text-slate-600 hover:text-amber-600 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="font-medium">{inquiry.clientEmail}</p>
                </div>
              </a>
              {inquiry.clientPhone && (
                <a
                  href={`tel:${inquiry.clientPhone}`}
                  className="flex items-center gap-3 text-slate-600 hover:text-amber-600 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="font-medium">{inquiry.clientPhone}</p>
                  </div>
                </a>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {inquiry.budget && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Budget</p>
                    <p className="font-medium text-blue-950">{formatCurrency(inquiry.budget * 100)}</p>
                  </div>
                </div>
              )}
              {inquiry.preferredArea && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Preferred Area</p>
                    <p className="font-medium text-blue-950">{inquiry.preferredArea}</p>
                  </div>
                </div>
              )}
              {inquiry.scheduledAt && (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Scheduled</p>
                    <p className="font-medium text-blue-950">{formatDate(inquiry.scheduledAt)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Property (if linked) */}
          {inquiry.property && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Linked Property</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-blue-950">{inquiry.property.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">{inquiry.property.address}</p>
                  {inquiry.property.city && (
                    <p className="text-sm text-slate-500">{inquiry.property.city}</p>
                  )}
                </div>
              </CardContent>
            </Card>
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


