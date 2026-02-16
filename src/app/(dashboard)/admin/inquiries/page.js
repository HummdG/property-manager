'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, MessageSquare, Phone, Mail, MapPin, Calendar, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { formatDate, getInquiryStatusColor, getInquiryTypeColor } from '@/lib/utils'

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

      if (filters.type !== 'all') {
        params.set('type', filters.type)
      }
      if (filters.status !== 'all') {
        params.set('status', filters.status)
      }
      if (filters.agentId !== 'all') {
        params.set('agentId', filters.agentId)
      }
      if (filters.search) {
        params.set('search', filters.search)
      }

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

  useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

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
        <h1 className="text-2xl font-bold text-blue-950">Agent Inquiries</h1>
        <p className="text-slate-500 mt-1">View and monitor all agent inquiries across the platform</p>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by client name, email, or phone..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={filters.agentId}
                onValueChange={(value) => handleFilterChange('agentId', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Agents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  {agents.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.user?.name || 'Unknown Agent'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="RENT">Rent</SelectItem>
                  <SelectItem value="SALE">Sale</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="MEETING_SCHEDULED">Meeting Scheduled</SelectItem>
                  <SelectItem value="FOLLOW_UP">Follow Up</SelectItem>
                  <SelectItem value="ACCEPTED">Accepted</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
      ) : inquiries.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 mb-2">No inquiries found</p>
          <p className="text-sm text-slate-400">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          {/* Inquiries list */}
          <div className="space-y-4">
            {inquiries.map(inquiry => (
              <Card key={inquiry.id} className="border-slate-200 hover:shadow-lg hover:border-amber-200 transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Client info */}
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-blue-950 truncate">
                          {inquiry.clientName}
                        </h3>
                        <Badge className={getInquiryTypeColor(inquiry.type)}>
                          {inquiry.type}
                        </Badge>
                      </div>

                      {/* Contact details */}
                      <div className="space-y-1 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="truncate">{inquiry.clientEmail}</span>
                        </div>
                        {inquiry.clientPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{inquiry.clientPhone}</span>
                          </div>
                        )}
                        {(inquiry.property?.name || inquiry.preferredArea) && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="truncate">
                              {inquiry.property?.name || inquiry.preferredArea}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Agent info */}
                      <div className="mt-3 text-sm">
                        <span className="text-slate-400">Agent: </span>
                        <span className="font-medium text-blue-950">
                          {inquiry.agent?.user?.name || 'Unknown'}
                        </span>
                      </div>

                      {/* Message preview */}
                      {inquiry.message && (
                        <div className="mt-2 text-sm text-slate-400 line-clamp-2">
                          {inquiry.message}
                        </div>
                      )}
                    </div>

                    {/* Status and date */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <Badge variant="outline" className={getInquiryStatusColor(inquiry.status)}>
                        {inquiry.status.replace('_', ' ')}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(inquiry.createdAt)}</span>
                      </div>
                      {inquiry.followUps?.length > 0 && (
                        <span className="text-xs text-slate-400">
                          {inquiry.followUps.length} follow-up{inquiry.followUps.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-slate-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} inquiries
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



