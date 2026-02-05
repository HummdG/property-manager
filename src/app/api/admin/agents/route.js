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
    const search = searchParams.get('search')
    const status = searchParams.get('status') // active, inactive, all
    const skip = (page - 1) * limit

    const where = {}

    // Filter by availability status
    if (status === 'active') {
      where.isAvailable = true
    } else if (status === 'inactive') {
      where.isAvailable = false
    }

    // Search filter
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { licenseNumber: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [agents, total] = await Promise.all([
      db.agentProfile.findMany({
        where,
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
              plan: {
                select: { name: true }
              }
            }
          },
          _count: {
            select: {
              inquiries: true,
              dailyLogs: true,
              locationLogs: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.agentProfile.count({ where })
    ])

    // Fetch additional stats for each agent
    const agentsWithStats = await Promise.all(
      agents.map(async (agent) => {
        const [openInquiries, closedInquiries, recentLogs] = await Promise.all([
          db.inquiry.count({
            where: {
              agentId: agent.id,
              status: { in: ['OPEN', 'CONTACTED', 'MEETING_SCHEDULED', 'FOLLOW_UP'] }
            }
          }),
          db.inquiry.count({
            where: {
              agentId: agent.id,
              status: { in: ['ACCEPTED', 'CLOSED'] }
            }
          }),
          db.agentDailyLog.count({
            where: {
              agentId: agent.id,
              date: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
              }
            }
          })
        ])

        return {
          ...agent,
          stats: {
            totalInquiries: agent._count.inquiries,
            openInquiries,
            closedInquiries,
            totalLogs: agent._count.dailyLogs,
            recentLogs,
            locationLogs: agent._count.locationLogs
          }
        }
      })
    )

    // Summary stats
    const summary = await db.agentProfile.aggregate({
      _count: { id: true },
      _avg: { rating: true, completedDeals: true }
    })

    const activeAgents = await db.agentProfile.count({
      where: { isAvailable: true }
    })

    return NextResponse.json({
      agents: agentsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      summary: {
        totalAgents: summary._count.id,
        activeAgents,
        avgRating: summary._avg.rating || 0,
        avgCompletedDeals: Math.round(summary._avg.completedDeals || 0)
      }
    })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}

