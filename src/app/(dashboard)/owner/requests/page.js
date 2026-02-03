'use client'

import { useState, useEffect } from 'react'
import { ClipboardList, Search, Filter, Loader2, UserPlus } from 'lucide-react'
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
        <h1 className="text-2xl font-bold text-slate-100">Service Requests</h1>
        <p className="text-slate-400 mt-1">Manage maintenance requests for your properties</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Total</p>
          <p className="text-2xl font-bold text-slate-100">{requestCounts.total}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Pending</p>
          <p className="text-2xl font-bold text-amber-400">{requestCounts.pending}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">In Progress</p>
          <p className="text-2xl font-bold text-blue-400">{requestCounts.inProgress}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-sm text-slate-400">Completed</p>
          <p className="text-2xl font-bold text-emerald-400">{requestCounts.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {statusFilters.map(filter => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(filter.value)}
              className={statusFilter === filter.value
                ? 'bg-teal-600 hover:bg-teal-700'
                : 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Requests list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
            <ClipboardList className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-200">No requests found</h3>
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
        <DialogContent className="max-w-md bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-xl">Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-200">{selectedRequest.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{selectedRequest.description}</p>
              </div>

              <div className="flex gap-2">
                <Badge className={getStatusColor(selectedRequest.status)}>
                  {selectedRequest.status.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className="text-slate-400 border-slate-700">
                  {selectedRequest.priority}
                </Badge>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-sm text-slate-400 mb-2">
                  <strong className="text-slate-300">Property:</strong> {selectedRequest.property?.name}
                </p>
                <p className="text-sm text-slate-400">
                  <strong className="text-slate-300">Category:</strong> {selectedRequest.category?.name}
                </p>
              </div>

              {selectedRequest.jobAssignment?.trader ? (
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-sm text-slate-400">
                    <strong className="text-slate-300">Assigned to:</strong> {selectedRequest.jobAssignment.trader.name}
                  </p>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Assign Trader
                  </Label>
                  <select
                    value={selectedTrader}
                    onChange={(e) => setSelectedTrader(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100"
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
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
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

