'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Loader2,
  ArrowLeft,
  MessageSquare,
  CalendarDays,
  MapPin,
  Star,
  Mail,
  Phone,
  Building2,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AgentActivityFeed, LocationTimeline, LocationStats } from '@/components/admin'
import { StatsCard } from '@/components/dashboard'
import { formatDate, getInitials, getInquiryStatusColor, getInquiryTypeColor, cn } from '@/lib/utils'

const tabs = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
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

  // Tab-specific state
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

  // Fetch agent details
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

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    if (activeTab !== 'logs') return

    setLogsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', logsPagination.page.toString())
      params.set('limit', logsPagination.limit.toString())

      if (logFilters.type !== 'all') {
        params.set('type', logFilters.type)
      }
      if (logFilters.dateFrom) {
        params.set('dateFrom', logFilters.dateFrom)
      }
      if (logFilters.dateTo) {
        params.set('dateTo', logFilters.dateTo)
      }

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

  // Fetch locations
  const fetchLocations = useCallback(async () => {
    if (activeTab !== 'locations') return

    setLocationsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', locationsPagination.page.toString())
      params.set('limit', locationsPagination.limit.toString())

      if (locationFilters.date) {
        params.set('date', locationFilters.date)
      }

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

  useEffect(() => {
    fetchAgent()
  }, [fetchAgent])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    router.push(`/admin/agents/${agentId}?tab=${tab}`, { scroll: false })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || 'Agent not found'}</p>
        <Link href="/admin/agents">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Agents
          </Button>
        </Link>
      </div>
    )
  }

  const subscriptionColors = {
    TRIAL: 'bg-slate-100 text-slate-600 border-slate-200',
    ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    PAST_DUE: 'bg-red-100 text-red-700 border-red-200',
    CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200'
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/admin/agents">
        <Button variant="ghost" size="sm" className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Agents
        </Button>
      </Link>

      {/* Agent header */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-20 w-20 ring-4 ring-amber-400/20">
              <AvatarImage src={agent.user?.image} alt={agent.user?.name} />
              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-500 text-white text-2xl font-semibold">
                {getInitials(agent.user?.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-blue-950">{agent.user?.name}</h1>
                  {agent.companyName && (
                    <p className="text-slate-500 mt-1">{agent.companyName}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={agent.isAvailable
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                  }>
                    {agent.isAvailable ? 'Active' : 'Inactive'}
                  </Badge>
                  {agent.subscription?.status && (
                    <Badge variant="outline" className={subscriptionColors[agent.subscription.status]}>
                      {agent.subscription.plan?.name || agent.subscription.status}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{agent.user?.email}</span>
                </div>
                {agent.user?.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Phone className="h-4 w-4" />
                    <span>{agent.user.phone}</span>
                  </div>
                )}
                {agent.licenseNumber && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <FileText className="h-4 w-4" />
                    <span>{agent.licenseNumber}</span>
                  </div>
                )}
                {agent.rating > 0 && (
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span>{agent.rating.toFixed(1)} rating</span>
                  </div>
                )}
              </div>

              {agent.serviceAreas?.length > 0 && (
                <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{agent.serviceAreas.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Inquiries"
              value={stats?.inquiries.total || 0}
              icon={MessageSquare}
              subtitle={`${stats?.inquiries.open || 0} open`}
              iconColor="amber"
            />
            <StatsCard
              title="Closed Deals"
              value={stats?.inquiries.closed || 0}
              icon={CheckCircle}
              subtitle={`${stats?.inquiries.closedThisMonth || 0} this month`}
              iconColor="emerald"
            />
            <StatsCard
              title="Activity Logs"
              value={stats?.logs.total || 0}
              icon={CalendarDays}
              subtitle={`${stats?.logs.today || 0} today`}
              iconColor="blue"
            />
            <StatsCard
              title="Location Logs"
              value={stats?.locations.total || 0}
              icon={MapPin}
              subtitle={`${stats?.locations.today || 0} today`}
              iconColor="purple"
            />
          </div>

          {/* Inquiry breakdown */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inquiries by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats?.inquiries.byType?.RENT || 0}</p>
                    <p className="text-sm text-slate-500">Rent</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                    <p className="text-2xl font-bold text-emerald-600">{stats?.inquiries.byType?.SALE || 0}</p>
                    <p className="text-sm text-slate-500">Sale</p>
                  </div>
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-center">
                    <p className="text-2xl font-bold text-orange-600">{stats?.inquiries.byType?.MAINTENANCE || 0}</p>
                    <p className="text-sm text-slate-500">Maintenance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Inquiries by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(stats?.inquiries.byStatus || {}).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <Badge variant="outline" className={getInquiryStatusColor(status)}>
                        {status.replace('_', ' ')}
                      </Badge>
                      <span className="font-semibold text-blue-950">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Inquiries</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => handleTabChange('inquiries')}>
                  View all
                </Button>
              </CardHeader>
              <CardContent>
                {recentInquiries.length === 0 ? (
                  <p className="text-slate-400 text-sm py-4 text-center">No inquiries yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentInquiries.map(inquiry => (
                      <Link
                        key={inquiry.id}
                        href={`/admin/inquiries?search=${inquiry.clientEmail}`}
                        className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-blue-950">{inquiry.clientName}</p>
                          <p className="text-sm text-slate-500 truncate">
                            {inquiry.property?.name || inquiry.preferredArea || 'General inquiry'}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {formatDate(inquiry.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={getInquiryTypeColor(inquiry.type)}>
                            {inquiry.type}
                          </Badge>
                          <Badge variant="outline" className={getInquiryStatusColor(inquiry.status)}>
                            {inquiry.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => handleTabChange('logs')}>
                  View all
                </Button>
              </CardHeader>
              <CardContent>
                <AgentActivityFeed activities={recentLogs} showAgent={false} maxItems={5} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'inquiries' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Link href={`/admin/inquiries?agentId=${agentId}`}>
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View All Inquiries for this Agent
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-4">
          {/* Filters */}
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Select
                  value={logFilters.type}
                  onValueChange={(value) => {
                    setLogFilters(prev => ({ ...prev, type: value }))
                    setLogsPagination(prev => ({ ...prev, page: 1 }))
                  }}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Activity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <Input
                    type="date"
                    value={logFilters.dateFrom}
                    onChange={(e) => {
                      setLogFilters(prev => ({ ...prev, dateFrom: e.target.value }))
                      setLogsPagination(prev => ({ ...prev, page: 1 }))
                    }}
                    className="w-40"
                  />
                  <span className="text-slate-400">to</span>
                  <Input
                    type="date"
                    value={logFilters.dateTo}
                    onChange={(e) => {
                      setLogFilters(prev => ({ ...prev, dateTo: e.target.value }))
                      setLogsPagination(prev => ({ ...prev, page: 1 }))
                    }}
                    className="w-40"
                  />
                </div>

                {logStats && (
                  <div className="ml-auto text-sm text-slate-500">
                    Total: {logStats.totalDuration} min ({logStats.avgDuration} min avg)
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Logs list */}
          {logsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : (
            <>
              <AgentActivityFeed activities={logs} showAgent={false} maxItems={100} />

              {logsPagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLogsPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={logsPagination.page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-500">
                    Page {logsPagination.page} of {logsPagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLogsPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={logsPagination.page === logsPagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'locations' && (
        <div className="space-y-4">
          {/* Stats */}
          {locationStats && <LocationStats stats={locationStats} />}

          {/* Date filter */}
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Calendar className="h-4 w-4 text-slate-400" />
                <Input
                  type="date"
                  value={locationFilters.date}
                  onChange={(e) => {
                    setLocationFilters(prev => ({ ...prev, date: e.target.value }))
                    setLocationsPagination(prev => ({ ...prev, page: 1 }))
                  }}
                  className="w-48"
                  placeholder="Filter by date"
                />
                {locationFilters.date && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocationFilters({ date: '' })}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Locations list */}
          {locationsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <LocationTimeline locations={locations} />
                </CardContent>
              </Card>

              {locationsPagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocationsPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={locationsPagination.page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-slate-500">
                    Page {locationsPagination.page} of {locationsPagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocationsPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={locationsPagination.page === locationsPagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}


