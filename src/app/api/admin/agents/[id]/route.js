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

    const agent = await db.agentProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            isActive: true,
            createdAt: true
          }
        },
        subscription: {
          include: {
            plan: true
          }
        }
      }
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Get detailed stats
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      totalInquiries,
      openInquiries,
      closedInquiries,
      closedThisMonth,
      totalLogs,
      logsThisWeek,
      logsToday,
      totalLocations,
      locationsToday,
      recentInquiries,
      recentLogs,
      inquiryByType,
      inquiryByStatus
    ] = await Promise.all([
      db.inquiry.count({ where: { agentId: id } }),
      db.inquiry.count({
        where: {
          agentId: id,
          status: { in: ['OPEN', 'CONTACTED', 'MEETING_SCHEDULED', 'FOLLOW_UP'] }
        }
      }),
      db.inquiry.count({
        where: {
          agentId: id,
          status: { in: ['ACCEPTED', 'CLOSED'] }
        }
      }),
      db.inquiry.count({
        where: {
          agentId: id,
          status: { in: ['ACCEPTED', 'CLOSED'] },
          closedAt: { gte: startOfMonth }
        }
      }),
      db.agentDailyLog.count({ where: { agentId: id } }),
      db.agentDailyLog.count({
        where: {
          agentId: id,
          date: { gte: startOfWeek }
        }
      }),
      db.agentDailyLog.count({
        where: {
          agentId: id,
          date: { gte: today }
        }
      }),
      db.agentLocationLog.count({ where: { agentId: id } }),
      db.agentLocationLog.count({
        where: {
          agentId: id,
          timestamp: { gte: today }
        }
      }),
      db.inquiry.findMany({
        where: { agentId: id },
        include: {
          property: { select: { name: true, address: true } },
          followUps: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      db.agentDailyLog.findMany({
        where: { agentId: id },
        orderBy: { date: 'desc' },
        take: 10
      }),
      db.inquiry.groupBy({
        by: ['type'],
        where: { agentId: id },
        _count: true
      }),
      db.inquiry.groupBy({
        by: ['status'],
        where: { agentId: id },
        _count: true
      })
    ])

    return NextResponse.json({
      agent,
      stats: {
        inquiries: {
          total: totalInquiries,
          open: openInquiries,
          closed: closedInquiries,
          closedThisMonth,
          byType: inquiryByType.reduce((acc, item) => {
            acc[item.type] = item._count
            return acc
          }, {}),
          byStatus: inquiryByStatus.reduce((acc, item) => {
            acc[item.status] = item._count
            return acc
          }, {})
        },
        logs: {
          total: totalLogs,
          thisWeek: logsThisWeek,
          today: logsToday
        },
        locations: {
          total: totalLocations,
          today: locationsToday
        }
      },
      recentInquiries,
      recentLogs
    })
  } catch (error) {
    console.error('Error fetching agent:', error)
    return NextResponse.json({ error: 'Failed to fetch agent' }, { status: 500 })
  }
}



