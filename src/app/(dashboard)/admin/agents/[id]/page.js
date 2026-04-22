'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Loader2, ArrowLeft, MessageSquare, CalendarDays, MapPin, Star,
  Mail, Phone, Building2, FileText, CheckCircle, Clock, TrendingUp,
  Calendar, Filter, Shield, Download, AlertCircle, ShieldCheck, ShieldX
} from 'lucide-react'
import { AgentActivityFeed, LocationTimeline, LocationStats } from '@/components/admin'
import { StatsCard } from '@/components/dashboard'
import { formatDate, getInitials, getInquiryStatusColor, getInquiryTypeColor, cn } from '@/lib/utils'

const DOC_TYPE_LABELS = {
  RERA_BROKER_CARD: 'RERA Broker Card',
  BRN: 'BRN',
  LABOUR_CARD: 'Labour Card',
  EMPLOYMENT_VISA: 'Employment Visa',
  EMIRATES_ID: 'Emirates ID',
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'documents', label: 'Documents', icon: Shield },
  { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
  { id: 'logs', label: 'Activity Logs', icon: CalendarDays },
  { id: 'locations', label: 'Locations', icon: MapPin }
]

const activityTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'CALL', label: 'Calls' },
  { value: 'VIEWING', label: 'Viewings' },
  { value: 'MEETING', label: 'Meetings' },
  { value: 'SITE_VISIT', label: 'Site Visits' },
  { value: 'PAPERWORK', label: 'Paperwork' },
  { value: 'OTHER', label: 'Other' }
]

const inquiryStatusPills = {
  OPEN: 'bg-bronze/10 text-bronze border border-bronze/20',
  CONTACTED: 'bg-sable/5 text-pewter border border-wire',
  MEETING_SCHEDULED: 'bg-bronze/15 text-bronze border border-bronze/25',
  FOLLOW_UP: 'bg-sable/5 text-pewter border border-wire',
  ACCEPTED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  REJECTED: 'bg-red-50 text-red-600 border border-red-100',
  CLOSED: 'bg-sable/5 text-pewter border border-wire'
}


