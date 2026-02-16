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
    const agentId = searchParams.get('agentId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const search = searchParams.get('search')
    const skip = (page - 1) * limit

    const where = {}

    // Agent filter
    if (agentId) {
      where.agentId = agentId
    }

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

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [logs, total, typeStats, durationStats, agents] = await Promise.all([
      db.agentDailyLog.findMany({
        where,
        include: {
          agent: {
            include: {
              user: {
                select: { id: true, name: true, email: true, image: true }
              }
            }
          }
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit
      }),
      db.agentDailyLog.count({ where }),
      db.agentDailyLog.groupBy({
        by: ['type'],
        where,
        _count: true
      }),
      db.agentDailyLog.aggregate({
        where,
        _sum: { duration: true },
        _avg: { duration: true },
        _count: true
      }),
      db.agentProfile.findMany({
        include: {
          user: {
            select: { id: true, name: true }
          },
          _count: {
            select: { dailyLogs: true }
          }
        },
        orderBy: {
          dailyLogs: { _count: 'desc' }
        }
      })
    ])

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalLogs: durationStats._count,
        totalDuration: durationStats._sum.duration || 0,
        avgDuration: Math.round(durationStats._avg.duration || 0),
        byType: typeStats.reduce((acc, item) => {
          acc[item.type] = item._count
          return acc
        }, {})
      },
      agents: agents.map(a => ({
        id: a.id,
        name: a.user?.name,
        logCount: a._count.dailyLogs
      }))
    })
  } catch (error) {
    console.error('Error fetching admin logs:', error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}


