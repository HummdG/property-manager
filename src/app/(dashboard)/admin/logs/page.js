'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search, Loader2, Phone, Eye, Users, MapPin,
  FileText, MoreHorizontal, Calendar, Clock, Filter, BarChart3
} from 'lucide-react'
import { StatsCard } from '@/components/dashboard'
import { formatDate, getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'

const typeIcons = {
  CALL: Phone,
  VIEWING: Eye,
  MEETING: Users,
  SITE_VISIT: MapPin,
  PAPERWORK: FileText,
  OTHER: MoreHorizontal
}

const typeLabels = {
  CALL: 'Call',
  VIEWING: 'Viewing',
  MEETING: 'Meeting',
  SITE_VISIT: 'Site Visit',
  PAPERWORK: 'Paperwork',
  OTHER: 'Other'
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [summary, setSummary] = useState({ totalLogs: 0, totalDuration: 0, avgDuration: 0, byType: {} })
  const [agents, setAgents] = useState([])
  const [filters, setFilters] = useState({
    type: 'all',
    agentId: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  })

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', pagination.page.toString())
      params.set('limit', pagination.limit.toString())
      if (filters.type !== 'all') params.set('type', filters.type)
      if (filters.agentId !== 'all') params.set('agentId', filters.agentId)
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom)
      if (filters.dateTo) params.set('dateTo', filters.dateTo)
      if (filters.search) params.set('search', filters.search)

      const response = await fetch(`/api/admin/logs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch logs')

      const data = await response.json()
      setLogs(data.logs)
      setPagination(data.pagination)
      setSummary(data.summary)
      setAgents(data.agents)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.page, pagination.limit])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  function formatDuration(minutes) {
    if (!minutes) return '-'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-5">
      <div className="border-b border-wire pb-5">
        <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Administration</p>
        <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">Agent Logs</h1>
      </div>

      {/* Stats */}
      <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 bg-wire border border-wire">
        <StatsCard title="Total Logs" value={summary.totalLogs} icon={FileText} subtitle="All agent entries" />
        <StatsCard title="Total Duration" value={formatDuration(summary.totalDuration)} icon={Clock} subtitle="Combined time" />
        <StatsCard title="Avg Duration" value={formatDuration(summary.avgDuration)} icon={BarChart3} subtitle="Per activity" />
        <StatsCard title="Active Agents" value={agents.filter(a => a.logCount > 0).length} icon={Users} subtitle="With logged activities" />
      </div>

      {/* Activity breakdown */}
      {Object.keys(summary.byType).length > 0 && (
        <div className="border border-wire bg-cream">
          <div className="px-5 py-4 border-b border-wire">
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Activity Breakdown</p>
          </div>
          <div className="px-5 py-4 flex flex-wrap gap-3">
            {Object.entries(summary.byType).map(([type, count]) => {
              const Icon = typeIcons[type] || MoreHorizontal
              return (
                <div key={type} className="flex items-center gap-2 px-3 py-2 border border-wire bg-linen">
                  <div className="w-6 h-6 border border-wire bg-cream flex items-center justify-center">
                    <Icon className="h-3 w-3 text-bronze" />
                  </div>
                  <span className="text-[0.75rem] font-medium text-sable">{typeLabels[type] || type}</span>
                  <span className="text-[0.7rem] text-fog font-medium">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-haze" />
          <input
            type="text"
            placeholder="Search logs..."
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
            {Object.entries(typeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={filters.agentId}
            onChange={(e) => handleFilterChange('agentId', e.target.value)}
            className="bg-cream border border-wire px-3 py-2 text-[0.8125rem] text-sable focus:outline-none focus:border-bronze/50 transition-colors"
          >
            <option value="all">All Agents</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name} ({agent.logCount})
              </option>
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
      ) : logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-wire bg-cream text-center">
          <div className="w-14 h-14 border border-wire bg-linen flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-haze" />
          </div>
          <p className="text-[0.8125rem] font-medium text-sable">No logs found</p>
          <p className="text-[0.75rem] text-fog mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="border border-wire bg-cream divide-y divide-wire/60">
          {logs.map(log => {
            const Icon = typeIcons[log.type] || MoreHorizontal
            return (
              <div key={log.id} className="flex items-start gap-4 px-5 py-4">
                <div className="w-9 h-9 border border-wire bg-linen flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="h-4 w-4 text-bronze" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[0.8125rem] font-medium text-sable">{log.title}</p>
                      {log.description && (
                        <p className="text-[0.75rem] text-fog mt-0.5 line-clamp-2">{log.description}</p>
                      )}
                    </div>
                    <span className="text-[0.6rem] uppercase tracking-[0.08em] font-medium px-2 py-0.5 bg-linen text-pewter border border-wire flex-shrink-0">
                      {typeLabels[log.type] || log.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-bronze/15 border border-bronze/20 flex items-center justify-center text-[0.6rem] font-medium text-bronze uppercase">
                        {getInitials(log.agent?.user?.name)}
                      </div>
                      <span className="text-[0.75rem] text-sable font-medium">{log.agent?.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[0.7rem] text-fog">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(log.date)}</span>
                    </div>
                    {log.duration && (
                      <div className="flex items-center gap-1 text-[0.7rem] text-fog">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(log.duration)}</span>
                      </div>
                    )}
                    {log.location && (
                      <div className="flex items-center gap-1 text-[0.7rem] text-fog">
                        <MapPin className="h-3 w-3" />
                        <span>{log.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
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
