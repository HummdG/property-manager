'use client'

import { useState, useEffect } from 'react'
import { Briefcase, Search, Loader2, MapPin, Calendar, CheckCircle, XCircle, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
  { value: 'completed', label: 'Completed' }
]

export default function TraderJobsPage() {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

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

  async function updateJobStatus(jobId, status) {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/trader/jobs/${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        setSelectedJob(null)
        fetchJobs()
      }
    } catch (error) {
      console.error('Failed to update job:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  function getJobStatus(job) {
    if (job.completedAt) return 'completed'
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
    if (statusFilter === 'pending') return matchesSearch && !job.acceptedAt
    if (statusFilter === 'accepted') return matchesSearch && job.acceptedAt && !job.completedAt
    if (statusFilter === 'completed') return matchesSearch && job.completedAt
    
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">My Jobs</h1>
        <p className="text-slate-400 mt-1">Manage your assigned service requests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search jobs..."
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

      {/* Jobs list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
            <Briefcase className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-200">No jobs found</h3>
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
                className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                onClick={() => setSelectedJob(job)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <Badge className={getPriorityColor(job.serviceRequest.priority)}>
                      {job.serviceRequest.priority}
                    </Badge>
                    <Badge className={getStatusColor(job.serviceRequest.status)}>
                      {status === 'pending' ? 'Pending Acceptance' : status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-slate-100 truncate">
                    {job.serviceRequest.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {job.serviceRequest.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-800 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[120px]">{job.serviceRequest.property.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
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
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-lg bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-xl">Job Details</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-200 text-lg">{selectedJob.serviceRequest.title}</h3>
                <p className="text-sm text-slate-400 mt-2">{selectedJob.serviceRequest.description}</p>
              </div>

              <div className="flex gap-2">
                <Badge className={getStatusColor(selectedJob.serviceRequest.status)}>
                  {selectedJob.serviceRequest.status.replace('_', ' ')}
                </Badge>
                <Badge className={getPriorityColor(selectedJob.serviceRequest.priority)}>
                  {selectedJob.serviceRequest.priority}
                </Badge>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Property</p>
                  <p className="text-slate-200">{selectedJob.serviceRequest.property.name}</p>
                  <p className="text-sm text-slate-400">
                    {selectedJob.serviceRequest.property.address}, {selectedJob.serviceRequest.property.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="text-slate-200">{selectedJob.serviceRequest.category?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Assigned</p>
                  <p className="text-slate-200">{formatDate(selectedJob.assignedAt)}</p>
                </div>
              </div>

              {/* Action buttons based on status */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                {!selectedJob.acceptedAt && (
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => updateJobStatus(selectedJob.id, 'accept')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      Accept Job
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={() => updateJobStatus(selectedJob.id, 'reject')}
                      disabled={isUpdating}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                  </div>
                )}
                {selectedJob.acceptedAt && !selectedJob.startedAt && (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => updateJobStatus(selectedJob.id, 'start')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                    Start Work
                  </Button>
                )}
                {selectedJob.startedAt && !selectedJob.completedAt && (
                  <Button
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600"
                    onClick={() => updateJobStatus(selectedJob.id, 'complete')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Mark Complete
                  </Button>
                )}
                {selectedJob.completedAt && (
                  <div className="text-center py-2">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
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
    </div>
  )
}

