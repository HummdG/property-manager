'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, Building2, MapPin, Bed, Bath, Square,
  Loader2, ChevronLeft, ChevronRight, SlidersHorizontal, X,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const PROPERTY_TYPE_LABELS = {
  HOUSE: 'House',
  APARTMENT: 'Apartment',
  CONDO: 'Condo',
  TOWNHOUSE: 'Townhouse',
  COMMERCIAL: 'Commercial',
  LAND: 'Land',
  OTHER: 'Other',
}

const LISTING_TYPE_LABELS = {
  RENT: 'For Rent',
  SALE: 'For Sale',
  BOTH: 'Rent & Sale',
}

function PropertyCard({ property }) {
  const price = property.listingType === 'SALE' ? property.salePrice : property.monthlyRent
  const priceLabel = property.listingType === 'SALE' ? '' : '/mo'
  const isRent = property.listingType === 'RENT' || property.listingType === 'BOTH'

  return (
    <Link href={`/properties/${property.id}`} className="group block h-full">
      <div className="bg-cream border border-wire group-hover:border-sable/25 group-hover:bg-white transition-all duration-200 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-linen overflow-hidden flex-shrink-0">
          {property.images?.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.name}
              className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 className="w-10 h-10 text-wire" />
            </div>
          )}
          {/* Tags */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="text-[0.6rem] border border-wire bg-cream/95 text-pewter uppercase tracking-[0.12em] px-2 py-1 backdrop-blur-sm">
              {PROPERTY_TYPE_LABELS[property.type] || property.type}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`text-[0.6rem] border uppercase tracking-[0.12em] px-2 py-1 ${
              isRent
                ? 'border-bronze/30 bg-bronze/10 text-bronze'
                : 'border-sable/25 bg-sable/10 text-sable'
            }`}>
              {LISTING_TYPE_LABELS[property.listingType] || property.listingType}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          {/* Price */}
          {price && (
            <div className="mb-3">
              <span className="font-display text-[1.5rem] font-medium text-sable leading-none">
                {formatCurrency(price * 100)}
              </span>
              {priceLabel && (
                <span className="text-[0.75rem] text-fog ml-1">{priceLabel}</span>
              )}
            </div>
          )}

          {/* Name */}
          <h3 className="text-[0.9375rem] font-medium text-sable truncate mb-1.5 group-hover:text-cobalt transition-colors">
            {property.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-[0.8125rem] text-fog mb-4">
            <MapPin className="w-3.5 h-3.5 text-bronze flex-shrink-0" />
            <span className="truncate">{property.address}, {property.city}</span>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-5 border-t border-wire pt-4 mt-auto text-[0.8125rem] text-fog">
            {property.bedrooms && (
              <div className="flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-wire" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1.5">
                <Bath className="w-3.5 h-3.5 text-wire" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.squareFeet && (
              <div className="flex items-center gap-1.5">
                <Square className="w-3.5 h-3.5 text-wire" />
                <span>{property.squareFeet.toLocaleString()} sqft</span>
              </div>
            )}
          </div>
        </div>
      </div>
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
        if (data.filterOptions?.cities) setCities(data.filterOptions.cities)
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page, listingType, propertyType, selectedCity, searchQuery, sortBy])

  useEffect(() => { fetchProperties() }, [fetchProperties])
  useEffect(() => { setPage(1) }, [listingType, propertyType, selectedCity, searchQuery, sortBy])

  function handleSearch(e) {
    e.preventDefault()
    setPage(1)
    fetchProperties()
  }

  function clearFilters() {
    setListingType('ALL')
    setPropertyType('ALL')
    setSelectedCity('ALL')
    setSearchQuery('')
    setSortBy('createdAt')
  }

  const hasActiveFilters = listingType !== 'ALL' || propertyType !== 'ALL' || selectedCity !== 'ALL' || searchQuery

  return (
    <div>
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="bg-sable border-b border-bronze/10">
        <div className="inst-container py-14">
          <div className="inst-hero-grid absolute inset-0 pointer-events-none" />
          <span className="inst-label-light">UAE Property Listings</span>
          <h1
            className="font-display font-light text-cream leading-tight max-w-xl"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Browse Properties for Rent & Sale
          </h1>
          <p className="text-haze text-[0.9375rem] mt-4 max-w-lg font-light">
            Residential and commercial properties across Dubai, Abu Dhabi,
            and Sharjah, all managed by Impervia Estates.
          </p>
        </div>
      </div>

      {/* ── Search & filters ────────────────────────────────── */}
      <div className="bg-cream border-b border-wire">
        <div className="inst-container py-5">
          {/* Search row */}
          <form onSubmit={handleSearch} className="flex items-center gap-3 mb-4">
            <div className="flex flex-1 border border-wire bg-[#F9F7F4] focus-within:border-bronze transition-colors duration-150">
              <div className="flex items-center pl-3.5 pointer-events-none flex-shrink-0">
                <Search className="w-4 h-4 text-fog" />
              </div>
              <input
                type="text"
                className="flex-1 bg-transparent py-[0.625rem] px-3 text-[0.875rem] text-sable outline-none placeholder:text-[#A0AEC0]"
                placeholder="Search by name, address, or city…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-sable text-cream px-5 py-[0.625rem] text-[0.8125rem] tracking-wide hover:bg-cobalt transition-colors duration-150 flex-shrink-0"
              >
                Search
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`flex items-center gap-2 border px-4 py-[0.625rem] text-[0.8125rem] transition-colors duration-150 flex-shrink-0 ${
                isFiltersOpen ? 'border-sable bg-sable text-cream' : 'border-wire bg-cream text-pewter hover:bg-linen'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>
          </form>

          {/* Quick filters row */}
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
              className="inst-input w-auto text-[0.8125rem] pr-8"
              style={{ minWidth: 130 }}
            >
              <option value="ALL">All Types</option>
              <option value="RENT">For Rent</option>
              <option value="SALE">For Sale</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="inst-input w-auto text-[0.8125rem] pr-8"
              style={{ minWidth: 160 }}
            >
              <option value="createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-[0.75rem] text-fog hover:text-sable transition-colors"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            )}

            {pagination && (
              <span className="text-[0.75rem] text-fog ml-auto">
                {pagination.total} {pagination.total === 1 ? 'property' : 'properties'}
              </span>
            )}
          </div>

          {/* Expanded filters */}
          {isFiltersOpen && (
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-wire">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="inst-input w-auto text-[0.8125rem] pr-8"
                style={{ minWidth: 160 }}
              >
                <option value="ALL">All Property Types</option>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              {cities.length > 0 && (
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="inst-input w-auto text-[0.8125rem] pr-8"
                  style={{ minWidth: 140 }}
                >
                  <option value="ALL">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Listings ────────────────────────────────────────── */}
      <div className="inst-container py-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-7 h-7 animate-spin text-bronze" />
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 border border-wire bg-cream flex items-center justify-center mb-5">
              <Building2 className="w-8 h-8 text-wire" />
            </div>
            <h3 className="font-display text-xl font-medium text-sable mb-2">No properties found</h3>
            <p className="text-[0.875rem] text-fog max-w-sm mb-6">
              {hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'No properties are currently listed. Check back soon.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="border border-wire text-sable text-[0.8125rem] px-5 py-2.5 hover:bg-linen transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex items-center gap-1 border border-wire text-pewter text-[0.8125rem] px-3 py-2 hover:bg-linen transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Prev
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('…')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((item, i) =>
                    item === '…' ? (
                      <span key={`e-${i}`} className="px-2 text-fog text-[0.8125rem]">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`min-w-[36px] py-2 text-[0.8125rem] border transition-colors ${
                          item === page
                            ? 'bg-sable text-cream border-sable'
                            : 'border-wire text-pewter hover:bg-linen'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 border border-wire text-pewter text-[0.8125rem] px-3 py-2 hover:bg-linen transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
