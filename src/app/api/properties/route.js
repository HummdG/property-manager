import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where = session.user.role === 'ADMIN'
      ? {}
      : { ownerId: session.user.id }

    const [properties, total] = await Promise.all([
      db.property.findMany({
        where,
        include: {
          owner: {
            select: { id: true, name: true, email: true }
          },
          tenantProfiles: {
            include: {
              user: {
                select: { id: true, name: true, email: true }
              }
            }
          },
          _count: {
            select: { serviceRequests: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.property.count({ where })
    ])

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, address, city, postcode, country, type, bedrooms, bathrooms, squareFeet, description, monthlyRent, isListed } = body

    if (!name || !address || !city || !postcode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const property = await db.property.create({
      data: {
        name,
        address,
        city,
        postcode,
        country: country || 'United Kingdom',
        type: type || 'HOUSE',
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        squareFeet: squareFeet ? parseInt(squareFeet) : null,
        description,
        monthlyRent: monthlyRent ? parseInt(monthlyRent) : null,
        isListed: isListed || false,
        ownerId: session.user.id
      }
    })

    return NextResponse.json({ property }, { status: 201 })
  } catch (error) {
    console.error('Error creating property:', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}

