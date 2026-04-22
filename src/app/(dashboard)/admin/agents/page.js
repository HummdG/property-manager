'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, Users, Search, UserCheck, Star, TrendingUp, Clock } from 'lucide-react'
import { AgentCard } from '@/components/admin'
import { cn } from '@/lib/utils'

const statusOptions = [
  { value: 'all', label: 'All Agents' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]

const approvalOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'SUBMITTED', label: 'Pending Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'DRAFT', label: 'Draft' },
]

export default function AdminAgentsPage() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status')

  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [summary, setSummary] = useState({ totalAgents: 0, activeAgents: 0, pendingApproval: 0, avgRating: 0, avgCompletedDeals: 0 })
  const [filters, setFilters] = useState({
    status: statusFilter || 'all',
    approvalStatus: 'all',
    search: ''
  })

  const fetchAgents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      params.set('page', pagination.page.toString())
      params.set('limit', pagination.limit.toString())
      if (filters.status !== 'all') params.set('status', filters.status)
      if (filters.approvalStatus !== 'all') params.set('approvalStatus', filters.approvalStatus)
      if (filters.search) params.set('search', filters.search)

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

  useEffect(() => { fetchAgents() }, [fetchAgents])

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
        <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">Agents</h1>
      </div>

      {/* Stats */}
      <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-5 bg-wire border border-wire">
        {[
          { label: 'Total Agents', value: summary.totalAgents, icon: Users },
          { label: 'Active Agents', value: summary.activeAgents, icon: UserCheck },
          { label: 'Pending Review', value: summary.pendingApproval, icon: Clock },
          { label: 'Avg Rating', value: (summary.avgRating || 0).toFixed(1), icon: Star },
          { label: 'Avg Deals', value: summary.avgCompletedDeals, icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-cream p-5 flex items-center gap-4">
            <div className="w-9 h-9 border border-wire bg-linen flex items-center justify-center flex-shrink-0">
              <Icon className="h-4 w-4 text-bronze" />
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.1em] text-fog font-medium">{label}</p>
              <p className="font-display text-[1.5rem] font-light text-sable leading-none mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-haze" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full bg-cream border border-wire pl-9 pr-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none focus:border-bronze/50 transition-colors"
          />
        </div>
        <div className="flex gap-0 border border-wire overflow-x-auto">
          {statusOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleFilterChange('status', opt.value)}
              className={cn(
                'px-3.5 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium border-r border-wire last:border-0 whitespace-nowrap transition-colors',
                filters.status === opt.value ? 'bg-sable text-cream' : 'bg-cream text-fog hover:text-sable hover:bg-linen'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-0 border border-wire overflow-x-auto">
          {approvalOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleFilterChange('approvalStatus', opt.value)}
              className={cn(
                'px-3.5 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium border-r border-wire last:border-0 whitespace-nowrap transition-colors',
                filters.approvalStatus === opt.value ? 'bg-sable text-cream' : 'bg-cream text-fog hover:text-sable hover:bg-linen'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="px-5 py-3 border border-red-200 bg-red-50 text-[0.8125rem] text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 border border-wire bg-cream">
          <Loader2 className="h-5 w-5 animate-spin text-bronze" />
        </div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-wire bg-cream text-center">
          <div className="w-14 h-14 border border-wire bg-linen flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-haze" />
          </div>
          <p className="text-[0.8125rem] font-medium text-sable">No agents found</p>
          <p className="text-[0.75rem] text-fog mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-[0.75rem] text-fog">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
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
