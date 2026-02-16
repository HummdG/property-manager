'use client'

import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const inquiryTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'RENT', label: 'Rent' },
  { value: 'SALE', label: 'Sale' },
  { value: 'MAINTENANCE', label: 'Maintenance' }
]

const inquiryStatuses = [
  { value: 'all', label: 'All Status' },
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
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Type tabs */}
      <div className="flex flex-wrap gap-2">
        {inquiryTypes.map((type) => (
          <Button
            key={type.value}
            variant="outline"
            size="sm"
            onClick={() => onFilterChange({ type: type.value })}
            className={cn(
              'transition-all',
              filters.type === type.value
                ? 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200'
                : 'hover:bg-slate-100'
            )}
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <Filter className="h-4 w-4 text-slate-400 self-center mr-1" />
        {inquiryStatuses.map((status) => (
          <Button
            key={status.value}
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange({ status: status.value })}
            className={cn(
              'text-xs',
              filters.status === status.value
                ? 'bg-slate-200 text-slate-800'
                : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {status.label}
          </Button>
        ))}
      </div>
    </div>
  )
}



