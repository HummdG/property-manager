'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, Building2, MapPin, Bed, Bath, Square,
  Loader2, SlidersHorizontal, ChevronLeft, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'

const propertyTypeLabels = {
  HOUSE: 'House',
  APARTMENT: 'Apartment',
  CONDO: 'Condo',
  TOWNHOUSE: 'Townhouse',
  COMMERCIAL: 'Commercial',
  LAND: 'Land',
  OTHER: 'Other'
}

const listingTypeLabels = {
  RENT: 'For Rent',
  SALE: 'For Sale',
  BOTH: 'Rent & Sale'
}

function PropertyListingCard({ property }) {
  const price = property.listingType === 'SALE'
    ? property.salePrice
    : property.monthlyRent

  const priceLabel = property.listingType === 'SALE'
    ? ''
    : '/mo'

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="group border-slate-200 bg-white hover:shadow-xl hover:shadow-blue-950/5 transition-all duration-300 overflow-hidden cursor-pointer h-full">
        {/* Image / Placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
          {property.images?.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Building2 className="h-10 w-10 text-slate-300" />
              </div>
            </div>
          )}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-white/95 text-slate-700 border-slate-200 backdrop-blur-sm">
              {propertyTypeLabels[property.type] || property.type}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge className={
              property.listingType === 'SALE'
                ? 'bg-blue-100 text-blue-700 border-blue-200'
                : 'bg-emerald-100 text-emerald-700 border-emerald-200'
            }>
              {listingTypeLabels[property.listingType] || property.listingType}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Price */}
          {price && (
            <div className="mb-2">
              <span className="text-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                {formatCurrency(price * 100)}
              </span>
              {priceLabel && (
                <span className="text-sm text-slate-400">{priceLabel}</span>
              )}
            </div>
          )}

          {/* Name & Location */}
          <h3 className="font-bold text-blue-950 truncate group-hover:text-amber-600 transition-colors">
            {property.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
            <span className="truncate">{property.address}, {property.city}</span>
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-sm text-slate-500">
            {property.bedrooms && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-slate-400" />
                <span className="font-medium">{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-slate-400" />
                <span className="font-medium">{property.bathrooms} Baths</span>
              </div>
            )}
            {property.squareFeet && (
              <div className="flex items-center gap-1.5">
                <Square className="h-4 w-4 text-slate-400" />
                <span className="font-medium">{property.squareFeet.toLocaleString()} sqft</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function PublicPropertiesPage() {
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [listingType, setListingType] = useState('ALL')
  const [propertyType, setPropertyType] = useState('ALL')
  const [sortBy, setSortBy] = useState('createdAt')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState('ALL')
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const fetchProperties = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '12')

      if (listingType !== 'ALL') params.set('listingType', listingType)
      if (propertyType !== 'ALL') params.set('type', propertyType)
      if (selectedCity !== 'ALL') params.set('city', selectedCity)
      if (searchQuery) params.set('search', searchQuery)
      if (sortBy === 'price') {
        params.set('sortBy', 'price')
        params.set('sortOrder', 'asc')
      } else if (sortBy === 'priceDesc') {
        params.set('sortBy', 'price')
        params.set('sortOrder', 'desc')
      } else {
        params.set('sortBy', sortBy)
      }

      const response = await fetch(`/api/public/properties?${params}`)
      const data = await response.json()

      if (response.ok) {
        setProperties(data.properties || [])
        setPagination(data.pagination || null)
        if (data.filterOptions?.cities) {
          setCities(data.filterOptions.cities)
        }
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page, listingType, propertyType, selectedCity, searchQuery, sortBy])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  useEffect(() => {
    setPage(1)
  }, [listingType, propertyType, selectedCity, searchQuery, sortBy])

  function handleSearch (e) {
    e.preventDefault()
    setPage(1)
    fetchProperties()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-950">
          Find Your Perfect Property
        </h1>
        <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
          Browse premium properties for rent and sale. Find homes, apartments, and commercial spaces.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search by name, address, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-base rounded-xl border-slate-200 shadow-sm focus:shadow-md transition-shadow"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg"
        >
          Search
        </Button>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>

        <Select value={listingType} onValueChange={setListingType}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Listing Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="RENT">For Rent</SelectItem>
            <SelectItem value="SALE">For Sale</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Newest First</SelectItem>
            <SelectItem value="price">Price: Low to High</SelectItem>
            <SelectItem value="priceDesc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        {pagination && (
          <span className="text-sm text-slate-500 ml-auto">
            {pagination.total} {pagination.total === 1 ? 'property' : 'properties'} found
          </span>
        )}
      </div>

      {/* Expanded filters */}
      {isFiltersOpen && (
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Properties</SelectItem>
              {Object.entries(propertyTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {cities.length > 0 && (
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setListingType('ALL')
              setPropertyType('ALL')
              setSelectedCity('ALL')
              setSearchQuery('')
              setSortBy('createdAt')
            }}
            className="text-slate-500 hover:text-slate-700"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Properties grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
            <Building2 className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-blue-950">No properties found</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-md">
            {searchQuery || listingType !== 'ALL' || propertyType !== 'ALL'
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'There are no properties listed at the moment. Check back soon!'}
          </p>
          {(searchQuery || listingType !== 'ALL' || propertyType !== 'ALL') && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setListingType('ALL')
                setPropertyType('ALL')
                setSelectedCity('ALL')
                setSearchQuery('')
                setSortBy('createdAt')
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map(property => (
              <PropertyListingCard key={property.id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) {
                      acc.push('...')
                    }
                    acc.push(p)
                    return acc
                  }, [])
                  .map((item, i) =>
                    item === '...' ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-slate-400">…</span>
                    ) : (
                      <Button
                        key={item}
                        variant={item === page ? 'default' : 'outline'}
                        size="sm"
                        className={item === page ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}
                        onClick={() => setPage(item)}
                      >
                        {item}
                      </Button>
                    )
                  )}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
