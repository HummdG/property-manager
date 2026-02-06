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
    const status = searchParams.get('status')
    const propertyId = searchParams.get('propertyId')
    const skip = (page - 1) * limit

    let where = {}

    // Filter based on role
    if (session.user.role === 'OWNER') {
      where.property = { ownerId: session.user.id }
    } else if (session.user.role === 'TENANT') {
      where.requesterId = session.user.id
    } else if (session.user.role === 'TRADER') {
      where.jobAssignment = { traderId: session.user.id }
    }

    // Additional filters
    if (status) {
      where.status = status
    }
    if (propertyId) {
      where.propertyId = propertyId
    }

    const [requests, total] = await Promise.all([
      db.serviceRequest.findMany({
        where,
        include: {
          property: {
            select: { id: true, name: true, address: true, ownerId: true }
          },
          category: {
            select: { id: true, name: true, icon: true }
          },
          requester: {
            select: { id: true, name: true, email: true }
          },
          jobAssignment: {
            include: {
              trader: {
                select: { id: true, name: true, email: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.serviceRequest.count({ where })
    ])

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching service requests:', error)
    return NextResponse.json({ error: 'Failed to fetch service requests' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, propertyId, categoryId, priority } = body

    if (!title || !description || !propertyId || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify property access
    const property = await db.property.findUnique({
      where: { id: propertyId },
      include: { tenantProfiles: true }
    })

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Check if user can create request for this property
    const isOwner = property.ownerId === session.user.id
    const isTenant = property.tenantProfiles.some(tp => tp.userId === session.user.id)
    const isAdmin = session.user.role === 'ADMIN'

    if (!isOwner && !isTenant && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const serviceRequest = await db.serviceRequest.create({
      data: {
        title,
        description,
        propertyId,
        categoryId,
        requesterId: session.user.id,
        priority: priority || 'MEDIUM',
        status: 'PENDING'
      },
      include: {
        property: { select: { name: true } },
        category: { select: { name: true } }
      }
    })

    return NextResponse.json({ serviceRequest }, { status: 201 })
  } catch (error) {
    console.error('Error creating service request:', error)
    return NextResponse.json({ error: 'Failed to create service request' }, { status: 500 })
  }
}


