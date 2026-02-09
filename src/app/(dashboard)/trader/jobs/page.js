'use client'

import { useState, useEffect } from 'react'
import { Briefcase, Search, Loader2, MapPin, Calendar, CheckCircle, XCircle, Play, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { formatDate, getStatusColor, getPriorityColor } from '@/lib/utils'

const statusFilters = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' }
]

export default function TraderJobsPage() {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectError, setRejectError] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  async function fetchJobs() {
    try {
      const response = await fetch('/api/trader/jobs')
      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateJobStatus(jobId, status, extra = {}) {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/trader/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...extra })
      })

      if (response.ok) {
        setSelectedJob(null)
        setShowRejectDialog(false)
        setRejectionReason('')
        setRejectError('')
        fetchJobs()
      } else {
        const data = await response.json()
        if (status === 'reject') {
          setRejectError(data.error || 'Failed to reject job')
        }
      }
    } catch (error) {
      console.error('Failed to update job:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  function handleRejectClick() {
    setShowRejectDialog(true)
    setRejectionReason('')
    setRejectError('')
  }

  function handleConfirmReject() {
    if (!rejectionReason.trim()) {
      setRejectError('Please provide a reason for rejecting this job')
      return
    }
    updateJobStatus(selectedJob.id, 'reject', { rejectionReason: rejectionReason.trim() })
  }

  function handleCloseRejectDialog() {
    setShowRejectDialog(false)
    setRejectionReason('')
    setRejectError('')
  }

  function getJobStatus(job) {
    if (job.completedAt) return 'completed'
    if (job.rejectedAt) return 'rejected'
    if (job.startedAt) return 'in_progress'
    if (job.acceptedAt) return 'accepted'
    return 'pending'
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.serviceRequest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.serviceRequest.property.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (!statusFilter) return matchesSearch

    const jobStatus = getJobStatus(job)
    if (statusFilter === 'pending') return matchesSearch && !job.acceptedAt && !job.rejectedAt
    if (statusFilter === 'accepted') return matchesSearch && job.acceptedAt && !job.completedAt
    if (statusFilter === 'completed') return matchesSearch && job.completedAt
    if (statusFilter === 'rejected') return matchesSearch && job.rejectedAt

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-blue-950">My Jobs</h1>
        <p className="text-slate-500 mt-1">Manage your assigned service requests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search jobs..."
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

      {/* Jobs list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            <Briefcase className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-blue-950">No jobs found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchQuery || statusFilter ? 'Try adjusting your filters' : 'Jobs will appear here when assigned to you'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map(job => {
            const status = getJobStatus(job)
            return (
              <Card
                key={job.id}
                className="cursor-pointer group"
                onClick={() => setSelectedJob(job)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge className={getPriorityColor(job.serviceRequest.priority)}>
                      {job.serviceRequest.priority}
                    </Badge>
                    <Badge className={status === 'rejected'
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : getStatusColor(job.serviceRequest.status)}
                    >
                      {status === 'pending' ? 'Pending Acceptance'
                        : status === 'rejected' ? 'Rejected'
                        : status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-blue-950 truncate group-hover:text-amber-600 transition-colors">
                    {job.serviceRequest.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1.5 line-clamp-2">
                    {job.serviceRequest.description}
                  </p>

                  {/* Show rejection reason preview */}
                  {job.rejectedAt && job.rejectionReason && (
                    <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-100">
                      <p className="text-xs text-red-600 line-clamp-2">
                        <span className="font-medium">Reason: </span>{job.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-amber-500" />
                      <span className="truncate max-w-[120px] font-medium">{job.serviceRequest.property.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{formatDate(job.assignedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Job details dialog */}
      <Dialog open={!!selectedJob && !showRejectDialog} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-blue-950 text-lg">{selectedJob.serviceRequest.title}</h3>
                <p className="text-sm text-slate-500 mt-2">{selectedJob.serviceRequest.description}</p>
              </div>

              <div className="flex gap-2">
                <Badge className={getStatusColor(selectedJob.serviceRequest.status)}>
                  {selectedJob.serviceRequest.status.replace('_', ' ')}
                </Badge>
                <Badge className={getPriorityColor(selectedJob.serviceRequest.priority)}>
                  {selectedJob.serviceRequest.priority}
                </Badge>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Property</p>
                  <p className="font-semibold text-blue-950">{selectedJob.serviceRequest.property.name}</p>
                  <p className="text-sm text-slate-500">
                    {selectedJob.serviceRequest.property.address}, {selectedJob.serviceRequest.property.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="font-semibold text-blue-950">{selectedJob.serviceRequest.category?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Assigned</p>
                  <p className="font-semibold text-blue-950">{formatDate(selectedJob.assignedAt)}</p>
                </div>
              </div>

              {/* Show rejection info if rejected */}
              {selectedJob.rejectedAt && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-700">Job Rejected</p>
                        <p className="text-sm text-red-600 mt-1">
                          Rejected on {formatDate(selectedJob.rejectedAt)}
                        </p>
                        {selectedJob.rejectionReason && (
                          <p className="text-sm text-red-600 mt-2">
                            <span className="font-medium">Reason: </span>
                            {selectedJob.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons based on status */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                {!selectedJob.acceptedAt && !selectedJob.rejectedAt && (
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                      onClick={() => updateJobStatus(selectedJob.id, 'accept')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      Accept Job
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      onClick={handleRejectClick}
                      disabled={isUpdating}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                  </div>
                )}
                {selectedJob.acceptedAt && !selectedJob.startedAt && (
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => updateJobStatus(selectedJob.id, 'start')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                    Start Work
                  </Button>
                )}
                {selectedJob.startedAt && !selectedJob.completedAt && (
                  <Button
                    className="w-full"
                    onClick={() => updateJobStatus(selectedJob.id, 'complete')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Mark Complete
                  </Button>
                )}
                {selectedJob.completedAt && (
                  <div className="text-center py-2">
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Completed on {formatDate(selectedJob.completedAt)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rejection reason dialog */}
      <Dialog open={showRejectDialog} onOpenChange={handleCloseRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Decline Job
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Please provide a reason for declining this job assignment. This will be recorded and visible to the admin.
            </p>
            <div>
              <Label htmlFor="rejectionReason">Reason for declining</Label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value)
                  setRejectError('')
                }}
                rows={4}
                placeholder="e.g., Schedule conflict, outside service area, job requires different expertise..."
                className="mt-1.5 flex w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
              />
              {rejectError && (
                <p className="mt-1.5 text-sm text-red-500">{rejectError}</p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseRejectDialog}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmReject}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Confirm Decline
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
