'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, Users, Search, UserCheck, UserX, Star, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { AgentCard } from '@/components/admin'
import { StatsCard } from '@/components/dashboard'

export default function AdminAgentsPage() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status')

  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [summary, setSummary] = useState({ totalAgents: 0, activeAgents: 0, avgRating: 0, avgCompletedDeals: 0 })
  const [filters, setFilters] = useState({
    status: statusFilter || 'all',
    search: ''
  })

  const fetchAgents = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      params.set('page', pagination.page.toString())
      params.set('limit', pagination.limit.toString())

      if (filters.status !== 'all') {
        params.set('status', filters.status)
      }
      if (filters.search) {
        params.set('search', filters.search)
      }

      const response = await fetch(`/api/admin/agents?${params}`)
      if (!response.ok) throw new Error('Failed to fetch agents')

      const data = await response.json()
      setAgents(data.agents)
      setPagination(data.pagination)
      setSummary(data.summary)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.page, pagination.limit])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Agents</h1>
        <p className="text-slate-500 mt-1">Monitor and manage all agent activities</p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Agents"
          value={summary.totalAgents}
          icon={Users}
          subtitle="Registered agents"
          iconColor="amber"
        />
        <StatsCard
          title="Active Agents"
          value={summary.activeAgents}
          icon={UserCheck}
          subtitle="Currently available"
          iconColor="emerald"
        />
        <StatsCard
          title="Avg Rating"
          value={summary.avgRating.toFixed(1)}
          icon={Star}
          subtitle="Agent performance"
          iconColor="blue"
        />
        <StatsCard
          title="Avg Deals"
          value={summary.avgCompletedDeals}
          icon={TrendingUp}
          subtitle="Per agent"
          iconColor="purple"
        />
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by name, email, company, or license..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 mb-2">No agents found</p>
          <p className="text-sm text-slate-400">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          {/* Agents list */}
          <div className="grid gap-4 lg:grid-cols-2">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-slate-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} agents
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
        </>
      )}
    </div>
  )
}

