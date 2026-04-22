'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const inquiryTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'RENT', label: 'Rent' },
  { value: 'SALE', label: 'Sale' }
]

const inquiryStatuses = [
  { value: 'all', label: 'All' },
  { value: 'OPEN', label: 'Open' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'MEETING_SCHEDULED', label: 'Meeting Scheduled' },
  { value: 'FOLLOW_UP', label: 'Follow Up' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'CLOSED', label: 'Closed' }
]

export function InquiryFilters({ filters, onFilterChange }) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-haze" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="w-full bg-cream border border-wire pl-9 pr-3 py-2 text-[0.8125rem] text-sable placeholder:text-haze focus:outline-none focus:border-bronze/50 transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-px border border-wire bg-wire">
        {inquiryTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onFilterChange({ type: type.value })}
            className={cn(
              'px-4 py-2 text-[0.7rem] uppercase tracking-[0.08em] font-medium transition-colors',
              filters.type === type.value
                ? 'bg-sable text-cream'
                : 'bg-cream text-fog hover:bg-linen hover:text-sable'
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {inquiryStatuses.map((status) => (
          <button
            key={status.value}
            onClick={() => onFilterChange({ status: status.value })}
            className={cn(
              'px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.08em] font-medium border transition-colors',
              filters.status === status.value
                ? 'bg-bronze/10 text-bronze border-bronze/40'
                : 'bg-cream text-fog border-wire hover:bg-linen hover:text-sable'
            )}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  )
}
