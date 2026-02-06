import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const agentId = searchParams.get('agentId')
    const skip = (page - 1) * limit

    const where = {}

    // Filter by agent if specified
    if (agentId && agentId !== 'all') {
      where.agentId = agentId
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

    const [inquiries, total, agents] = await Promise.all([
      db.inquiry.findMany({
        where,
        include: {
          property: {
            select: { id: true, name: true, address: true, city: true }
          },
          agent: {
            include: {
              user: {
                select: { id: true, name: true, email: true }
              }
            }
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
      db.inquiry.count({ where }),
      db.agentProfile.findMany({
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      })
    ])

    return NextResponse.json({
      inquiries,
      agents,
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


