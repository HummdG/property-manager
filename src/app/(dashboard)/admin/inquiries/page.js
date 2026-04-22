'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, MessageSquare, Phone, Mail, MapPin, Calendar, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const typePills = {
  RENT: 'bg-bronze/10 text-bronze border border-bronze/20',
  SALE: 'bg-sable/5 text-pewter border border-wire'
}

const statusPills = {
  OPEN: 'bg-bronze/10 text-bronze border border-bronze/20',
  CONTACTED: 'bg-sable/5 text-pewter border border-wire',
  MEETING_SCHEDULED: 'bg-bronze/15 text-bronze border border-bronze/25',
  FOLLOW_UP: 'bg-sable/8 text-pewter border border-wire',
  ACCEPTED: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  REJECTED: 'bg-red-50 text-red-600 border border-red-100',
  CLOSED: 'bg-sable/5 text-pewter border border-wire'
}

export default function AdminInquiriesPage() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status')
  const typeFilter = searchParams.get('type')

  const [inquiries, setInquiries] = useState([])
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [filters, setFilters] = useState({
    type: typeFilter || 'all',
    status: statusFilter || 'all',
    agentId: 'all',
    search: ''
  })

  const fetchInquiries = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      params.set('page', pagination.page.toString())
      params.set('limit', pagination.limit.toString())
      if (filters.type !== 'all') params.set('type', filters.type)
      if (filters.status !== 'all') params.set('status', filters.status)
      if (filters.agentId !== 'all') params.set('agentId', filters.agentId)
      if (filters.search) params.set('search', filters.search)

      const response = await fetch(`/api/admin/inquiries?${params}`)
      if (!response.ok) throw new Error('Failed to fetch inquiries')

      const data = await response.json()
      setInquiries(data.inquiries)
      setAgents(data.agents || [])
      setPagination(data.pagination)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.page, pagination.limit])

  useEffect(() => { fetchInquiries() }, [fetchInquiries])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  return (
    <div className="space-y-5">
      <div className="border-b border-wire pb-5">
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Administration</p>
        <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">Agent Inquiries</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-haze" />
          <input
            type="text"
            placeholder="Search by client name, email..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full bg-cream border border-wire pl-9 pr-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none focus:border-bronze/50 transition-colors"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            value={filters.agentId}
            onChange={(e) => handleFilterChange('agentId', e.target.value)}
            className="bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors"
          >
            <option value="all">All Agents</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.user?.name || 'Unknown Agent'}
              </option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors"
          >
            <option value="all">All Types</option>
            <option value="RENT">Rent</option>
            <option value="SALE">Sale</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="CONTACTED">Contacted</option>
            <option value="MEETING_SCHEDULED">Meeting Scheduled</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="px-5 py-3 border border-red-200 bg-red-50 text-[0.8125rem] text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 border border-wire bg-cream">
          <Loader2 className="h-5 w-5 animate-spin text-bronze" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-wire bg-cream text-center">
          <div className="w-14 h-14 border border-wire bg-linen flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6 text-haze" />
          </div>
          <p className="text-[0.8125rem] font-medium text-sable">No inquiries found</p>
          <p className="text-[0.75rem] text-fog mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="border border-wire bg-cream divide-y divide-wire/60">
            {inquiries.map(inquiry => (
              <div key={inquiry.id} className="px-5 py-4 hover:bg-linen transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-[0.8125rem] font-medium text-sable truncate">{inquiry.clientName}</p>
                      <span className={cn('text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5', typePills[inquiry.type] || 'bg-linen text-fog border border-wire')}>
                        {inquiry.type}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[0.75rem] text-fog">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{inquiry.clientEmail}</span>
                      </div>
                      {inquiry.clientPhone && (
                        <div className="flex items-center gap-2 text-[0.75rem] text-fog">
                          <Phone className="h-3 w-3" />
                          <span>{inquiry.clientPhone}</span>
                        </div>
                      )}
                      {(inquiry.property?.name || inquiry.preferredArea) && (
                        <div className="flex items-center gap-2 text-[0.75rem] text-fog">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{inquiry.property?.name || inquiry.preferredArea}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[0.75rem] text-fog mt-2">
                      Agent: <span className="text-sable font-medium">{inquiry.agent?.user?.name || 'Unknown'}</span>
                    </p>
                    {inquiry.message && (
                      <p className="text-[0.75rem] text-haze mt-1 line-clamp-2">{inquiry.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={cn('text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5', statusPills[inquiry.status] || 'bg-linen text-fog border border-wire')}>
                      {inquiry.status.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-1 text-[0.7rem] text-haze">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(inquiry.createdAt)}</span>
                    </div>
                    {inquiry.followUps?.length > 0 && (
                      <span className="text-[0.7rem] text-haze">
                        {inquiry.followUps.length} follow-up{inquiry.followUps.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

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
        </>
      )}
    </div>
  )
}
