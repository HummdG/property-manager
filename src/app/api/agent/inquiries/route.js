import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

async function getAgentProfile(userId) {
  return db.agentProfile.findUnique({
    where: { userId }
  })
}

export async function GET(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agentProfile = await getAgentProfile(session.user.id)
    if (!agentProfile && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const skip = (page - 1) * limit

    const where = {}

    // Filter by agent unless admin
    if (session.user.role !== 'ADMIN') {
      where.agentId = agentProfile.id
    }

    // Type filter
    if (type && type !== 'all') {
      where.type = type.toUpperCase()
    }

    // Status filter
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    // Search filter
    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: 'insensitive' } },
        { clientEmail: { contains: search, mode: 'insensitive' } },
        { clientPhone: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [inquiries, total] = await Promise.all([
      db.inquiry.findMany({
        where,
        include: {
          property: {
            select: { id: true, name: true, address: true, city: true }
          },
          agent: {
            select: { id: true, userId: true }
          },
          followUps: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.inquiry.count({ where })
    ])

    return NextResponse.json({
      inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let agentProfile = await getAgentProfile(session.user.id)
    
    // Auto-create agent profile if doesn't exist
    if (!agentProfile) {
      agentProfile = await db.agentProfile.create({
        data: { userId: session.user.id }
      })
    }

    const body = await request.json()
    const {
      type,
      propertyId,
      clientName,
      clientEmail,
      clientPhone,
      message,
      budget,
      preferredArea,
      source
    } = body

    // Validation
    if (!type || !clientName || !clientEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: type, clientName, clientEmail' },
        { status: 400 }
      )
    }

    // Validate type
    if (!['RENT', 'SALE', 'MAINTENANCE'].includes(type.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid inquiry type. Must be RENT, SALE, or MAINTENANCE' },
        { status: 400 }
      )
    }

    // Verify property exists if provided
    if (propertyId) {
      const property = await db.property.findUnique({
        where: { id: propertyId }
      })
      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 })
      }
    }

    const inquiry = await db.inquiry.create({
      data: {
        type: type.toUpperCase(),
        agentId: agentProfile.id,
        propertyId: propertyId || null,
        clientName,
        clientEmail,
        clientPhone: clientPhone || null,
        message: message || null,
        budget: budget ? parseInt(budget) : null,
        preferredArea: preferredArea || null,
        source: source || 'direct',
        status: 'OPEN'
      },
      include: {
        property: {
          select: { id: true, name: true, address: true }
        }
      }
    })

    return NextResponse.json({ inquiry }, { status: 201 })
  } catch (error) {
    console.error('Error creating inquiry:', error)
    return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 })
  }
}


