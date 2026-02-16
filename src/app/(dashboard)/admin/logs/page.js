'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search, Loader2, Phone, Eye, Users, MapPin,
  FileText, MoreHorizontal, Calendar, Clock, Filter,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { StatsCard } from '@/components/dashboard'
import { formatDate, getActivityTypeColor, getInitials } from '@/lib/utils'

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

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  function formatDuration(minutes) {
    if (!minutes) return '—'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Agent Logs</h1>
        <p className="text-slate-500 mt-1">Overview of all agent daily activity logs</p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Logs"
          value={summary.totalLogs}
          icon={FileText}
          subtitle="All agent entries"
          iconColor="amber"
        />
        <StatsCard
          title="Total Duration"
          value={formatDuration(summary.totalDuration)}
          icon={Clock}
          subtitle="Combined activity time"
          iconColor="blue"
        />
        <StatsCard
          title="Avg Duration"
          value={formatDuration(summary.avgDuration)}
          icon={BarChart3}
          subtitle="Per activity"
          iconColor="purple"
        />
        <StatsCard
          title="Active Agents"
          value={agents.filter(a => a.logCount > 0).length}
          icon={Users}
          subtitle="With logged activities"
          iconColor="emerald"
        />
      </div>

      {/* Type breakdown */}
      {Object.keys(summary.byType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-slate-500">Activity Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(summary.byType).map(([type, count]) => {
                const Icon = typeIcons[type] || MoreHorizontal
                return (
                  <div
                    key={type}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${getActivityTypeColor(type)}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium text-blue-950">{typeLabels[type] || type}</span>
                    <Badge variant="secondary" className="ml-1">{count}</Badge>
                  </div>
                )
              })}
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
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(typeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.agentId}
              onValueChange={(value) => handleFilterChange('agentId', value)}
            >
              <SelectTrigger className="w-[180px]">
                <Users className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name} ({agent.logCount})
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
                placeholder="From"
              />
              <span className="text-slate-400">to</span>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-[150px]"
                placeholder="To"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 mb-2">No logs found</p>
          <p className="text-sm text-slate-400">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map(log => {
            const Icon = typeIcons[log.type] || MoreHorizontal
            return (
              <Card key={log.id} className="border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${getActivityTypeColor(log.type)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-blue-950">{log.title}</h3>
                          {log.description && (
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{log.description}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="flex-shrink-0">
                          {typeLabels[log.type] || log.type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={log.agent?.user?.image} />
                            <AvatarFallback className="bg-amber-100 text-amber-700 text-[10px]">
                              {getInitials(log.agent?.user?.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{log.agent?.user?.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(log.date)}</span>
                        </div>
                        {log.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDuration(log.duration)}</span>
                          </div>
                        )}
                        {log.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{log.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-slate-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} logs
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


