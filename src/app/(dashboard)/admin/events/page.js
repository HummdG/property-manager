'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search, Loader2, Calendar, Activity, User, Building2,
  Briefcase, ClipboardList, UserPlus, Trash2, CheckCircle,
  XCircle, Play, Eye, Filter, MessageSquare, CalendarDays,
  FileText, UserX, CreditCard, Ban
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { StatsCard } from '@/components/dashboard'
import { formatDate } from '@/lib/utils'

const eventTypeConfig = {
  USER_REGISTERED: { icon: UserPlus, color: 'bg-blue-100 text-blue-600', label: 'User Registered' },
  USER_TOGGLED_ACTIVE: { icon: UserX, color: 'bg-orange-100 text-orange-600', label: 'User Toggled Active' },
  PROPERTY_CREATED: { icon: Building2, color: 'bg-emerald-100 text-emerald-600', label: 'Property Created' },
  PROPERTY_UPDATED: { icon: Building2, color: 'bg-amber-100 text-amber-600', label: 'Property Updated' },
  PROPERTY_LISTED: { icon: Eye, color: 'bg-green-100 text-green-600', label: 'Property Listed' },
  PROPERTY_DELETED: { icon: Trash2, color: 'bg-red-100 text-red-600', label: 'Property Deleted' },
  SERVICE_REQUEST_CREATED: { icon: ClipboardList, color: 'bg-purple-100 text-purple-600', label: 'Service Request Created' },
  JOB_ASSIGNED: { icon: Briefcase, color: 'bg-blue-100 text-blue-600', label: 'Job Assigned' },
  JOB_ACCEPTED: { icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600', label: 'Job Accepted' },
  JOB_REJECTED: { icon: XCircle, color: 'bg-red-100 text-red-600', label: 'Job Rejected' },
  JOB_STARTED: { icon: Play, color: 'bg-amber-100 text-amber-600', label: 'Job Started' },
  JOB_COMPLETED: { icon: CheckCircle, color: 'bg-green-100 text-green-600', label: 'Job Completed' },
  DOCUMENT_UPLOADED: { icon: FileText, color: 'bg-indigo-100 text-indigo-600', label: 'Document Uploaded' },
  DOCUMENT_DELETED: { icon: Trash2, color: 'bg-red-100 text-red-600', label: 'Document Deleted' },
  INQUIRY_CREATED: { icon: MessageSquare, color: 'bg-cyan-100 text-cyan-600', label: 'Inquiry Created' },
  INQUIRY_UPDATED: { icon: MessageSquare, color: 'bg-teal-100 text-teal-600', label: 'Inquiry Updated' },
  INQUIRY_DELETED: { icon: Trash2, color: 'bg-red-100 text-red-600', label: 'Inquiry Deleted' },
  FOLLOW_UP_CREATED: { icon: CalendarDays, color: 'bg-violet-100 text-violet-600', label: 'Follow-Up Created' },
  AGENT_LOG_CREATED: { icon: CalendarDays, color: 'bg-sky-100 text-sky-600', label: 'Agent Log Created' },
  SUBSCRIPTION_CREATED: { icon: CreditCard, color: 'bg-emerald-100 text-emerald-600', label: 'Subscription Created' },
  SUBSCRIPTION_CANCELLED: { icon: Ban, color: 'bg-red-100 text-red-600', label: 'Subscription Cancelled' }
}

const defaultConfig = { icon: Activity, color: 'bg-slate-100 text-slate-600', label: 'Event' }

const entityOptions = [
  { value: 'all', label: 'All Entities' },
  { value: 'user', label: 'Users' },
  { value: 'property', label: 'Properties' },
  { value: 'serviceRequest', label: 'Service Requests' },
  { value: 'jobAssignment', label: 'Job Assignments' },
  { value: 'propertyDocument', label: 'Documents' },
  { value: 'inquiry', label: 'Inquiries' },
  { value: 'inquiryFollowUp', label: 'Follow-Ups' },
  { value: 'agentDailyLog', label: 'Agent Logs' },
  { value: 'agentSubscription', label: 'Subscriptions' }
]

export default function AdminEventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [summary, setSummary] = useState({ totalEvents: 0, byType: {}, byEntity: {} })
  const [filters, setFilters] = useState({
    type: 'all',
    entity: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  })

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', pagination.page.toString())
      params.set('limit', pagination.limit.toString())

      if (filters.type !== 'all') params.set('type', filters.type)
      if (filters.entity !== 'all') params.set('entity', filters.entity)
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.set('dateTo', filters.dateTo)
      if (filters.search) params.set('search', filters.search)

      const response = await fetch(`/api/admin/events?${params}`)
      if (!response.ok) throw new Error('Failed to fetch events')

      const data = await response.json()
      setEvents(data.events)
      setPagination(data.pagination)
      setSummary(data.summary)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.page, pagination.limit])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const eventTypes = Object.keys(summary.byType)

  function renderMetadata(metadata) {
    if (!metadata || typeof metadata !== 'object') return null

    const entries = Object.entries(metadata).filter(([, v]) => v)
    if (entries.length === 0) return null

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {entries.map(([key, value]) => (
          <span
            key={key}
            className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-xs text-slate-600"
          >
            <span className="font-medium mr-1">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
            {typeof value === 'string' && value.length > 50 ? `${value.substring(0, 50)}...` : String(value)}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-950">System Events</h1>
        <p className="text-slate-500 mt-1">Audit log of all actions in the system</p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Events"
          value={summary.totalEvents}
          icon={Activity}
          subtitle="All recorded actions"
          iconColor="amber"
        />
        <StatsCard
          title="Event Types"
          value={Object.keys(summary.byType).length}
          icon={Filter}
          subtitle="Distinct event types"
          iconColor="blue"
        />
        <StatsCard
          title="Entities"
          value={Object.keys(summary.byEntity).length}
          icon={Building2}
          subtitle="Affected entity types"
          iconColor="purple"
        />
        <StatsCard
          title="Today"
          value={events.filter(e => {
            const today = new Date()
            const eventDate = new Date(e.createdAt)
            return eventDate.toDateString() === today.toDateString()
          }).length}
          icon={Calendar}
          subtitle="Events today"
          iconColor="emerald"
        />
      </div>

      {/* Entity breakdown */}
      {Object.keys(summary.byEntity).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-500">Events by Entity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(summary.byEntity).map(([entity, count]) => (
                <div
                  key={entity}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <span className="text-sm font-medium text-blue-950 capitalize">{entity}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger className="w-[200px]">
                <Activity className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {eventTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {eventTypeConfig[type]?.label || type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.entity}
              onValueChange={(value) => handleFilterChange('entity', value)}
            >
              <SelectTrigger className="w-[180px]">
                <Building2 className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                {entityOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-[150px]"
              />
              <span className="text-slate-400">to</span>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-[150px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events timeline */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 mb-2">No events found</p>
          <p className="text-sm text-slate-400">Events will appear here as actions occur in the system</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />

          <div className="space-y-4">
            {events.map(event => {
              const config = eventTypeConfig[event.type] || defaultConfig
              const Icon = config.icon
              return (
                <div key={event.id} className="relative flex items-start gap-4 pl-2">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${config.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Event content */}
                  <Card className="flex-1 border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={config.color}>
                              {config.label}
                            </Badge>
                            <span className="text-xs text-slate-400">
                              {event.action} &bull; {event.entity}
                            </span>
                          </div>
                          {event.user && (
                            <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
                              <User className="h-3.5 w-3.5" />
                              <span>{event.user.name || event.user.email}</span>
                            </div>
                          )}
                          {renderMetadata(event.metadata)}
                        </div>
                        <span className="text-xs text-slate-400 flex-shrink-0">
                          {formatDate(event.createdAt, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-slate-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} events
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

