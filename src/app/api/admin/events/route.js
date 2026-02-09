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
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const entity = searchParams.get('entity')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const search = searchParams.get('search')
    const skip = (page - 1) * limit

    const where = {}

    if (type && type !== 'all') {
      where.type = type
    }

    if (entity && entity !== 'all') {
      where.entity = entity
    }

    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        const endDate = new Date(dateTo)
        endDate.setHours(23, 59, 59, 999)
        where.createdAt.lte = endDate
      }
    }

    if (search) {
      where.OR = [
        { type: { contains: search, mode: 'insensitive' } },
        { entity: { contains: search, mode: 'insensitive' } },
        { action: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [events, total, typeStats, entityStats] = await Promise.all([
      db.systemEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.systemEvent.count({ where }),
      db.systemEvent.groupBy({
        by: ['type'],
        _count: true,
        orderBy: { _count: { type: 'desc' } }
      }),
      db.systemEvent.groupBy({
        by: ['entity'],
        _count: true,
        orderBy: { _count: { entity: 'desc' } }
      })
    ])

    // Fetch user names for events that have userId
    const userIds = [...new Set(events.filter(e => e.userId).map(e => e.userId))]
    const users = userIds.length > 0
      ? await db.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true }
        })
      : []

    const userMap = users.reduce((acc, u) => {
      acc[u.id] = u
      return acc
    }, {})

    const eventsWithUsers = events.map(event => ({
      ...event,
      user: event.userId ? userMap[event.userId] || null : null
    }))

    return NextResponse.json({
      events: eventsWithUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalEvents: total,
        byType: typeStats.reduce((acc, item) => {
          acc[item.type] = item._count
          return acc
        }, {}),
        byEntity: entityStats.reduce((acc, item) => {
          acc[item.entity] = item._count
          return acc
        }, {})
      }
    })
  } catch (error) {
    console.error('Error fetching system events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

