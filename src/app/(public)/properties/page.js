import { Suspense } from 'react'
import { Building2, Loader2 } from 'lucide-react'
import { PublicPropertyCard, PropertyFilters } from '@/components/property'
import { db } from '@/lib/db'

async function getProperties(searchParams) {
  try {
    const page = parseInt(searchParams.page || '1')
    const limit = 12
    const skip = (page - 1) * limit

    const { listingType, type: propertyType, city, minPrice, maxPrice, bedrooms, search } = searchParams

    // Build where clause - only show listed properties
    const where = { isListed: true }

    if (listingType && listingType !== 'ALL') {
      where.listingType = listingType
    }

    if (propertyType && propertyType !== 'ALL') {
      where.type = propertyType
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms)
    }

    if (minPrice || maxPrice) {
      const priceFilter = {}
      if (minPrice) priceFilter.gte = parseInt(minPrice)
      if (maxPrice) priceFilter.lte = parseInt(maxPrice)

      if (listingType === 'SALE') {
        where.salePrice = priceFilter
      } else if (listingType === 'RENT') {
        where.monthlyRent = priceFilter
      } else {
        where.OR = [
          { monthlyRent: priceFilter },
          { salePrice: priceFilter }
        ]
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [properties, total] = await Promise.all([
      db.property.findMany({
        where,
        select: {
          id: true,
          name: true,
          address: true,
          city: true,
          postcode: true,
          country: true,
          type: true,
          listingType: true,
          bedrooms: true,
          bathrooms: true,
          squareFeet: true,
          description: true,
          images: true,
          monthlyRent: true,
          salePrice: true,
          createdAt: true,
          owner: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.property.count({ where })
    ])

    const cities = await db.property.findMany({
      where: { isListed: true },
      select: { city: true },
      distinct: ['city'],
      orderBy: { city: 'asc' }
    })

    return {
      properties,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      filterOptions: { cities: cities.map(c => c.city) }
    }
  } catch (error) {
    console.error('Error fetching properties:', error)
    return { properties: [], pagination: { total: 0, totalPages: 0 }, filterOptions: { cities: [] } }
  }
}

function PropertiesLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500 mx-auto" />
        <p className="mt-4 text-slate-500">Loading properties...</p>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-100 to-slate-50">
        <Building2 className="h-12 w-12 text-slate-300" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-blue-950">No properties found</h3>
      <p className="mt-2 text-slate-500 max-w-md">
        We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
      </p>
    </div>
  )
}

async function PropertiesGrid({ searchParams }) {
  const data = await getProperties(searchParams)
  const { properties, pagination, filterOptions } = data

  return (
    <>
      {/* Filters */}
      <PropertyFilters 
        cities={filterOptions?.cities || []}
        initialFilters={{
          search: searchParams.search || '',
          listingType: searchParams.listingType || 'ALL',
          type: searchParams.type || 'ALL',
          city: searchParams.city || '',
          minPrice: searchParams.minPrice || '',
          maxPrice: searchParams.maxPrice || '',
          bedrooms: searchParams.bedrooms || ''
        }}
      />

      {/* Results count */}
      <div className="flex items-center justify-between mt-8 mb-6">
        <p className="text-slate-600">
          <span className="font-semibold text-blue-950">{pagination?.total || 0}</span> properties found
        </p>
      </div>

      {/* Properties Grid */}
      {properties && properties.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map(property => (
            <PublicPropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <a
                key={page}
                href={`/properties?${new URLSearchParams({
                  ...searchParams,
                  page: page.toString()
                }).toString()}`}
                className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === (parseInt(searchParams.page) || 1)
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-950'
                }`}
              >
                {page}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}

export default async function PropertiesPage({ searchParams }) {
  const params = await searchParams

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-950 mb-4">
          Find Your Perfect Property
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Browse our curated selection of premium properties available for rent or sale across the UAE
        </p>
      </div>

      {/* Main Content */}
      <Suspense fallback={<PropertiesLoading />}>
        <PropertiesGrid searchParams={params} />
      </Suspense>
    </div>
  )
}

