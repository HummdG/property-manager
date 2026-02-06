'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InquiryCard, InquiryFilters, InquiryForm } from '@/components/agent'
import { useAgentStore } from '@/stores/agent-store'

export default function InquiriesPage() {
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  const statusFilter = searchParams.get('status')
  const typeFilter = searchParams.get('type')

  const {
    inquiries,
    inquiryFilters,
    inquiriesLoading,
    inquiriesPagination,
    setInquiries,
    setInquiryFilters,
    setInquiriesLoading,
    setInquiriesPagination,
    addInquiry
  } = useAgentStore()

  const [showForm, setShowForm] = useState(action === 'add')
  const [error, setError] = useState('')

  // Initialize filters from URL params
  useEffect(() => {
    if (statusFilter) {
      setInquiryFilters({ status: statusFilter })
    }
    if (typeFilter) {
      setInquiryFilters({ type: typeFilter })
    }
  }, [statusFilter, typeFilter, setInquiryFilters])

  const fetchInquiries = useCallback(async () => {
    setInquiriesLoading(true)
    setError('')

    try {
      const params = new URLSearchParams()
      params.set('page', inquiriesPagination.page.toString())
      params.set('limit', inquiriesPagination.limit.toString())

      if (inquiryFilters.type !== 'all') {
        params.set('type', inquiryFilters.type)
      }
      if (inquiryFilters.status !== 'all') {
        params.set('status', inquiryFilters.status)
      }
      if (inquiryFilters.search) {
        params.set('search', inquiryFilters.search)
      }

      const response = await fetch(`/api/agent/inquiries?${params}`)
      if (!response.ok) throw new Error('Failed to fetch inquiries')

      const data = await response.json()
      setInquiries(data.inquiries)
      setInquiriesPagination(data.pagination)
    } catch (err) {
      setError(err.message)
    } finally {
      setInquiriesLoading(false)
    }
  }, [
    inquiryFilters,
    inquiriesPagination.page,
    inquiriesPagination.limit,
    setInquiries,
    setInquiriesLoading,
    setInquiriesPagination
  ])

  useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

  const handleFilterChange = (filters) => {
    setInquiryFilters(filters)
    setInquiriesPagination({ ...inquiriesPagination, page: 1 })
  }

  const handleInquiryCreated = (inquiry) => {
    addInquiry(inquiry)
    setShowForm(false)
  }

  const handlePageChange = (newPage) => {
    setInquiriesPagination({ ...inquiriesPagination, page: newPage })
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Inquiries</h1>
          <p className="text-slate-500 mt-1">Manage all your client inquiries</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Inquiry
        </Button>
      </div>

      {/* Filters */}
      <InquiryFilters
        filters={inquiryFilters}
        onFilterChange={handleFilterChange}
      />

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading state */}
      {inquiriesLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">No inquiries found</p>
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add your first inquiry
          </Button>
        </div>
      ) : (
        <>
          {/* Inquiries list */}
          <div className="space-y-4">
            {inquiries.map(inquiry => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} />
            ))}
          </div>

          {/* Pagination */}
          {inquiriesPagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(inquiriesPagination.page - 1)}
                disabled={inquiriesPagination.page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-slate-500">
                Page {inquiriesPagination.page} of {inquiriesPagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(inquiriesPagination.page + 1)}
                disabled={inquiriesPagination.page === inquiriesPagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* New inquiry form */}
      <InquiryForm
        open={showForm}
        onOpenChange={setShowForm}
        onSuccess={handleInquiryCreated}
      />
    </div>
  )
}