export default function AgentDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const agentId = params.id

  const [agent, setAgent] = useState(null)
  const [stats, setStats] = useState(null)
  const [recentInquiries, setRecentInquiries] = useState([])
  const [recentLogs, setRecentLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview')
  const [logs, setLogs] = useState([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [logsPagination, setLogsPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [logFilters, setLogFilters] = useState({ type: 'all', dateFrom: '', dateTo: '' })
  const [logStats, setLogStats] = useState(null)

  const [locations, setLocations] = useState([])
  const [locationsLoading, setLocationsLoading] = useState(false)
  const [locationsPagination, setLocationsPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 })
  const [locationFilters, setLocationFilters] = useState({ date: '' })
  const [locationStats, setLocationStats] = useState(null)

  const [documents, setDocuments] = useState([])
  const [documentsLoading, setDocumentsLoading] = useState(false)
  const [rejectionNote, setRejectionNote] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState(null)
  const [reviewSuccess, setReviewSuccess] = useState(null)

  const fetchAgent = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/agents/${agentId}`)
      if (!response.ok) throw new Error('Failed to fetch agent')
      const data = await response.json()
      setAgent(data.agent)
      setStats(data.stats)
      setRecentInquiries(data.recentInquiries)
      setRecentLogs(data.recentLogs)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [agentId])

  const fetchLogs = useCallback(async () => {
    if (activeTab !== 'logs') return
    setLogsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', logsPagination.page.toString())
      params.set('limit', logsPagination.limit.toString())
      if (logFilters.type !== 'all') params.set('type', logFilters.type)
      if (logFilters.dateFrom) params.set('dateFrom', logFilters.dateFrom)
      if (logFilters.dateTo) params.set('dateTo', logFilters.dateTo)

      const response = await fetch(`/api/admin/agents/${agentId}/logs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch logs')
      const data = await response.json()
      setLogs(data.logs)
      setLogsPagination(data.pagination)
      setLogStats(data.stats)
    } catch (err) {
      console.error('Failed to fetch logs:', err)
    } finally {
      setLogsLoading(false)
    }
  }, [agentId, activeTab, logFilters, logsPagination.page, logsPagination.limit])

  const fetchLocations = useCallback(async () => {
    if (activeTab !== 'locations') return
    setLocationsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', locationsPagination.page.toString())
      params.set('limit', locationsPagination.limit.toString())
      if (locationFilters.date) params.set('date', locationFilters.date)

      const response = await fetch(`/api/admin/agents/${agentId}/locations?${params}`)
      if (!response.ok) throw new Error('Failed to fetch locations')
      const data = await response.json()
      setLocations(data.locations)
      setLocationsPagination(data.pagination)
      setLocationStats(data.stats)
    } catch (err) {
      console.error('Failed to fetch locations:', err)
    } finally {
      setLocationsLoading(false)
    }
  }, [agentId, activeTab, locationFilters, locationsPagination.page, locationsPagination.limit])

  const fetchDocuments = useCallback(async () => {
    if (activeTab !== 'documents') return
    setDocumentsLoading(true)
    try {
      const response = await fetch(`/api/admin/agents/${agentId}/documents`)
      if (!response.ok) throw new Error('Failed to fetch documents')
      const data = await response.json()
      setDocuments(data.documents)
    } catch (err) {
      console.error('Failed to fetch documents:', err)
    } finally {
      setDocumentsLoading(false)
    }
  }, [agentId, activeTab])

  async function handleReview(action) {
    if (action === 'REJECT' && !rejectionNote.trim()) {
      setReviewError('Please provide a rejection reason')
      return
    }
    setReviewLoading(true)
    setReviewError(null)
    setReviewSuccess(null)
    try {
      const res = await fetch(`/api/admin/agents/${agentId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, rejectionNote: rejectionNote.trim() || undefined }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Review action failed')
      }
      setReviewSuccess(action === 'APPROVE' ? 'Agent approved successfully' : 'Agent rejected')
      setRejectionNote('')
      await fetchAgent()
    } catch (err) {
      setReviewError(err.message)
    } finally {
      setReviewLoading(false)
    }
  }

  useEffect(() => { fetchAgent() }, [fetchAgent])
  useEffect(() => { fetchLogs() }, [fetchLogs])
  useEffect(() => { fetchLocations() }, [fetchLocations])
  useEffect(() => { fetchDocuments() }, [fetchDocuments])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    router.push(`/admin/agents/${agentId}?tab=${tab}`, { scroll: false })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-bronze" />
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="space-y-4">
        <Link href="/admin/agents" className="inline-flex items-center gap-2 text-[0.75rem] text-fog hover:text-sable transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Agents
        </Link>
        <div className="px-5 py-4 border border-red-200 bg-red-50 text-[0.8125rem] text-red-600 text-center">
          {error || 'Agent not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <Link href="/admin/agents" className="inline-flex items-center gap-2 text-[0.75rem] text-fog hover:text-sable transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Agents
      </Link>

      {/* Agent header */}
      <div className="border border-wire bg-cream">
        <div className="px-6 py-5 border-b border-wire bg-linen flex flex-col sm:flex-row items-start gap-5">
          <div className="w-16 h-16 bg-bronze/15 border border-bronze/20 flex items-center justify-center flex-shrink-0 text-[1.5rem] font-medium text-bronze uppercase">
            {getInitials(agent.user?.name)}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-[1.75rem] font-light text-sable leading-tight">{agent.user?.name}</h1>
                {agent.companyName && (
                  <p className="text-[0.8125rem] text-fog mt-0.5">{agent.companyName}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                <span className={cn(
                  'text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2.5 py-1 border',
                  agent.isAvailable ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-linen text-fog border-wire'
                )}>
                  {agent.isAvailable ? 'Active' : 'Inactive'}
                </span>
                {agent.approvalStatus && (
                  <span className={cn(
                    'text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2.5 py-1 border',
                    agent.approvalStatus === 'APPROVED' && 'bg-emerald-50 text-emerald-700 border-emerald-100',
                    agent.approvalStatus === 'SUBMITTED' && 'bg-amber-50 text-amber-700 border-amber-200',
                    agent.approvalStatus === 'REJECTED' && 'bg-red-50 text-red-600 border-red-200',
                    agent.approvalStatus === 'DRAFT' && 'bg-linen text-fog border-wire',
                  )}>
                    {agent.approvalStatus === 'SUBMITTED' ? 'Pending Review' : agent.approvalStatus.charAt(0) + agent.approvalStatus.slice(1).toLowerCase()}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="flex items-center gap-2 text-[0.75rem] text-fog">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{agent.user?.email}</span>
              </div>
              {agent.user?.phone && (
                <div className="flex items-center gap-2 text-[0.75rem] text-fog">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{agent.user.phone}</span>
                </div>
              )}
              {agent.licenseNumber && (
                <div className="flex items-center gap-2 text-[0.75rem] text-fog">
                  <FileText className="h-3.5 w-3.5" />
                  <span>{agent.licenseNumber}</span>
                </div>
              )}
              {agent.rating > 0 && (
                <div className="flex items-center gap-2 text-[0.75rem] text-bronze">
                  <Star className="h-3.5 w-3.5 fill-bronze" />
                  <span>{agent.rating.toFixed(1)} rating</span>
                </div>
              )}
            </div>

            {agent.serviceAreas?.length > 0 && (
              <div className="flex items-center gap-2 mt-3 text-[0.75rem] text-fog">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{agent.serviceAreas.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-3.5 text-[0.7rem] uppercase tracking-[0.1em] font-medium border-r border-wire transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-sable text-cream'
                    : 'bg-cream text-fog hover:text-sable hover:bg-linen'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Profile Review panel — shown when profile is SUBMITTED (or always for reference) */}
          {agent.approvalStatus !== 'APPROVED' && (
            <div className="border border-wire bg-cream">
              <div className="px-5 py-4 border-b border-wire flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-bronze" />
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Profile Review</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-wide text-fog mb-1">Status</p>
                    <span className={cn(
                      'text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2.5 py-1 border',
                      agent.approvalStatus === 'SUBMITTED' && 'bg-amber-50 text-amber-700 border-amber-200',
                      agent.approvalStatus === 'REJECTED' && 'bg-red-50 text-red-600 border-red-200',
                      agent.approvalStatus === 'DRAFT' && 'bg-linen text-fog border-wire',
                    )}>
                      {agent.approvalStatus === 'SUBMITTED' ? 'Pending Review' : (agent.approvalStatus?.charAt(0) + agent.approvalStatus?.slice(1).toLowerCase())}
                    </span>
                  </div>
                  {agent.submittedAt && (
                    <div className="text-right">
                      <p className="text-[0.65rem] uppercase tracking-wide text-fog mb-1">Submitted</p>
                      <p className="text-xs text-sable">{formatDate(agent.submittedAt)}</p>
                    </div>
                  )}
                </div>

                {agent.approvalStatus === 'SUBMITTED' && (
                  <>
                    <button
                      onClick={() => handleTabChange('documents')}
                      className="text-xs text-bronze hover:text-sable flex items-center gap-1.5 transition-colors"
                    >
                      <Shield className="h-3 w-3" />
                      View uploaded documents
                    </button>

                    <div className="border-t border-wire pt-4 space-y-3">
                      <div>
                        <label className="text-[0.65rem] uppercase tracking-wide text-fog mb-1.5 block">
                          Rejection reason (required if rejecting)
                        </label>
                        <textarea
                          value={rejectionNote}
                          onChange={(e) => { setRejectionNote(e.target.value); setReviewError(null) }}
                          placeholder="Explain why the profile is being rejected…"
                          rows={2}
                          className="w-full border border-wire bg-linen px-3 py-2 text-xs text-sable placeholder:text-fog resize-none outline-none focus:border-bronze transition-colors"
                        />
                      </div>

                      {reviewError && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />{reviewError}
                        </p>
                      )}
                      {reviewSuccess && (
                        <p className="text-xs text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />{reviewSuccess}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReview('REJECT')}
                          disabled={reviewLoading}
                          className="flex items-center gap-1.5 px-4 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                          {reviewLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldX className="h-3 w-3" />}
                          Reject
                        </button>
                        <button
                          onClick={() => handleReview('APPROVE')}
                          disabled={reviewLoading}
                          className="flex items-center gap-1.5 px-4 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                        >
                          {reviewLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                          Approve
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {agent.approvalStatus === 'REJECTED' && agent.approvalNote && (
                  <div className="bg-red-50 border border-red-200 p-3 text-xs text-red-600">
                    <p className="font-medium mb-1">Rejection reason</p>
                    <p>{agent.approvalNote}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-wire border border-wire">
            <StatsCard title="Total Inquiries" value={stats?.inquiries.total || 0} icon={MessageSquare} subtitle={`${stats?.inquiries.open || 0} open`} />
            <StatsCard title="Closed Deals" value={stats?.inquiries.closed || 0} icon={CheckCircle} subtitle={`${stats?.inquiries.closedThisMonth || 0} this month`} />
            <StatsCard title="Activity Logs" value={stats?.logs.total || 0} icon={CalendarDays} subtitle={`${stats?.logs.today || 0} today`} />
            <StatsCard title="Location Logs" value={stats?.locations.total || 0} icon={MapPin} subtitle={`${stats?.locations.today || 0} today`} />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Inquiry type breakdown */}
            <div className="border border-wire bg-cream">
              <div className="px-5 py-4 border-b border-wire">
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Inquiries by Type</p>
              </div>
              <div className="p-5 grid grid-cols-2 gap-px bg-wire border border-wire">
                {[
                  { label: 'Rent', value: stats?.inquiries.byType?.RENT || 0 },
                  { label: 'Sale', value: stats?.inquiries.byType?.SALE || 0 }
                ].map(({ label, value }) => (
                  <div key={label} className="bg-cream p-4 text-center">
                    <p className="font-display text-[1.75rem] font-light text-sable leading-none">{value}</p>
                    <p className="text-[0.65rem] uppercase tracking-[0.08em] text-fog mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiry status breakdown */}
            <div className="border border-wire bg-cream">
              <div className="px-5 py-4 border-b border-wire">
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Inquiries by Status</p>
              </div>
              <div className="p-5 grid grid-cols-2 gap-2">
                {Object.entries(stats?.inquiries.byStatus || {}).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between px-3 py-2 border border-wire">
                    <span className={cn('text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5', inquiryStatusPills[status] || 'bg-linen text-fog border border-wire')}>
                      {status.replace('_', ' ')}
                    </span>
                    <span className="font-display text-[1.125rem] font-light text-sable">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Recent inquiries */}
            <div className="border border-wire bg-cream">
              <div className="flex items-center justify-between px-5 py-4 border-b border-wire">
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Recent Inquiries</p>
                <button onClick={() => handleTabChange('inquiries')} className="text-[0.75rem] text-bronze hover:text-sable transition-colors">
                  View all
                </button>
              </div>
              <div className="divide-y divide-wire/60">
                {recentInquiries.length === 0 ? (
                  <p className="text-[0.8125rem] text-haze py-8 text-center">No inquiries yet</p>
                ) : (
                  recentInquiries.map(inquiry => (
                    <Link
                      key={inquiry.id}
                      href={`/admin/inquiries?search=${inquiry.clientEmail}`}
                      className="flex items-start justify-between gap-3 px-5 py-3.5 hover:bg-linen transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.8125rem] font-medium text-sable truncate">{inquiry.clientName}</p>
                        <p className="text-[0.75rem] text-fog truncate mt-0.5">
                          {inquiry.property?.name || inquiry.preferredArea || 'General inquiry'}
                        </p>
                        <p className="text-[0.7rem] text-haze mt-0.5">{formatDate(inquiry.createdAt)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 bg-bronze/10 text-bronze border border-bronze/20">
                          {inquiry.type}
                        </span>
                        <span className={cn('text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5', inquiryStatusPills[inquiry.status] || 'bg-linen text-fog border border-wire')}>
                          {inquiry.status.replace('_', ' ')}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Recent activity */}
            <div className="border border-wire bg-cream">
              <div className="flex items-center justify-between px-5 py-4 border-b border-wire">
                <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Recent Activity</p>
                <button onClick={() => handleTabChange('logs')} className="text-[0.75rem] text-bronze hover:text-sable transition-colors">
                  View all
                </button>
              </div>
              <div className="p-5">
                <AgentActivityFeed activities={recentLogs} showAgent={false} maxItems={5} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents tab */}
      {activeTab === 'documents' && (
        <div className="border border-wire bg-cream">
          <div className="px-5 py-4 border-b border-wire flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-bronze" />
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Verification Documents</p>
          </div>
          {documentsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-bronze" />
            </div>
          ) : documents.length === 0 ? (
            <div className="py-12 text-center">
              <Shield className="h-8 w-8 text-fog mx-auto mb-3" />
              <p className="text-xs text-fog">No documents uploaded</p>
            </div>
          ) : (
            <div className="divide-y divide-wire">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 px-5 py-4">
                  <FileText className="h-4 w-4 text-bronze flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-sable font-medium truncate">{doc.fileName}</p>
                    <p className="text-[0.65rem] text-fog mt-0.5">{DOC_TYPE_LABELS[doc.type] || doc.type}</p>
                    <p className="text-[0.65rem] text-haze mt-0.5">{formatDate(doc.uploadedAt)}</p>
                  </div>
                  {doc.fileSize && (
                    <span className="text-[0.65rem] text-fog whitespace-nowrap">
                      {(doc.fileSize / 1024).toFixed(0)} KB
                    </span>
                  )}
                  <a
                    href={doc.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.08em] font-medium border border-wire bg-linen hover:bg-wire text-fog hover:text-sable transition-colors"
                  >
                    <Download className="h-3 w-3" />
                    View
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Inquiries tab */}
      {activeTab === 'inquiries' && (
        <div className="border border-wire bg-cream">
          <div className="px-5 py-4 border-b border-wire">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">All Inquiries</p>
          </div>
          <div className="p-8 text-center">
            <Link
              href={`/admin/inquiries?agentId=${agentId}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-[0.75rem] uppercase tracking-[0.1em] font-medium bg-sable text-cream hover:bg-cobalt transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              View All Inquiries for this Agent
            </Link>
          </div>
        </div>
      )}

      {/* Logs tab */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="border border-wire bg-cream">
            <div className="px-5 py-4 border-b border-wire">
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Filters</p>
            </div>
            <div className="px-5 py-4 flex flex-wrap gap-3 items-center">
              <select
                value={logFilters.type}
                onChange={(e) => { setLogFilters(prev => ({ ...prev, type: e.target.value })); setLogsPagination(prev => ({ ...prev, page: 1 })) }}
                className="bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors"
              >
                {activityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-haze" />
                <input
                  type="date"
                  value={logFilters.dateFrom}
                  onChange={(e) => { setLogFilters(prev => ({ ...prev, dateFrom: e.target.value })); setLogsPagination(prev => ({ ...prev, page: 1 })) }}
                  className="bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors w-40"
                />
                <span className="text-[0.75rem] text-fog">to</span>
                <input
                  type="date"
                  value={logFilters.dateTo}
                  onChange={(e) => { setLogFilters(prev => ({ ...prev, dateTo: e.target.value })); setLogsPagination(prev => ({ ...prev, page: 1 })) }}
                  className="bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors w-40"
                />
              </div>
              {logStats && (
                <p className="ml-auto text-[0.75rem] text-fog">
                  Total: {logStats.totalDuration} min · {logStats.avgDuration} min avg
                </p>
              )}
            </div>
          </div>

          {logsLoading ? (
            <div className="flex items-center justify-center py-16 border border-wire bg-cream">
              <Loader2 className="h-5 w-5 animate-spin text-bronze" />
            </div>
          ) : (
            <>
              <AgentActivityFeed activities={logs} showAgent={false} maxItems={100} />
              {logsPagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-[0.75rem] text-fog">Page {logsPagination.page} of {logsPagination.totalPages}</p>
                  <div className="flex gap-0 border border-wire">
                    <button
                      onClick={() => setLogsPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={logsPagination.page === 1}
                      className="px-4 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium border-r border-wire bg-cream text-fog hover:text-sable hover:bg-linen disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setLogsPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={logsPagination.page === logsPagination.totalPages}
                      className="px-4 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium bg-cream text-fog hover:text-sable hover:bg-linen disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Locations tab */}
      {activeTab === 'locations' && (
        <div className="space-y-4">
          {locationStats && <LocationStats stats={locationStats} />}

          <div className="border border-wire bg-cream">
            <div className="px-5 py-4 border-b border-wire">
              <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Filter by Date</p>
            </div>
            <div className="px-5 py-4 flex items-center gap-4">
              <Calendar className="h-3.5 w-3.5 text-haze" />
              <input
                type="date"
                value={locationFilters.date}
                onChange={(e) => { setLocationFilters(prev => ({ ...prev, date: e.target.value })); setLocationsPagination(prev => ({ ...prev, page: 1 })) }}
                className="bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors w-48"
              />
              {locationFilters.date && (
                <button
                  onClick={() => setLocationFilters({ date: '' })}
                  className="text-[0.75rem] text-fog hover:text-sable border border-wire bg-cream px-3 py-2 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {locationsLoading ? (
            <div className="flex items-center justify-center py-16 border border-wire bg-cream">
              <Loader2 className="h-5 w-5 animate-spin text-bronze" />
            </div>
          ) : (
            <>
              <div className="border border-wire bg-cream p-6">
                <LocationTimeline locations={locations} />
              </div>

              {locationsPagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-[0.75rem] text-fog">Page {locationsPagination.page} of {locationsPagination.totalPages}</p>
                  <div className="flex gap-0 border border-wire">
                    <button
                      onClick={() => setLocationsPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={locationsPagination.page === 1}
                      className="px-4 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium border-r border-wire bg-cream text-fog hover:text-sable hover:bg-linen disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setLocationsPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={locationsPagination.page === locationsPagination.totalPages}
                      className="px-4 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium bg-cream text-fog hover:text-sable hover:bg-linen disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
