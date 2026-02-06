import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const date = searchParams.get('date')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const skip = (page - 1) * limit

    // Verify agent exists
    const agent = await db.agentProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const where = { agentId: id }

    // Date filter - specific date
    if (date) {
      const targetDate = new Date(date)
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))
      where.timestamp = {
        gte: startOfDay,
        lte: endOfDay
      }
    } else if (dateFrom || dateTo) {
      // Date range filter
      where.timestamp = {}
      if (dateFrom) {
        where.timestamp.gte = new Date(dateFrom)
      }
      if (dateTo) {
        const endDate = new Date(dateTo)
        endDate.setHours(23, 59, 59, 999)
        where.timestamp.lte = endDate
      }
    }

    const [locations, total] = await Promise.all([
      db.agentLocationLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit
      }),
      db.agentLocationLog.count({ where })
    ])

    // Get location stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    const [locationsToday, locationsThisWeek, totalLocations] = await Promise.all([
      db.agentLocationLog.count({
        where: {
          agentId: id,
          timestamp: { gte: today }
        }
      }),
      db.agentLocationLog.count({
        where: {
          agentId: id,
          timestamp: { gte: startOfWeek }
        }
      }),
      db.agentLocationLog.count({ where: { agentId: id } })
    ])

    // Get dates with location data (for calendar highlight)
    const datesWithLocations = await db.agentLocationLog.findMany({
      where: { agentId: id },
      select: { timestamp: true },
      distinct: ['timestamp'],
      orderBy: { timestamp: 'desc' },
      take: 30
    })

    // Group by date
    const uniqueDates = [...new Set(
      datesWithLocations.map(l => 
        new Date(l.timestamp).toISOString().split('T')[0]
      )
    )]

    return NextResponse.json({
      agent: {
        id: agent.id,
        name: agent.user.name,
        email: agent.user.email
      },
      locations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        today: locationsToday,
        thisWeek: locationsThisWeek,
        total: totalLocations,
        datesWithData: uniqueDates
      }
    })
  } catch (error) {
    console.error('Error fetching agent locations:', error)
    return NextResponse.json({ error: 'Failed to fetch agent locations' }, { status: 500 })
  }
}


