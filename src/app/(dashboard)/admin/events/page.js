'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search, Loader2, Calendar, Activity, Building2,
  UserPlus, Trash2, Eye, MessageSquare, CalendarDays,
  FileText, UserX, User, Filter
} from 'lucide-react'
import { StatsCard } from '@/components/dashboard'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const eventTypeConfig = {
  USER_REGISTERED: { icon: UserPlus, label: 'User Registered' },
  USER_TOGGLED_ACTIVE: { icon: UserX, label: 'User Toggled Active' },
  PROPERTY_CREATED: { icon: Building2, label: 'Property Created' },
  PROPERTY_UPDATED: { icon: Building2, label: 'Property Updated' },
  PROPERTY_LISTED: { icon: Eye, label: 'Property Listed' },
  PROPERTY_DELETED: { icon: Trash2, label: 'Property Deleted' },
  DOCUMENT_UPLOADED: { icon: FileText, label: 'Document Uploaded' },
  DOCUMENT_DELETED: { icon: Trash2, label: 'Document Deleted' },
  INQUIRY_CREATED: { icon: MessageSquare, label: 'Inquiry Created' },
  INQUIRY_UPDATED: { icon: MessageSquare, label: 'Inquiry Updated' },
  INQUIRY_DELETED: { icon: Trash2, label: 'Inquiry Deleted' },
  FOLLOW_UP_CREATED: { icon: CalendarDays, label: 'Follow-Up Created' },
  AGENT_LOG_CREATED: { icon: CalendarDays, label: 'Agent Log Created' }
}

const defaultConfig = { icon: Activity, label: 'Event' }

const entityOptions = [
  { value: 'all', label: 'All Entities' },
  { value: 'user', label: 'Users' },
  { value: 'property', label: 'Properties' },
  { value: 'propertyDocument', label: 'Documents' },
  { value: 'inquiry', label: 'Inquiries' },
  { value: 'inquiryFollowUp', label: 'Follow-Ups' },
  { value: 'agentDailyLog', label: 'Agent Logs' }
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

  useEffect(() => { fetchEvents() }, [fetchEvents])

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
          <span key={key} className="inline-flex items-center px-2 py-0.5 bg-linen border border-wire text-[0.65rem] text-fog">
            <span className="font-medium text-pewter mr-1">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
            {typeof value === 'string' && value.length > 50 ? `${value.substring(0, 50)}...` : String(value)}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="border-b border-wire pb-5">
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Administration</p>
        <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">System Events</h1>
      </div>

      {/* Stats */}
      <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-wire border border-wire">
        <StatsCard title="Total Events" value={summary.totalEvents} icon={Activity} subtitle="All recorded actions" />
        <StatsCard title="Event Types" value={Object.keys(summary.byType).length} icon={Filter} subtitle="Distinct types" />
        <StatsCard title="Entities" value={Object.keys(summary.byEntity).length} icon={Building2} subtitle="Affected entities" />
        <StatsCard
          title="Today"
          value={events.filter(e => new Date(e.createdAt).toDateString() === new Date().toDateString()).length}
          icon={Calendar}
          subtitle="Events today"
        />
      </div>

      {/* Entity breakdown */}
      {Object.keys(summary.byEntity).length > 0 && (
        <div className="border border-wire bg-cream">
          <div className="px-5 py-4 border-b border-wire">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Events by Entity</p>
          </div>
          <div className="px-5 py-4 flex flex-wrap gap-3">
            {Object.entries(summary.byEntity).map(([entity, count]) => (
              <div key={entity} className="flex items-center gap-2 px-3 py-2 border border-wire bg-linen">
                <span className="text-[0.75rem] font-medium text-sable capitalize">{entity}</span>
                <span className="text-[0.7rem] text-fog font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-haze" />
          <input
            type="text"
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full bg-cream border border-wire pl-9 pr-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none focus:border-bronze/50 transition-colors"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors"
          >
            <option value="all">All Types</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{eventTypeConfig[type]?.label || type}</option>
            ))}
          </select>
          <select
            value={filters.entity}
            onChange={(e) => handleFilterChange('entity', e.target.value)}
            className="bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors"
          >
            {entityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors w-[150px]"
            />
            <span className="text-[0.75rem] text-fog">to</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors w-[150px]"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 border border-wire bg-cream">
          <Loader2 className="h-5 w-5 animate-spin text-bronze" />
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-wire bg-cream text-center">
          <div className="w-14 h-14 border border-wire bg-linen flex items-center justify-center mb-4">
            <Activity className="h-6 w-6 text-haze" />
          </div>
          <p className="text-[0.8125rem] font-medium text-sable">No events found</p>
          <p className="text-[0.75rem] text-fog mt-1">Events will appear here as actions occur</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[1.125rem] top-0 bottom-0 w-px bg-wire" />
          <div className="space-y-3">
            {events.map(event => {
              const config = eventTypeConfig[event.type] || defaultConfig
              const Icon = config.icon
              return (
                <div key={event.id} className="relative flex items-start gap-4 pl-2">
                  <div className="relative z-10 w-9 h-9 border border-wire bg-linen flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-bronze" />
                  </div>
                  <div className="flex-1 border border-wire bg-cream px-5 py-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[0.65rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 bg-linen text-pewter border border-wire">
                            {config.label}
                          </span>
                          <span className="text-[0.7rem] text-haze">
                            {event.action} · {event.entity}
                          </span>
                        </div>
                        {event.user && (
                          <div className="flex items-center gap-1.5 mt-2 text-[0.75rem] text-fog">
                            <User className="h-3 w-3" />
                            <span>{event.user.name || event.user.email}</span>
                          </div>
                        )}
                        {renderMetadata(event.metadata)}
                      </div>
                      <span className="text-[0.7rem] text-haze flex-shrink-0">
                        {formatDate(event.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[0.75rem] text-fog">
            Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex gap-0 border border-wire">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium border-r border-wire bg-cream text-fog hover:text-sable hover:bg-linen disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-[0.7rem] text-fog bg-cream border-r border-wire">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium bg-cream text-fog hover:text-sable hover:bg-linen disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
