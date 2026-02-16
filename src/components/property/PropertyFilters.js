'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const listingTypes = [
  { value: 'ALL', label: 'All Listings' },
  { value: 'RENT', label: 'For Rent' },
  { value: 'SALE', label: 'For Sale' }
]

const propertyTypes = [
  { value: 'ALL', label: 'All Types' },
  { value: 'HOUSE', label: 'House' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'CONDO', label: 'Condo' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'LAND', label: 'Land' }
]

const bedroomOptions = [
  { value: '', label: 'Any' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5+' }
]

export function PropertyFilters({ cities = [], initialFilters = {} }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(initialFilters.search || '')
  const [filters, setFilters] = useState({
    listingType: initialFilters.listingType || 'ALL',
    type: initialFilters.type || 'ALL',
    city: initialFilters.city || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    bedrooms: initialFilters.bedrooms || ''
  })

  const updateURL = useCallback((newFilters, newSearch) => {
    const params = new URLSearchParams()
    
    if (newSearch) params.set('search', newSearch)
    if (newFilters.listingType && newFilters.listingType !== 'ALL') {
      params.set('listingType', newFilters.listingType)
    }
    if (newFilters.type && newFilters.type !== 'ALL') {
      params.set('type', newFilters.type)
    }
    if (newFilters.city) params.set('city', newFilters.city)
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice)
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice)
    if (newFilters.bedrooms) params.set('bedrooms', newFilters.bedrooms)
    
    router.push(`/properties?${params.toString()}`)
  }, [router])

  const handleSearch = (e) => {
    e.preventDefault()
    updateURL(filters, search)
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateURL(newFilters, search)
  }

  const clearFilters = () => {
    setSearch('')
    setFilters({
      listingType: 'ALL',
      type: 'ALL',
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: ''
    })
    router.push('/properties')
  }

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'listingType' || key === 'type') return value && value !== 'ALL'
    return value
  }).length + (search ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by location, name, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white border-slate-200 focus:border-amber-300 focus:ring-amber-200"
          />
        </div>
        <Button type="submit" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20">
          Search
        </Button>
      </form>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Listing Type Toggle */}
        <div className="flex rounded-lg border border-slate-200 bg-white p-1">
          {listingTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleFilterChange('listingType', type.value)}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                filters.listingType === type.value
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-950 hover:bg-slate-50'
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Property Type */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-950">
              {propertyTypes.find(t => t.value === filters.type)?.label || 'Property Type'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 p-2">
            {propertyTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleFilterChange('type', type.value)}
                className={cn(
                  'w-full px-3 py-2 text-sm text-left rounded-md transition-colors',
                  filters.type === type.value
                    ? 'bg-amber-50 text-amber-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                {type.label}
              </button>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Bedrooms */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-950">
              {filters.bedrooms ? `${filters.bedrooms} Bed${filters.bedrooms !== '1' ? 's' : ''}` : 'Bedrooms'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36 p-2">
            {bedroomOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFilterChange('bedrooms', option.value)}
                className={cn(
                  'w-full px-3 py-2 text-sm text-left rounded-md transition-colors',
                  filters.bedrooms === option.value
                    ? 'bg-amber-50 text-amber-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                {option.label} {option.value && 'Bedroom' + (option.value !== '1' ? 's' : '')}
              </button>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* City */}
        {cities.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-950">
                {filters.city || 'All Cities'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 p-2 max-h-60 overflow-y-auto">
              <button
                onClick={() => handleFilterChange('city', '')}
                className={cn(
                  'w-full px-3 py-2 text-sm text-left rounded-md transition-colors',
                  !filters.city
                    ? 'bg-amber-50 text-amber-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                All Cities
              </button>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleFilterChange('city', city)}
                  className={cn(
                    'w-full px-3 py-2 text-sm text-left rounded-md transition-colors',
                    filters.city === city
                      ? 'bg-amber-50 text-amber-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  {city}
                </button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Price Range */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-950">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Price Range
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-slate-500">Min Price (AED)</Label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500">Max Price (AED)</Label>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="mt-1"
                />
              </div>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => updateURL(filters, search)}
              >
                Apply Price Filter
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-slate-500 hover:text-red-600"
          >
            <X className="mr-1 h-4 w-4" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Search: {search}
              <button onClick={() => { setSearch(''); updateURL(filters, '') }} className="ml-1 hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.listingType && filters.listingType !== 'ALL' && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              {listingTypes.find(t => t.value === filters.listingType)?.label}
              <button onClick={() => handleFilterChange('listingType', 'ALL')} className="ml-1 hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.type && filters.type !== 'ALL' && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              {propertyTypes.find(t => t.value === filters.type)?.label}
              <button onClick={() => handleFilterChange('type', 'ALL')} className="ml-1 hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.city && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              {filters.city}
              <button onClick={() => handleFilterChange('city', '')} className="ml-1 hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.bedrooms && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              {filters.bedrooms} Bedrooms
              <button onClick={() => handleFilterChange('bedrooms', '')} className="ml-1 hover:text-red-600">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              {filters.minPrice && `AED ${parseInt(filters.minPrice).toLocaleString()}`}
              {filters.minPrice && filters.maxPrice && ' - '}
              {filters.maxPrice && `AED ${parseInt(filters.maxPrice).toLocaleString()}`}
              <button 
                onClick={() => {
                  const newFilters = { ...filters, minPrice: '', maxPrice: '' }
                  setFilters(newFilters)
                  updateURL(newFilters, search)
                }} 
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}



