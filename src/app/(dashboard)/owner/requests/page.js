'use client'

import { useState, useEffect } from 'react'
import { ClipboardList, Search, Loader2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { RequestCard } from '@/components/service-request'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { getStatusColor } from '@/lib/utils'

const statusFilters = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ASSIGNED', label: 'Assigned' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' }
]

export default function OwnerRequestsPage() {
  const [requests, setRequests] = useState([])
  const [traders, setTraders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedTrader, setSelectedTrader] = useState('')
  const [isAssigning, setIsAssigning] = useState(false)

  useEffect(() => {
    fetchRequests()
    fetchTraders()
  }, [statusFilter])

  async function fetchRequests() {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)

      const response = await fetch(`/api/service-requests?${params}`)
      const data = await response.json()
      setRequests(data.requests || [])
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchTraders() {
    try {
      const response = await fetch('/api/traders')
      const data = await response.json()
      setTraders(data.traders || [])
    } catch (error) {
      console.error('Failed to fetch traders:', error)
    }
  }

  async function handleAssignTrader() {
    if (!selectedRequest || !selectedTrader) return

    setIsAssigning(true)
    try {
      const response = await fetch(`/api/service-requests/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traderId: selectedTrader })
      })

      if (response.ok) {
        setAssignDialogOpen(false)
        setSelectedRequest(null)
        setSelectedTrader('')
        fetchRequests()
      }
    } catch (error) {
      console.error('Failed to assign trader:', error)
    } finally {
      setIsAssigning(false)
    }
  }

  function handleRequestClick(request) {
    setSelectedRequest(request)
    setAssignDialogOpen(true)
  }

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.property?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const requestCounts = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'PENDING').length,
    inProgress: requests.filter(r => ['ASSIGNED', 'IN_PROGRESS'].includes(r.status)).length,
    completed: requests.filter(r => r.status === 'COMPLETED').length
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Service Requests</h1>
        <p className="text-slate-500 mt-1">Manage maintenance requests for your properties</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-2xl font-bold text-blue-950">{requestCounts.total}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{requestCounts.pending}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{requestCounts.inProgress}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="text-2xl font-bold text-emerald-600">{requestCounts.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {statusFilters.map(filter => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Requests list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            <ClipboardList className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-blue-950">No requests found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchQuery || statusFilter ? 'Try adjusting your filters' : 'No service requests yet'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map(request => (
            <RequestCard
              key={request.id}
              request={request}
              onClick={handleRequestClick}
            />
          ))}
        </div>
      )}

      {/* Assign trader dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-blue-950">{selectedRequest.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedRequest.description}</p>
              </div>

              <div className="flex gap-2">
                <Badge className={getStatusColor(selectedRequest.status)}>
                  {selectedRequest.status.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">
                  {selectedRequest.priority}
                </Badge>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-1">
                  <strong className="text-blue-950">Property:</strong> {selectedRequest.property?.name}
                </p>
                <p className="text-sm text-slate-500">
                  <strong className="text-blue-950">Category:</strong> {selectedRequest.category?.name}
                </p>
              </div>

              {selectedRequest.jobAssignment?.trader ? (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500">
                    <strong className="text-blue-950">Assigned to:</strong> {selectedRequest.jobAssignment.trader.name}
                  </p>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <Label className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-amber-500" />
                    Assign Trader
                  </Label>
                  <select
                    value={selectedTrader}
                    onChange={(e) => setSelectedTrader(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="">Select a trader</option>
                    {traders.map(trader => (
                      <option key={trader.user.id} value={trader.user.id}>
                        {trader.user.name} {trader.companyName ? `(${trader.companyName})` : ''}
                      </option>
                    ))}
                  </select>
                  <Button
                    onClick={handleAssignTrader}
                    disabled={!selectedTrader || isAssigning}
                    className="w-full"
                  >
                    {isAssigning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Assigning...
                      </>
                    ) : 'Assign Trader'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
