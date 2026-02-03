'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { RequestCard, RequestForm } from '@/components/service-request'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { getStatusColor } from '@/lib/utils'

export default function TenantIssuesPage() {
  const [requests, setRequests] = useState([])
  const [properties, setProperties] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [requestsRes, categoriesRes] = await Promise.all([
        fetch('/api/service-requests'),
        fetch('/api/categories')
      ])

      const requestsData = await requestsRes.json()
      const categoriesData = await categoriesRes.json()

      setRequests(requestsData.requests || [])
      setCategories(categoriesData.categories || [])

      // Get properties from the user's tenant profile
      const profileRes = await fetch('/api/tenant/profile')
      const profileData = await profileRes.json()
      if (profileData.property) {
        setProperties([profileData.property])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(formData) {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setDialogOpen(false)
        fetchData()
      }
    } catch (error) {
      console.error('Failed to submit request:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleRequestClick(request) {
    setSelectedRequest(request)
  }

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">My Issues</h1>
          <p className="text-slate-500 mt-1">Report and track maintenance requests</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          disabled={properties.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Report Issue
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search issues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Requests list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            <AlertCircle className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-blue-950">No issues reported</h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchQuery ? 'Try adjusting your search' : 'Report an issue when something needs fixing'}
          </p>
          {!searchQuery && properties.length > 0 && (
            <Button onClick={() => setDialogOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
          )}
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

      {/* New request dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
          </DialogHeader>
          <RequestForm
            properties={properties}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Request details dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Issue Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-blue-950">{selectedRequest.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{selectedRequest.description}</p>
              </div>

              <div className="flex gap-2">
                <Badge className={getStatusColor(selectedRequest.status)}>
                  {selectedRequest.status.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">
                  {selectedRequest.priority}
                </Badge>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-sm">
                <p className="text-slate-500">
                  <strong className="text-blue-950">Category:</strong> {selectedRequest.category?.name}
                </p>
                {selectedRequest.jobAssignment?.trader && (
                  <p className="text-slate-500">
                    <strong className="text-blue-950">Assigned to:</strong> {selectedRequest.jobAssignment.trader.name}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
