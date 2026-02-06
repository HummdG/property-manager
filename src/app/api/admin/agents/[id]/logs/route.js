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
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
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

    // Type filter
    if (type && type !== 'all') {
      where.type = type.toUpperCase()
    }

    // Date range filter
    if (dateFrom || dateTo) {
      where.date = {}
      if (dateFrom) {
        where.date.gte = new Date(dateFrom)
      }
      if (dateTo) {
        const endDate = new Date(dateTo)
        endDate.setHours(23, 59, 59, 999)
        where.date.lte = endDate
      }
    }

    const [logs, total, typeStats] = await Promise.all([
      db.agentDailyLog.findMany({
        where,
        orderBy: { date: 'desc' },
        skip,
        take: limit
      }),
      db.agentDailyLog.count({ where }),
      db.agentDailyLog.groupBy({
        by: ['type'],
        where: { agentId: id },
        _count: true
      })
    ])

    // Calculate total duration
    const durationStats = await db.agentDailyLog.aggregate({
      where,
      _sum: { duration: true },
      _avg: { duration: true }
    })

    return NextResponse.json({
      agent: {
        id: agent.id,
        name: agent.user.name,
        email: agent.user.email
      },
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        byType: typeStats.reduce((acc, item) => {
          acc[item.type] = item._count
          return acc
        }, {}),
        totalDuration: durationStats._sum.duration || 0,
        avgDuration: Math.round(durationStats._avg.duration || 0)
      }
    })
  } catch (error) {
    console.error('Error fetching agent logs:', error)
    return NextResponse.json({ error: 'Failed to fetch agent logs' }, { status: 500 })
  }
}


