'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, Loader2, MessageSquare } from 'lucide-react'
import { InquiryCard, InquiryFilters, InquiryForm } from '@/components/agent'
import { useAgentStore } from '@/stores/agent-store'
import { cn } from '@/lib/utils'

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

  useEffect(() => {
    if (statusFilter) setInquiryFilters({ status: statusFilter })
    if (typeFilter) setInquiryFilters({ type: typeFilter })
  }, [statusFilter, typeFilter, setInquiryFilters])

  const fetchInquiries = useCallback(async () => {
    setInquiriesLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      params.set('page', inquiriesPagination.page.toString())
      params.set('limit', inquiriesPagination.limit.toString())
      if (inquiryFilters.type !== 'all') params.set('type', inquiryFilters.type)
      if (inquiryFilters.status !== 'all') params.set('status', inquiryFilters.status)
      if (inquiryFilters.search) params.set('search', inquiryFilters.search)

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
  }, [inquiryFilters, inquiriesPagination.page, inquiriesPagination.limit, setInquiries, setInquiriesLoading, setInquiriesPagination])

  useEffect(() => { fetchInquiries() }, [fetchInquiries])

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
    <div className="space-y-5">
      <div className="border-b border-wire pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.15em] text-fog font-medium">Agent Portal</p>
            <h1 className="font-display text-[1.875rem] font-light text-sable leading-tight mt-0.5">Inquiries</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-[0.75rem] uppercase tracking-[0.1em] font-medium bg-sable text-cream hover:bg-cobalt transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            New Inquiry
          </button>
        </div>
      </div>

      {/* Filters */}
      <InquiryFilters filters={inquiryFilters} onFilterChange={handleFilterChange} />

      {error && (
        <div className="px-5 py-3 border border-red-200 bg-red-50 text-[0.8125rem] text-red-600">{error}</div>
      )}

      {inquiriesLoading ? (
        <div className="flex items-center justify-center py-16 border border-wire bg-cream">
          <Loader2 className="h-5 w-5 animate-spin text-bronze" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-wire bg-cream text-center">
          <div className="w-14 h-14 border border-wire bg-linen flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6 text-haze" />
          </div>
          <p className="text-[0.8125rem] font-medium text-sable">No inquiries found</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 flex items-center gap-2 px-4 py-2 text-[0.75rem] uppercase tracking-[0.1em] font-medium border border-wire bg-cream text-fog hover:text-sable hover:bg-linen transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add your first inquiry
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {inquiries.map(inquiry => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} />
            ))}
          </div>

          {inquiriesPagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-[0.75rem] text-fog">
                Page {inquiriesPagination.page} of {inquiriesPagination.totalPages}
              </p>
              <div className="flex gap-0 border border-wire">
                <button
                  onClick={() => handlePageChange(inquiriesPagination.page - 1)}
                  disabled={inquiriesPagination.page === 1}
                  className="px-4 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium border-r border-wire bg-cream text-fog hover:text-sable hover:bg-linen disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(inquiriesPagination.page + 1)}
                  disabled={inquiriesPagination.page === inquiriesPagination.totalPages}
                  className="px-4 py-2 text-[0.7rem] uppercase tracking-[0.1em] font-medium bg-cream text-fog hover:text-sable hover:bg-linen disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <InquiryForm open={showForm} onOpenChange={setShowForm} onSuccess={handleInquiryCreated} />
    </div>
  )
}
