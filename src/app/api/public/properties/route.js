import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit
    
    // Filters
    const listingType = searchParams.get('listingType')
    const propertyType = searchParams.get('type')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const search = searchParams.get('search')
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause - only show listed properties
    const where = {
      isListed: true
    }

    if (listingType && listingType !== 'ALL') {
      where.listingType = listingType
    }

    if (propertyType && propertyType !== 'ALL') {
      where.type = propertyType
    }

    if (city) {
      where.city = {
        contains: city,
        mode: 'insensitive'
      }
    }

    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms)
    }

    // Price filtering based on listing type
    if (minPrice || maxPrice) {
      const priceFilter = {}
      if (minPrice) priceFilter.gte = parseInt(minPrice)
      if (maxPrice) priceFilter.lte = parseInt(maxPrice)
      
      // Apply price filter to appropriate field based on listing type
      if (listingType === 'SALE') {
        where.salePrice = priceFilter
      } else if (listingType === 'RENT') {
        where.monthlyRent = priceFilter
      } else {
        // For ALL or BOTH, check either field
        where.OR = [
          { monthlyRent: priceFilter },
          { salePrice: priceFilter }
        ]
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Build orderBy
    const orderBy = {}
    if (sortBy === 'price') {
      orderBy.monthlyRent = sortOrder
    } else {
      orderBy[sortBy] = sortOrder
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
        orderBy,
        skip,
        take: limit
      }),
      db.property.count({ where })
    ])

    // Get unique cities for filter options
    const cities = await db.property.findMany({
      where: { isListed: true },
      select: { city: true },
      distinct: ['city'],
      orderBy: { city: 'asc' }
    })

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filterOptions: {
        cities: cities.map(c => c.city)
      }
    })
  } catch (error) {
    console.error('Error fetching public properties:', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

